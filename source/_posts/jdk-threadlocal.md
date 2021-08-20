---
title: 细说ThreadLocal
date: 2021-07-28 13:10:50
tags:
    - JDK
categories:
    - 后端
index_img: https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.vfast.com.cn%2Fuploadfile%2F2017%2F0905%2F20170905051708372.jpg&refer=http%3A%2F%2Fwww.vfast.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1632028648&t=853f670d642f60c88808e9047a7fdf1b
---

## 1. ThreadLocal是什么

通过源码开头的注释，可以看出 `ThreadLocal`为线程提供了一个线程本局部变量。它和普通变量不同，是以静态变量的方式来使用，同时又很好地实现了线程隔离。

## 2. 怎么使用

### 2.1 官方实例

同样在源码开头的注释里面，提供了一个使用的例子：

```java
import java.util.concurrent.atomic.AtomicInteger;

public class ThreadId {
    // Atomic integer containing the next thread ID to be assigned
    private static final AtomicInteger nextId = new AtomicInteger(0);

    // Thread local variable containing each thread's ID
    private static final ThreadLocal<Integer> threadId =
        new ThreadLocal<Integer>() {
        @Override protected Integer initialValue() {
            return nextId.getAndIncrement();
        }
    };

    // Returns the current thread's unique ID, assigning it if necessary
    public static int get() {
        return threadId.get();
    }
}
   
```

在此例子中，直接使用`initialValue`的方法为实例进行数据初始化，实现每个线程在使用的过程中，都能获取一个单独的id。

```java
class ThreadIdRunnable implements Runnable {
    @Override
    public void run() {
        String name = Thread.currentThread().getName();
        System.out.println("Thread name is " + name + ", threadId is " + get());
    }
}
```

```java
 public static void main(String[] args) {
     Thread t1 = new Thread(new ThreadIdRunnable());
     Thread t2 = new Thread(new ThreadIdRunnable());
     t1.start();
     t2.start();
 }
```
执行结果：
```
Thread name is Thread-0, threadId is 0
Thread name is Thread-1, threadId is 1
```

### 2.2 应用场景

日常开发过程中，应用的场景也是比较多。比如：

- request的请求处理的过程中，需要在不同的方法中使用用户的登录信息。

## 3. 实现原理

### 3.1 数据结构

通过源码可以看到，数据是存储在**ThreadLocalMap**中的。**ThreadLocalMap**的是通过Entry数据（Entry[] table）实现的。

*Entry* 类如下

```java
static class Entry extends WeakReference<ThreadLocal<?>> {
    /** The value associated with this ThreadLocal. */
    Object value;

    Entry(ThreadLocal<?> k, Object v) {
        super(k);
        value = v;
    }
}
```

总结一下就是，ThreadLocal是由一个名为ThreadLocalMap的哈希映射。哈希映射是由继承了索引用的Entry对象组成的数组。

### 3.2 hash计算

ThreadLocal中的hash和平时创建类的hash code是有区别的。平时创建类时，都是通过重写hashCode方法。

在ThreadLocal直接使用了一个final变量threadLocalHashCode来表示ThreadLocal实例的hash值，以此值参与后面的逻辑处理。使用AtomicInteger来处理线程安全的问题。

在使用AtomicInteger生成threadLocalHashCode的过程中，使用了一个特殊的步长值 `HASH_INCREMENT = 0x61c88647`, 这个值可以实现threadLocalHashCode尽可能均匀的分布在2的N次幂的数组中，降低hash冲突的概率。可以在 [Why 0x61c88647?](https://www.javaspecialists.eu/archive/Issue164-Why-0x61c88647.html) 中找到相关的描述。

```java
    private final int threadLocalHashCode = nextHashCode();

    /**
     * The next hash code to be given out. Updated atomically. Starts at
     * zero.
     */
    private static AtomicInteger nextHashCode =
        new AtomicInteger();

    /**
     * The difference between successively generated hash codes - turns
     * implicit sequential thread-local IDs into near-optimally spread
     * multiplicative hash values for power-of-two-sized tables.
     */
    private static final int HASH_INCREMENT = 0x61c88647;

    /**
     * Returns the next hash code.
     */
    private static int nextHashCode() {
        return nextHashCode.getAndAdd(HASH_INCREMENT);
    }
```

## 4. 线程安全
ThreadLocal本身并不存储数据，数据实际是存储在使用它的Thread中的。

```java
    public void set(T value) {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null)
            map.set(this, value);
        else
            createMap(t, value);
    }

    ThreadLocalMap getMap(Thread t) {
        return t.threadLocals;
    }

    void createMap(Thread t, T firstValue) {
        t.threadLocals = new ThreadLocalMap(this, firstValue);
    }
```
同过为每个线程创建一个独立的ThreadLocalMap，实现数据的多线程隔离。

## 5. 内存泄漏

### 5.1 什么是内存泄漏
内存泄漏（Memory Leak）是指程序中已动态分配的堆内存由于某种原因程序未释放或无法释放，造成系统内存的浪费，导致程序运行速度减慢甚至系统崩溃等严重后果。

### 5.2 ThreadLocal的内存泄漏
很多文章中提到了使用ThreadLocal，可能会产生内存泄漏的，这是为什么呢？

上面也提到了ThreadLocal实际是为每个线程创建ThreadLocalMap，其引用被线程持有，这也就意味的ThreadLocalMap的生命周期和线程是一致的。线程结束了，ThreadLocalMap在GC的时候也会被回收。那它是怎产生内存泄漏的呢。

关于这个还是要从线程的使用方面着手分析。

我们知道线程资源是比较昂贵的，为了减少线程创建的开销，引入了池化技术。线程池有效的解决了复用的问题，减少频繁创建线程的问题。常用的池化技术有线程池，数据库连接池等等。

但是线程池的复用线程复用也引来了新的问题，那就是线程的生命周期被无限拉长。也就是说ThreadLocalMap也不会被回收了。同一线程不断的使用不同的ThreadLocal实例，而value不释放，从而产生内存泄漏。

可能有人会说，Entry是实现了WeakReference的，而弱引用在GC的时候会强制被回收的。没错，对于弱引用的确是在GC的时候会被回收的，但是Entry的key是ThreadLocal实例的所引用，也就是或在ThreadLocal实例只有Entry持有的时候，不会产生内存泄漏。

在实际使用ThreadLocal的过程中，会将其创建为静态变量：
```java
private static final ThreadLocal<Integer> threadId 
```
此时是强引用，在JVM的GC算法中，如果一个对象有它的强引用存在就不会被回收。

### 5.3 如何避免
ThreadLocal提供了remove方法，用来使用value资源。为了避免内存蝎落，需要在线程的业务逻辑结束的时候，主动的调用remove。

```java
/**
 * Remove the entry for key.
 */
private void remove(ThreadLocal<?> key) {
    Entry[] tab = table;
    int len = tab.length;
    int i = key.threadLocalHashCode & (len-1);
    for (Entry e = tab[i];
            e != null;
            e = tab[i = nextIndex(i, len)]) {
        if (e.get() == key) {
            e.clear();
            expungeStaleEntry(i);
            return;
        }
    }
}
```

