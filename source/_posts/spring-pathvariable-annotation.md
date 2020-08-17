---
title: Spring @PathVariable注解
date: 2020-08-11 18:27:00
tags:
    - Spring
    - Java
categories:
    - 后端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

## 1. 概述
在这个快速教程中，我们将探索Spring的`@PathVariable`注解。

简单地说，`@PathVariable`注解可以用于处理请求URI映射中的模板变量，并将它们用作方法参数。

让我们看看如何使用`@PathVariable`及其各种属性。

## 2. 简单映射
`@PathVariable`注解的一个简单用例是一个端点，它标识一个具有主键的实体:

```Java
@GetMapping("/api/employees/{id}")
@ResponseBody
public String getEmployeesById(@PathVariable String id) {
    return "ID: " + id;
}
```

在本例中，我们使用@PathVariable注解来提取由变量{id}表示的URI模板化部分。

一个简单的GET请求`/api/employees/{id}`将调用getEmployeesById提取id值:

```text
http://localhost:8080/api/employees/111
----
ID: 111
```

现在，让我们进一步研究这个注解并查看它的属性。

## 3.指定路径变量名
在前面的示例中，我们跳过了定义模板路径变量的名称，因为方法参数的名称和路径变量的名称是相同的。

但是，如果路径变量名称不同，我们可以在`@PathVariable`注解的参数中指定:

```java
@GetMapping("/api/employeeswithvariable/{id}")
@ResponseBody
public String getEmployeesByIdWithVariableName(@PathVariable("id") String employeeId) {
    return "ID: " + employeeId;
}
```

```
http://localhost:8080/api/employeeswithvariable/1
----
ID: 1
```

为了清晰起见，我们还可以将路径变量名定义为`@PathVariable(value= "id")`，而不是`PathVariable("id")`。

## 4. 单个请求中的多个路径变量
根据用例，我们可以在控制器方法的请求URI中有多个路径变量，它也有多个方法参数:

```java
@GetMapping("/api/employees/{id}/{name}")
@ResponseBody
public String getEmployeesByIdAndName(@PathVariable String id, @PathVariable String name) {
    return "ID: " + id + ", name: " + name;
}
```

```
http://localhost:8080/api/employees/1/bar
----
ID: 1, name: bar
```

我们还可以使用类型为`java.util.Map<String, String >`的方法参数处理多个`@PathVariable`参数:

```java
@GetMapping("/api/employeeswithmapvariable/{id}/{name}")
@ResponseBody
public String getEmployeesByIdAndNameWithMapVariable(@PathVariable Map<String, String> pathVarsMap) {
    String id = pathVarsMap.get("id");
    String name = pathVarsMap.get("name");
    if (id != null && name != null) {
        return "ID: " + id + ", name: " + name;
    } else {
        return "Missing Parameters";
    }
}
```

```
http://localhost:8080/api/employees/1/bar
----
ID: 1, name: bar
```

## 5. 可选路径变量
在Spring中，使用`@PathVariable`注解的方法参数在默认情况下是必需的:

```java
@GetMapping(value = { "/api/employeeswithrequired", "/api/employeeswithrequired/{id}" })
@ResponseBody
public String getEmployeesByIdWithRequired(@PathVariable String id) {
    return "ID: " + id;
}
```

从它的外观来看，上面的控制器应该同时处理`/api/employeeswithrequired`和`/api/employeeswithrequired/1`请求路径。但是，由于@PathVariables标注的方法参数在默认情况下是强制的，所以它不处理发送到`/api/employeeswithrequired`路径的请求:

```
http://localhost:8080/api/employeeswithrequired
----
{"timestamp":"2020-07-08T02:20:07.349+00:00","status":404,"error":"Not Found","message":"","path":"/api/employeeswithrequired"}

http://localhost:8080/api/employeeswithrequired/1
----
ID: 111
```

我们有两种处理方法。

### 5.1. 将@PathVariable设置为不需要
我们可以将`@PathVariable`的必需属性设置为`false`，使其可选。因此，修改我们之前的例子，我们现在可以处理有和没有路径变量的URI版本:

```java
@GetMapping(value = { "/api/employeeswithrequiredfalse", "/api/employeeswithrequiredfalse/{id}" })
@ResponseBody
public String getEmployeesByIdWithRequiredFalse(@PathVariable(required = false) String id) {
    if (id != null) {
        return "ID: " + id;
    } else {
        return "ID missing";
    }
}
```

```
http://localhost:8080/api/employeeswithrequiredfalse
----
ID missing
```

### 5.2. 使用java.util.Optional
从Spring 4.1开始，我们还可以使用`java.util.Optional<T>`(在Java 8+中可用)来处理一个非强制路径变量:

```java
@GetMapping(value = { "/api/employeeswithoptional", "/api/employeeswithoptional/{id}" })
@ResponseBody
public String getEmployeesByIdWithOptional(@PathVariable Optional<String> id) {
    if (id.isPresent()) {
        return "ID: " + id.get();
    } else {
        return "ID missing";
    }
}
```

现在，如果我们没有在请求中指定路径变量id，我们会得到默认响应:

```
http://localhost:8080/api/employeeswithoptional
----
ID missing
```

### 5.3. 使用类型为Map<String, String>的方法参数
如前面所示，我们可以使用`java.util.Map<String, String>`类型的单个方法参数。映射以处理请求URI中的所有路径变量。我们也可以使用这个策略来处理可选路径变量的情况:

```java
@GetMapping(value = { "/api/employeeswithmap/{id}", "/api/employeeswithmap" })
@ResponseBody
public String getEmployeesByIdWithMap(@PathVariable Map<String, String> pathVarsMap) {
    String id = pathVarsMap.get("id");
    if (id != null) {
        return "ID: " + id;
    } else {
        return "ID missing";
    }
}
```

## 6. @PathVariable的默认值
在开箱即用的情况下，没有为用`@PathVariable`注解的方法参数定义默认值的规定。但是，我们可以使用上面讨论的相同策略来满足`@PathVariable`的默认值情况。我们只需要检查路径变量是否为null。

例如，使用`java.util.Optional<String>`，我们可以确定路径变量是否为空。如果它是null，那么我们可以响应请求的默认值:

```java
@GetMapping(value = { "/api/defaultemployeeswithoptional", "/api/defaultemployeeswithoptional/{id}" })
@ResponseBody
public String getDefaultEmployeesByIdWithOptional(@PathVariable Optional<String> id) {
    if (id.isPresent()) {
        return "ID: " + id.get();
    } else {
        return "ID: Default Employee";
    }
}
```

## 7. 结论
在本文中，我们讨论了如何使用Spring的@PathVariable注解。我们还确定了有效使用`@PathVariable`注解来适应不同用例的各种方法，比如可选参数和处理默认值。
