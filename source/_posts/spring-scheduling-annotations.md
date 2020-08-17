---
title: Spring 调度注解
date: 2020-08-06 18:27:00
tags:
    - Spring
    - Java
categories:
    - 后端
excerpt: 本文介绍了Spring 调度的常用注解。
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

## 1. 概述
当单线程执行任务不能满足需求时，我们可以使用`org.springframework.scheduling.annotation`包的注解。

在这个快速教程中，我们将探索Spring调度注解。

## 2. @EnableAsync
通过这个注释，我们可以在Spring中启用异步功能。

我们必须使用`@Configuration`:

```Java
@Configuration
@EnableAsync
class VehicleFactoryConfig {}
```

现在，我们已经启用了异步调用，我们可以使用`@Async`来定义支持它的方法。

## 3. @EnableScheduling
通过这个注释，我们可以在应用程序中启用调度。

我们还必须将它与@Configuration一起使用:
```Java
@Configuration
@EnableScheduling
class VehicleFactoryConfig {}
```
因此，我们现在可以使用`@Scheduled`定期运行方法。

## 4. @Async
我们可以定义希望在不同线程上执行的方法，从而异步地运行它们。

为了实现这一点，我们可以用@Async注释方法:

```Java
@Async
void repairCar() {
    // ...
}
```
如果我们将这个注释应用到一个类，那么所有方法都将被异步调用。

注意，我们需要使用@EnableAsync或XML配置启用异步调用，以使该注释工作。

## 5. @Scheduled
如果我们需要一个方法定期执行，我们可以使用这个注释:

```Java
@Scheduled(fixedRate = 10000)
void checkVehicle() {
    // ...
}
```
我们可以使用它在固定的时间间隔内执行一个方法，或者我们可以使用类似cron的表达式对其进行微调。

`@Scheduled`利用了Java 8的重复注释功能，这意味着我们可以用它多次标记一个方法:
```Java
@Scheduled(fixedRate = 10000)
@Scheduled(cron = "0 * * * * MON-FRI")
void checkVehicle() {
    // ...
}
```

注意，用@Scheduled注释的方法应该有一个空返回类型。

此外，我们必须使这个注释的调度能够与@EnableScheduling或XML配置一起工作。

## 6. @Schedules
我们可以使用这个注释来指定多个`@Scheduled`规则:
```Java
@Schedules({
@Scheduled(fixedRate = 10000),
@Scheduled(cron = "0 * * * * MON-FRI")
})
void checkVehicle() {
  // ...
}
```
注意，自从Java 8以来，我们可以通过上面描述的重复注释功能实现相同的功能。

## 7. 结论
在本文中，我们概述了最常见的Spring调度注释。
