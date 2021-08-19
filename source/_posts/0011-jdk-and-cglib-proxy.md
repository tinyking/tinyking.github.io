---
title: 动态代理：JDK动态代理和CGLIB代理的区别
date: 2018-11-26 18:24:30
tags:
    - Java
categories:
    - 后端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---


代理模式：代理类和被代理类实现共同的接口（或继承），代理类中存有被代理类的索引，实际执行时通过调用代理类的方法，实际执行的是被代理类的方法。

![](http://img.hb.aicdn.com/29f71c9def992be7b94c3566c6a7fd03bdcb93df32f3-49dKXs_fw658)

而AOP，是通过动态代理实现的。

一、简单来说：

　　JDK动态代理只能对实现了接口的类生成代理，而不能针对类

　　CGLIB是针对类实现代理，主要是对指定的类生成一个子类，覆盖其中的方法（继承）

二、Spring在选择用JDK还是CGLiB的依据：

   (1)当Bean实现接口时，Spring就会用JDK的动态代理

   (2)当Bean没有实现接口时，Spring使用CGlib是实现

　  (3)可以强制使用CGlib（在spring配置中加入<aop:aspectj-autoproxy proxy-target-class="true"/>）

三、CGlib比JDK快？

　 (1)使用CGLib实现动态代理，CGLib底层采用ASM字节码生成框架，使用字节码技术生成代理类，比使用Java反射效率要高。唯一需要注意的是，CGLib不能对声明为final的方法进行代理，因为CGLib原理是动态生成被代理类的子类。

　 (2)在对JDK动态代理与CGlib动态代理的代码实验中看，1W次执行下，JDK7及8的动态代理性能比CGlib要好20%左右。

> 作者：Big_Monkey
> 原文地址: [动态代理：JDK动态代理和CGLIB代理的区别](https://www.cnblogs.com/bigmonkeys/p/7823268.html)
