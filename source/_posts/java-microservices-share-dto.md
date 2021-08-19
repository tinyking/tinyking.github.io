---
title: 如何跨微服务共享DTO
date: 2020-08-11 09:27:00
tags:
    - Java
categories:
    - 后端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

## 1. 概述
近年来，微服务变得非常流行。微服务的基本特征之一是它们是模块化的、独立的、易于伸缩的。微服务需要一起工作并交换数据。为了实现这一点，我们创建一个称为dto的共享数据传输对象。

在本文中，我们将介绍在微服务之间共享dto的方法。

## 2. 将域对象暴露为DTO
表示应用程序域的模型使用微服务进行管理。领域模型是不同的关注点，我们将它们与DAO层中的数据模型分离开来。

这样做的主要原因是，我们不想通过服务向客户端公开领域的复杂性。相反，我们通过REST api在服务于应用程序客户机的服务之间公开dto。当dto在这些服务之间传递时，我们将它们转换为域对象。

![application_architecture_with_dtos_and_service_facade_original-1.png](https://i.loli.net/2020/08/11/GyVIkCacZOBNnWf.png)

上面的面向服务的体系结构示意图地显示了从DTO到域对象的组件和流程。

## 3.微服务之间的DTO共享
以客户订购产品的过程为例。这个过程基于客户订单模型。让我们从服务架构的角度来看这个过程。

假设客户服务向订单服务发送请求数据为:

```java
"order": {
    "customerId": 1,
    "itemId": "A152"
}
```

客户和订单服务使用契约相互通信。契约(另一种服务请求)以JSON格式显示。作为一个Java模型，OrderDTO类表示客户服务和订单服务之间的契约:

```java
public class OrderDTO {
    private int customerId;
    private String itemId;

    // constructor, getters, setters
}
```

### 3.1. 使用客户端模块(库)共享DTO
微服务需要来自其他服务的特定信息来处理任何请求。假设有第三个微服务接收订单支付请求。与订购服务不同，这项服务需要不同的客户信息:

```java
public class CustomerDTO {
    private String firstName;
    private String lastName;
    private String cardNumber;

    // constructor, getters, setters
}
```

如果我们还添加了送货服务，客户信息将有:

```java
public class CustomerDTO {
    private String firstName;
    private String lastName;
    private String homeAddress;
    private String contactNumber;

    // constructor, getters, setters
}
```

因此，将CustomerDTO类放在共享模块中不再满足预期的目的。为了解决这个问题，我们采用一种不同的方法。

在每个微服务模块中，让我们创建一个客户端模块(库)，在它旁边创建一个服务器模块:

```
order-service
|__ order-client
|__ order-server
```

订单客户端模块包含一个与客户服务共享的DTO。因此，订单客户端模块的结构如下:

```
order-service
└──order-client
     OrderClient.java
     OrderClientImpl.java
     OrderDTO.java
```

OrderClient是一个定义处理订单请求的订单方法的接口:

```java
public interface OrderClient {
    OrderResponse order(OrderDTO orderDTO);
}
```

为了实现order方法，我们使用RestTemplate对象向order服务发送一个POST请求:

```Java
String serviceUrl = "http://localhost:8002/order-service";
OrderResponse orderResponse = restTemplate.postForObject(serviceUrl + "/create",
  request, OrderResponse.class);
```

此外，订单客户端模块已经可以使用了。现在它变成了客户服务模块的依赖库:

```
[INFO] --- maven-dependency-plugin:3.1.2:list (default-cli) @ customer-service ---
[INFO] The following files have been resolved:
[INFO]    com.baeldung.orderservice:order-client:jar:1.0-SNAPSHOT:compile
```

当然，如果没有order-server模块向订单客户端公开“/create”服务端点，这就没有任何意义:

```Java
@PostMapping("/create")
public OrderResponse createOrder(@RequestBody OrderDTO request)
```

由于有了这个服务端点，客户服务可以通过其订单客户端发送订单请求。通过使用客户端模块，微服务以一种更隔离的方式彼此通信。DTO中的属性在客户机模块中更新。因此，合同的破坏仅限于使用相同客户端模块的服务。

## 4. 结论
在本文中，我们解释了在微服务之间共享DTO对象的方法。最好的情况是，我们通过制定特殊的契约作为microservice客户端模块(库)的一部分来实现这一点。通过这种方式，我们将服务客户端与包含API资源的服务器部分分离开来。因此，有一些好处:
- 服务之间的DTO代码中没有冗余
- 合同的破坏仅限于使用相同客户端库的服务
