---
title: 在生产中如何关闭Swagger-ui
date: 2021-06-28 13:10:50
tags:
    - Swagger
categories:
    - 后端
index_img: https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.zhimg.com%2Fv2-1b2f4bbab5617fca4bb118562ec97b4f_1200x500.jpg&refer=http%3A%2F%2Fpic1.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1632029423&t=765c7518a5e6ced63fd65e173525913b
---

## 1. 概述

Swagger用户界面允许我们查看关于REST服务的信息。这对于开发非常方便。然而，出于安全考虑，我们可能不希望在公共环境中允许这种行为。

在这个简短的教程中，我们将看看如何在生产中摆脱Swagger。

## 2. Swagger配置
为了使用Spring设置Swagger，我们在配置bean中定义它。

让我们创建一个SwaggerConfig类:

```java
@Configuration
@EnableSwagger2
public class SwaggerConfig implements WebMvcConfigurer {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2).select()
                .apis(RequestHandlerSelectors.basePackage("com.baeldung"))
                .paths(PathSelectors.regex("/.*"))
                .build();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("swagger-ui.html")
                .addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/");
    }
}
```

默认情况下，这个配置bean总是被注入到Spring上下文中。因此，Swagger可用于所有环境。

要在生产中禁用Swagger，让我们切换是否注入这个配置bean。

## 3.使用Spring配置文件

在Spring中，我们可以使用@Profile注释来启用或禁用bean的注入。

让我们尝试使用SpEL表达来匹配“swagger”的轮廓，而不是“prod”的配置:

```
@Profile({"!prod && swagger"})
```
这迫使我们明确的环境，我们想要激活昂首阔步。它还有助于防止在生产中意外地打开它。

我们可以在配置中添加注释:
```java
@Configuration
@Profile({"!prod && swagger"})
@EnableSwagger2
public class SwaggerConfig implements WebMvcConfigurer {
    ...
}
```

现在，让我们用spring.profiles的不同设置启动我们的应用程序来测试它是否工作 spring.profiles.active:

```
 -Dspring.profiles.active=prod // Swagger is disabled

 -Dspring.profiles.active=prod,anyOther // Swagger is disabled

 -Dspring.profiles.active=swagger // Swagger is enabled

 -Dspring.profiles.active=swagger,anyOtherNotProd // Swagger is enabled

 none // Swagger is disabled
```

## 4. 使用条件
对于特性切换来说，Spring概要文件可能是一个过于粗粒度的解决方案。这种方法会导致配置错误和冗长的、难以管理的概要文件列表。

作为另一种选择，我们可以使用@ConditionalOnExpression，它允许为启用bean指定自定义属性:

```java
@Configuration
@ConditionalOnExpression(value = "${useSwagger:false}")
@EnableSwagger2
public class SwaggerConfig implements WebMvcConfigurer {
    ...
}
```

如果“useSwagger”属性丢失，这里的默认值为false。

要测试这一点，我们可以在应用程序中设置该属性。属性(或application.yaml)文件，或设置为VM选项:

```
-DuseSwagger=true

```
我们应该注意，这个示例没有包含任何保证生产实例不会意外地将useSwagger设置为true的方法。

## 5. 避免陷阱
如果启用Swagger是一种安全问题，那么我们需要选择一种不会出错但易于使用的策略。

当我们使用@Profile时，一些SpEL表达可能会违背这些目标:
```java
@Profile({"!prod"}) // Leaves Swagger enabled by default with no way to disable it in other profiles
@Profile({"swagger"}) // Allows activating Swagger in prod as well
@Profile({"!prod", "swagger"}) // Equivalent to {"!prod || swagger"} so it's worse than {"!prod"} as it provides a way to activate Swagger in prod too
```

这就是为什么我们使用@Profile的例子:

```java
@Profile({"!prod && swagger"})
```
这个解决方案可能是最严格的，因为它在默认情况下禁用了Swagger，并保证在“prod”中不能启用它。

## 6. 总结
在本文中，我们研究了在生产中禁用Swagger的解决方案。

我们了解了如何通过@Profile和@ConditionalOnExpression注释来切换打开Swagger的bean。我们还考虑了如何防止错误配置和不希望看到的默认值。
