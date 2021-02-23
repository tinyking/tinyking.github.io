---
title: 如何在Spring REST Controller中获取header信息
date: 2020-08-17 18:27:00
tags:
    - Java
categories:
    - 后端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

# 1. 概述
在这个快速教程中，我们将了解如何在Spring Rest控制器中访问HTTP头信息。

首先，我们将使用@RequestHeader注释分别读取头信息，也可以一起读取头信息。

之后，我们将深入了解@RequestHeader的属性。

## 2. 访问HTTP头

### 2.1. 简单方法

如果我们需要访问一个特定的标题，我们可以配置@RequestHeader的标题名称:

```java
@GetMapping("/greeting")
public ResponseEntity<String> greeting(@RequestHeader("accept-language") String language) {
    // code that uses the language variable
    return new ResponseEntity<String>(greeting, HttpStatus.OK);
}
```

然后，我们可以使用传入方法的变量来访问值。如果在请求中没有找到名为accept-language的头，该方法将返回一个“400 Bad request”错误。

我们的头不必是字符串。例如，如果我们知道我们的头是一个数字，我们可以声明我们的变量为数值类型:

```java
@GetMapping("/double")
public ResponseEntity<String> doubleNumber(@RequestHeader("my-number") int myNumber) {
    return new ResponseEntity<String>(String.format("%d * 2 = %d",
      myNumber, (myNumber * 2)), HttpStatus.OK);
}
```

### 2.2. 一次性获取
如果我们不确定将出现哪些头，或者我们需要在方法签名中更多的头，我们可以使用@RequestHeader注释，而不需要特定的名称。

我们的变量类型有几个选择:Map、MultiValueMap或HttpHeaders对象。

首先，让我们以映射的方式获取请求头信息:

```java
@GetMapping("/listHeaders")
public ResponseEntity<String> listAllHeaders(
  @RequestHeader Map<String, String> headers) {
    headers.forEach((key, value) -> {
        LOG.info(String.format("Header '%s' = %s", key, value));
    });

    return new ResponseEntity<String>(
      String.format("Listed %d headers", headers.size()), HttpStatus.OK);
}
```

如果我们使用一个Map，而其中一个头文件有多个值，我们将只获得第一个值。这相当于MultiValueMap上使用getFirst方法。

如果我们的头可能有多个值，我们可以获得他们作为一个MultiValueMap:

```java
@GetMapping("/multiValue")
public ResponseEntity<String> multiValue(
  @RequestHeader MultiValueMap<String, String> headers) {
    headers.forEach((key, value) -> {
        LOG.info(String.format(
          "Header '%s' = %s", key, value.stream().collect(Collectors.joining("|"))));
    });

    return new ResponseEntity<String>(
      String.format("Listed %d headers", headers.size()), HttpStatus.OK);
}
```

我们也可以获得我们的头作为HttpHeaders对象:

```java
@GetMapping("/getBaseUrl")
public ResponseEntity<String> getBaseUrl(@RequestHeader HttpHeaders headers) {
    InetSocketAddress host = headers.getHost();
    String url = "http://" + host.getHostName() + ":" + host.getPort();
    return new ResponseEntity<String>(String.format("Base URL = %s", url), HttpStatus.OK);
}
```

HttpHeaders对象具有通用应用程序头的访问器.

当我们通过名称从Map、MultiValueMap或HttpHeaders对象访问一个头时，如果它不存在，我们将得到一个空值。

## 3. @RequestHeader 属性
现在我们已经讨论了使用@RequestHeader注释访问请求头的基础知识，让我们进一步看看它的属性。

我们已经隐式地使用了名称或值属性，当我们指定我们的头:

```java
public ResponseEntity<String> greeting(@RequestHeader("accept-language") String language) {}
```

我们可以通过使用name属性完成同样的事情:

```java
public ResponseEntity<String> greeting(
  @RequestHeader(name = "accept-language") String language) {}
```

接下来，让我们以同样的方式使用value属性:

```java
public ResponseEntity<String> greeting(
  @RequestHeader(value = "accept-language") String language) {}
```

当我们指定一个头时，默认情况下需要这个头。如果在请求中没有找到header，控制器将返回一个400错误。

让我们使用required属性来表示我们的头文件不是必需的:

```java
@GetMapping("/nonRequiredHeader")
public ResponseEntity<String> evaluateNonRequiredHeader(
  @RequestHeader(value = "optional-header", required = false) String optionalHeader) {
    return new ResponseEntity<String>(String.format(
      "Was the optional header present? %s!",
        (optionalHeader == null ? "No" : "Yes")),HttpStatus.OK);
}
```

因为如果请求中没有头文件，我们的变量将为空，所以我们需要确保进行适当的空检查。

让我们使用defaultValue属性为我们的头文件提供一个默认值:

```java
@GetMapping("/default")
public ResponseEntity<String> evaluateDefaultHeaderValue(
  @RequestHeader(value = "optional-header", defaultValue = "3600") int optionalHeader) {
    return new ResponseEntity<String>(
      String.format("Optional Header is %d", optionalHeader), HttpStatus.OK);
}
```

# 4. 结论
在这个简短的教程中，我们学习了如何在Spring REST控制器中访问请求头。首先，我们使用@RequestHeader注释为控制器方法提供请求头。

在了解了基础知识之后，我们详细了解了@RequestHeader注释的属性。
