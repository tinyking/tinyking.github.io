---
title: Java 8中的Optional
tags:
---

在Java日常开发中，经常遇见的异常就是`NullPointerException`,  **NPE**异常时JVM在运行时跑出的运行时异常。

`null`值需要在使用前进行处理，通常的做法是先判断`if (value != null)`, 然后再在`if`代码中使用value值进行逻辑操做。

在Java 8中提供了Optional来处理value为null的情况，避免对象在进行业务逻辑处理时空指针的问题。


## Optional处理null值

假设我们有一个关于员工信息查询的DAO接口：


```java
Employee findEmployee(String id) {
    ...
}
```

这个接口提供了一个根据id查询员工信息，在业务中获取目标员工的名字：

```java
Employee employee = findEmployee("1234");
System.out.println("Employee's Name = " + employee.getName());
```
在这里，使用了查询出来的`employee`, 并获取其name属性的内容。如果在系统中不存在id为"1234"的员工，那么此时的employee就为null，employee.getName()时，JVM就会抛出空指针异常。


```java
Optional<Employee> findEmployee(String id) {
    ...
}
```

