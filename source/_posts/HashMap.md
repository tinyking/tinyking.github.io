---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: HashMap
date: 2016-07-19 09:06:30
tags:
    - Java
categories:
    - 后端
---

> 代码基于JDK 1.8


## 基数知识
Map是保存了Key-Value键值对的数据集合接口。HashMap是基于HashCode的Map实现。因为基于Key的HashCode进行存储，所以HashMap中Key都是唯一的。
- **HashMap中Key，Value均可以为null。**

## 源码解析

### 类声明
```java
public class HashMap<K, V> extends AbstractMap<K,V> implements Map<K, V>, Cloneable, Serializable {
    // ...
}
```
* `Map` -  `AbstractMap<K,V>`本身实现了`Map<K,V>`接口，在这里再次强调了`HashMap`实现了`Map`
* `Cloneable`  实现了克隆接口
* `Serializable`  实现了序列化接口

### 数据结构
```java
/**
 * table, 在初次使用时进行初始化, 必要时进行大小调整。
 * 在分配大小时，长度总是 2的幂
 */
transient Node<K,V>[] table;


// Node静态内部类，链表数据结构
static class Node<K, V> implements Map.Entry<K, V> {
    final int hash;
    final K key;
    V value;
    Node<K, V> next;
    Node(int hash, K key, V value, Node<K,V> next) {
        this.hash = hash;
        this.key = key;
        this.value = value;
        this.next = next;
    }
}
```


上面代码描述了`HashMap`的底层数据结构：`数组` + `链表`。
>*在1.8中，增加了红黑树，带详细研究...*

### 构造函数
对于构造函数，提供了多个重载，以方便创建实例：
```java
public HashMap()
public HashMap(int initialCapacity)
public HashMap(int initialCapacity, float loadFactor)
public HashMap(Map<? extends K, ? extends V> m)
```
在构造函数中，`initialCapacity`和`loadFactor`两个参数对map的性能有很大的影响。
* `initialCapacity`: 初始化大小， 即`table`数组的长度，如果此值太小，可能会因引起`table`频繁调整数组大小，如果太大，实际内容很少，则造成资源浪费，默认 1 << 4。
* `loadFactor`: 加载因子，取值范围（0,1）的浮点数，如果此值太小，可能会因引起`table`频繁调整数组大小，如果太大，`table`大小很长时间不调整，调整时内容移动大。默认值0.75

```java
i = (n - 1) & h;
```
计算key在table中的索引,h为key的hashcode，n为当前table的大小。

HashMap为非线程安全Map，其中key和value均可以为null。
