---
title: Spring Boot注解
date: 2020-08-06 18:27:00
tags:
    - Spring
    - Java
categories:
    - 后端
excerpt: 本文介绍了Spring Boot的常用注解。
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

# Spring Boot注解
## 概述
Spring Boot通过其自动配置特性使Spring的配置更加容易。

在这个快速教程中，我们将探索`org.springframework.boot.autoconfigure`和 `org.springframework.boot.autoconfigure.condition`包。

## 2. @SpringBootApplication

我们使用这个注解来标记Spring Boot应用程序的主类:

```Java
@SpringBootApplication
class VehicleFactoryApplication {

    public static void main(String[] args) {
        SpringApplication.run(VehicleFactoryApplication.class, args);
    }
}
```

`@SpringBootApplication`用默认属性封装了`@Configuration`、`@EnableAutoConfiguration`和`@ComponentScan`注解。

## 3. @EnableAutoConfiguration
`@EnableAutoConfiguration`，顾名思义，启用自动配置。这意味着Spring Boot在它的类路径中查找自动配置bean，并自动应用它们。

注意，我们必须使用@Configuration的注释:

```Java
@Configuration
@EnableAutoConfiguration
class VehicleFactoryConfig {}

```

## 4. 自动配置条件
通常，当我们编写自定义的自动配置时，我们希望Spring有条件地使用它们。我们可以通过本节中的注释实现这一点。

我们可以将注释放在`@Configuration`类或`@Bean`方法上。

### 4.1. @ConditionalOnClass 和 @ConditionalOnMissingClass
使用这些条件，Spring只会在注释参数中的类存在/不存在的情况下使用标记的自动配置bean:

```Java
@Configuration
@ConditionalOnClass(DataSource.class)
class MySQLAutoconfiguration {
    //...
}
```
### 4.2. @ConditionalOnBean 和 @ConditionalOnMissingBean
我们可以使用这些注释来定义基于特定bean的存在或不存在的条件:

```Java
@Bean
@ConditionalOnBean(name = "dataSource")
LocalContainerEntityManagerFactoryBean entityManagerFactory() {
    // ...
}
```

### 4.3. @ConditionalOnProperty
通过这个注释，我们可以为属性的值设置条件:

```Java
@Bean
@ConditionalOnProperty(
    name = "usemysql",
    havingValue = "local"
)
DataSource dataSource() {
    // ...
}
```

### 4.4. @ConditionalOnResource
我们可以让Spring只在有特定资源时使用定义:

```Java
@ConditionalOnResource(resources = "classpath:mysql.properties")
Properties additionalProperties() {
    // ...
}
```

### 4.5. @ConditionalOnWebApplication 和 @ConditionalOnNotWebApplication
通过这些注释，我们可以根据当前应用程序是否是web应用程序来创建条件:

```Java
@ConditionalOnWebApplication
HealthCheckController healthCheckController() {
    // ...
}
```

### 4.6. @ConditionalExpression
我们可以在更复杂的情况下使用此注释。当SpEL表达式被赋值为真时，Spring将使用标记的定义:

```Java
@Bean
@ConditionalOnExpression("${usemysql} && ${mysqlserver == 'local'}")
DataSource dataSource() {
    // ...
}
```

### 4.7. @Conditional
对于更复杂的条件，我们可以创建一个评估自定义条件的类。我们告诉Spring使用`@Conditional`:

```Java
@Conditional(HibernateCondition.class)
Properties additionalProperties() {
  //...
}
```

## 5. 结论
在本文中，我们概述了如何调优自动配置过程，并为自定义自动配置bean提供条件。
