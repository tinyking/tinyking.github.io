---
title: Spring Web注解
date: 2020-08-06 09:27:00
tags:
    - Spring
    - Java
categories:
    - 后端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

<a name="UQpVy"></a>
## 1. 概述
在本教程中，我们将探索来自`org.springframework.web.bind.annotation`  的Spring Web注解。
<a name="9cM9q"></a>
## 2. @RequestMapping
简单地说，@RequestMapping标记了@Controller类内部的请求处理程序方法;它可以配置使用:

- path, name, value：方法映射到哪个URL
- method： 兼容的HTTP方法
- params： 根据HTTP参数的存在、不存在或值过滤请求
- headers：根据HTTP头的存在、不存在或值过滤请求
- consumes：该方法可以在HTTP请求体中使用哪些媒体类型
- produces：该方法可以在HTTP响应体中生成哪些媒体类型



下面是一个简单的例子:
```java
@Controller
class VehicleController {

    @RequestMapping(value = "/vehicles/home", method = RequestMethod.GET)
    String home() {
        return "home";
    }
}
```
如果我们在类级别上应用这个注解，我们可以为@Controller类中的所有处理程序方法提供默认设置。唯一的例外是URL, Spring不会用方法级别设置覆盖它，而是添加了两个路径部分。<br />例如，下面的配置与上面的配置具有相同的效果:
```java
@Controller
@RequestMapping(value = "/vehicles", method = RequestMethod.GET)
class VehicleController {

    @RequestMapping("/home")
    String home() {
        return "home";
    }
}
```
此外，@GetMapping、@PostMapping、@PutMapping、@DeleteMapping和@PatchMapping是@RequestMapping的不同变体，它们的HTTP方法已经分别设置为GET、POST、PUT、DELETE和PATCH。自Spring 4.3发布以来就可以使用了。

<a name="WwiLL"></a>
## 3. _@RequestBody_
让我们转到@RequestBody——它将HTTP请求体映射到一个对象:
```java
@PostMapping("/save")
void saveVehicle(@RequestBody Vehicle vehicle) {
    // ...
}
```
反序列化是自动的，取决于请求的内容类型。
<a name="sEKrI"></a>
## 4. _@PathVariable_
接下来，让我们讨论@PathVariable。<br />此注解指示方法参数绑定到URI模板变量。我们可以用@RequestMapping注解指定URI模板，并用@PathVariable将方法参数绑定到模板的一个部分。<br />我们可以通过名称或其别名，value参数来实现这一点:
```java
@RequestMapping("/{id}")
Vehicle getVehicle(@PathVariable("id") long id) {
    // ...
}
```
如果模板中部件的名称与方法参数的名称相匹配，我们不需要在注解中指定:
```java
@RequestMapping("/{id}")
Vehicle getVehicle(@PathVariable long id) {
    // ...
}
```
此外，我们可以通过将参数required设置为false来标记一个可选的path变量:
```java
	@RequestMapping("/{id}")
Vehicle getVehicle(@PathVariable(required = false) long id) {
    // ...
}
```
<a name="BDUT9"></a>
## 5. _@RequestParam_
我们使用@RequestParam来访问HTTP请求参数:
```java
@RequestMapping
Vehicle getVehicleByParam(@RequestParam("id") long id) {
    // ...
}
```
它具有与@PathVariable注解相同的配置选项。<br />除了这些设置，使用@RequestParam，我们可以在Spring在请求中没有发现值或空值时指定注入值。要实现这一点，我们必须设置defaultValue参数。<br />提供默认值隐式设置required为false:
```java
@RequestMapping("/buy")
Car buyCar(@RequestParam(defaultValue = "5") int seatCount) {
    // ...
}
```
除了参数，我们还可以访问其他HTTP请求部分:cookie和头。我们可以分别使用注解@CookieValue和@RequestHeader来访问它们。<br />我们可以像配置@RequestParam一样配置它们。
<a name="dk8Ws"></a>
## 6. 响应处理注解
在下一节中，我们将看到在Spring MVC中操作HTTP响应的最常见注解。
<a name="X6lxC"></a>
### 6.1. _@ResponseBody_
如果我们用@ResponseBody标记一个请求处理程序方法，Spring将该方法的结果作为响应本身:
```java
@ResponseBody
@RequestMapping("/hello")
String hello() {
    return "Hello World!";
}
```
如果我们用这个注解一个@Controller类，所有请求处理程序方法都将使用它。
<a name="jA56P"></a>
### 6.2. _@ExceptionHandler_
通过这个注解，我们可以声明一个自定义错误处理程序方法。当请求处理程序方法抛出任何指定的异常时，Spring将调用此方法。<br />捕获的异常可以作为参数传递给方法:
```java
@ExceptionHandler(IllegalArgumentException.class)
void onIllegalArgumentException(IllegalArgumentException exception) {
    // ...
}
```
<a name="XYlN6"></a>
### 6.3. _@ResponseStatus_
如果我们用这个注解一个请求处理程序方法，我们可以指定响应所需的HTTP状态。我们可以使用code参数声明状态代码，或者使用它的别名(value参数)声明状态代码。<br />同样，我们可以使用理由论证来提供一个理由。<br />我们也可以与@ExceptionHandler一起使用:
```java
@ExceptionHandler(IllegalArgumentException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
void onIllegalArgumentException(IllegalArgumentException exception) {
    // ...
}
```
<br />
<a name="rFgZ1"></a>
## 7. Other Web Annotations
有些注解不直接管理HTTP请求或响应。在下一节中，我们将介绍最常见的一些。
<a name="AY8Bw"></a>
### 7.1. _@Controller_
我们可以用@Controller定义Spring MVC控制器。

<a name="0rBHY"></a>
### 7.2. _@RestController_
@RestController组合了@Controller和@ResponseBody。<br />因此，以下声明是等价的:
```java
@Controller
@ResponseBody
class VehicleRestController {
    // ...
}
```
```java
@RestController
class VehicleRestController {
    // ...
}
```
<a name="2ptsv"></a>
### 7.3. _@ModelAttribute_
通过这个注解，我们可以通过提供模型键来访问已经在MVC @Controller模型中的元素:
```java
@PostMapping("/assemble")
void assembleVehicle(@ModelAttribute("vehicle") Vehicle vehicleInModel) {
    // ...
}
```
就像@PathVariable和@RequestParam一样，如果参数同名，我们不需要指定模型键:
```java
@PostMapping("/assemble")
void assembleVehicle(@ModelAttribute Vehicle vehicle) {
    // ...
}
```
除此之外，@ModelAttribute还有另一个用途:如果我们用它注解一个方法，Spring会自动将该方法的返回值添加到模型中:
```java
@ModelAttribute("vehicle")
Vehicle getVehicle() {
    // ...
}
```
像以前一样，我们不需要指定模型键，Spring默认使用方法名:
```java
@ModelAttribute
Vehicle vehicle() {
    // ...
}
```
在Spring调用请求处理程序方法之前，它调用类中所有@ModelAttribute注解的方法。
<a name="K6fLF"></a>
### 7.4. _@CrossOrigin_
@CrossOrigin为带注解的请求处理程序方法启用跨域通信:
```java
@CrossOrigin
@RequestMapping("/hello")
String hello() {
    return "Hello World!";
}
```
如果我们用它标记一个类，它将应用于其中的所有请求处理程序方法。<br />我们可以使用这个注解的参数微调CORS行为。

<a name="bpOLE"></a>
## 8. 结论
在本文中，我们了解了如何使用Spring MVC处理HTTP请求和响应。<br />
