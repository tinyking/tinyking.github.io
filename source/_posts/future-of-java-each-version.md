---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: Java各版本特性
date: 2018-06-07
tags:
    - Java
categories:
    - 后端
---

# Java 5
1. 泛型Generics
2. 枚举类型Enumeration
3. 自动装箱（自动类型包装和解包）autoboxing & unboxing
4. 可变参数varargs（varargs number of arguments）
5. Annotations
6. 新的迭代语句
7. 静态导入
8. 新的格式化方法
9. 新的线程模型和并发库

# Java 6
1. 引入一个支持脚本引擎的新框架
2. UI的增强
3. 对WebService支持的增强
4. 一系列的安全相关的增强
5. JDBC 4.0
6. Compiler API
7. 通用的Annotations支持


# Java 7
1. switch中可以使用字符串
2. 泛型实例化类型自动推断
3. 语法上支持集合，而不一定是数组
4. 新增了一些取环境信息的工具方法
5. Boolean类型反转，空指针安全，参与为运算
6. 两个char间的equals
7. 安全的加减乘除
8. Map集合支持并发请求




# Java 8
1. Lambda表达式

2. 默认方法

3. 静态方法

4. 优化了HashMap以及ConcurrentHashMap
将HashMap原来的数组+链表的结构优化成了数组+链表+红黑树的结构，减少了hash碰撞造成的链表长度过长，时间复杂度过高的问题，ConcurrentHashMap则改进了原先的分段锁的方式，采用transient volatile HashEntry<K,V>[] table来保存数据。

5. JVM
PermGen空间被移除了，取而代之的是Metaspace。JVM选项-XX:PermSize与-XX:MaxPermSize分别被-XX:MetaSpaceSize与-XX:MaxMetaspaceSize所代替。
6. 新增原子性操作类LongAdder

7. 新增StampedLock

# Java 9
1. jshell
2. 私有接口方法
3. 更改了HTTP调动的相关API
4. 集合工厂方法
5. 改进了Stream API
