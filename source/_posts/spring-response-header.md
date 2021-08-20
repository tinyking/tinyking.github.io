---
title: 如何在Spring 5中设置响应头
date: 2020-08-18 18:27:00
tags:
    - Java
categories:
    - 后端
index_img: https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2F1f2abd1d67247ad82eda8069cd73c61a189b7ad1.jpg&refer=http%3A%2F%2Fi0.hdslb.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1632028951&t=4969344ee49ff8b1b313b3ceffe1c1d5
---
## 1. 概述
在这个快速教程中，我们将介绍在服务响应上设置头的不同方法，无论是针对非反应性端点，还是针对使用Spring 5 WebFlux框架的api。

我们可以在以前的文章中找到关于这个框架的更多信息。

## 2. 非反应性组件的header

如果我们想设置单个响应的头，我们可以使用HttpServletResponse或ResponseEntity对象。

另一方面，如果我们的目标是向所有或多个响应添加一个过滤器，则需要配置一个过滤器。

### 2.1. 使用HttpServletResponse

我们只需将HttpServletResponse对象作为参数添加到REST端点，然后使用addHeader()方法:

```java
@GetMapping("/http-servlet-response")
public String usingHttpServletResponse(HttpServletResponse response) {
    response.addHeader("Baeldung-Example-Header", "Value-HttpServletResponse");
    return "Response with header using HttpServletResponse";
}
```

如示例中所示，我们不必返回响应对象。

### 2.2. 使用ResponseEntity

在这种情况下，让我们使用ResponseEntity类提供的BodyBuilder:

```java
@GetMapping("/response-entity-builder-with-http-headers")
public ResponseEntity<String> usingResponseEntityBuilderAndHttpHeaders() {
    HttpHeaders responseHeaders = new HttpHeaders();
    responseHeaders.set("Baeldung-Example-Header",
      "Value-ResponseEntityBuilderWithHttpHeaders");

    return ResponseEntity.ok()
      .headers(responseHeaders)
      .body("Response with header using ResponseEntity");
}
```

HttpHeaders类提供了许多方便的方法来设置最常见的头信息。

### 2.3. 为所有响应添加header

现在假设我们想要为许多端点设置一个特定的头。

当然，如果我们必须在每个映射方法上复制前面的代码，那将是令人沮丧的。

更好的方法是在我们的服务中配置一个过滤器:

```java
@WebFilter("/filter-response-header/*")
public class AddResponseHeaderFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
      FilterChain chain) throws IOException, ServletException {
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        httpServletResponse.setHeader(
          "Baeldung-Example-Filter-Header", "Value-Filter");
        chain.doFilter(request, response);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // ...
    }

    @Override
    public void destroy() {
        // ...
    }
}
```

@WebFilter注释允许我们指出这个过滤器将对哪些urlPatterns有效。

正如我们在本文中指出的，为了让我们的过滤器被Spring发现，我们需要在Spring应用程序类中添加@ServletComponentScan注释:

```java
@ServletComponentScan
@SpringBootApplication
public class ResponseHeadersApplication {

    public static void main(String[] args) {
        SpringApplication.run(ResponseHeadersApplication.class, args);
    }
}
```

如果我们不需要@WebFilter提供的任何功能，我们可以通过在过滤器类中使用@Component注释来避免这最后一步。

## 3.响应性header

同样，我们将看到如何使用ServerHttpResponse、ResponseEntity或ServerResponse(针对功能性端点)类和接口在单个端点响应上设置报头。

我们还将学习如何实现一个Spring 5 WebFilter来在所有的响应中添加一个头。

### 3.1. 使用ServerHttpResponse

此方法与对应的HttpServletResponse非常相似:

```java
@GetMapping("/server-http-response")
public Mono<String> usingServerHttpResponse(ServerHttpResponse response) {
    response.getHeaders().add("Baeldung-Example-Header", "Value-ServerHttpResponse");
    return Mono.just("Response with header using ServerHttpResponse");
}
```
### 3.2. 使用ResponseEntity

我们可以使用ResponseEntity类，就像我们做的非反应端点:

```java
@GetMapping("/response-entity")
public Mono<ResponseEntity<String>> usingResponseEntityBuilder() {
    String responseHeaderKey = "Baeldung-Example-Header";
    String responseHeaderValue = "Value-ResponseEntityBuilder";
    String responseBody = "Response with header using ResponseEntity (builder)";

    return Mono.just(ResponseEntity.ok()
      .header(responseHeaderKey, responseHeaderValue)
      .body(responseBody));
}
```

### 3.3. 使用 ServerResponse
最后两小节中介绍的类和接口可以在@Controller注释类中使用，但不适合新的Spring 5 Functional Web框架。

如果我们想在HandlerFunction上设置一个头，那么我们需要得到ServerResponse接口:

```java
public Mono<ServerResponse> useHandler(final ServerRequest request) {
     return ServerResponse.ok()
        .header("Baeldung-Example-Header", "Value-Handler")
        .body(Mono.just("Response with header using Handler"),String.class);
}
```

### 3.4. 为所有响应添加header

最后，Spring 5提供了一个WebFilter接口来为服务检索到的所有响应设置一个头:

```java
@Component
public class AddResponseHeaderWebFilter implements WebFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        exchange.getResponse()
          .getHeaders()
          .add("Baeldung-Example-Filter-Header", "Value-Filter");
        return chain.filter(exchange);
    }
}
```

## 4. 结论
总之,我们学到许多不同的方式设置一个头的反应,如果我们想要把它放在一个端点或如果我们想配置所有rest api,即使我们迁移活性堆栈,现在我们有知识做所有这些事情。
