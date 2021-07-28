---
title: Spring Boot集成Caffeine缓存
date: 2020-08-12 18:27:00
tags:
    - Spring
    - Java
categories:
    - 后端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

## 1. 概述
Caffeine缓存是一个高性能的Java缓存库。在这个简短的教程中，我们将看到如何在Spring Boot中使用它。

## 2. 依赖

要在Spring Boot中使用Caffeine缓存，我们首先要添加 `spring-boot-starter-cache`和 `caffeine`依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-cache</artifactId>
    </dependency>
    <dependency>
        <groupId>com.github.ben-manes.caffeine</groupId>
        <artifactId>caffeine</artifactId>
    </dependency>
</dependencies>
```

它们导入基本的Spring缓存支持，以及caffeine库。

## 3. 配置
现在我们需要在Spring引导应用程序中配置缓存。

首先，我们制作了一种caffeine bean。这是主要配置，将控制缓存行为，如过期，缓存大小限制，以及更多:

```java
@Bean
public Caffeine caffeineConfig() {
    return Caffeine.newBuilder().expireAfterWrite(60, TimeUnit.MINUTES);
}
```

接下来，我们需要使用Spring CacheManager接口创建另一个bean。Caffeine提供了这个接口的实现，它需要我们上面创建的Caffeine对象:

```java
@Bean
public CacheManager cacheManager(Caffeine caffeine) {
  CaffeineCacheManager caffeineCacheManager = new CaffeineCacheManager();
  caffeineCacheManager.setCaffeine(caffeine);
  return caffeineCacheManager;
}
```

最后，我们需要在Spring Boot中使用@EnableCaching注释启用缓存。这可以添加到应用程序中的任何@Configuration类中。

## 4. 示例
启用缓存并配置为使用Caffeine后，让我们通过几个示例来了解如何在Spring Boot应用程序中使用缓存。

在Spring Boot中使用缓存的主要方法是使用@Cacheable注释。这个注释适用于Spring bean的任何方法(甚至是整个类)。它指示已注册的缓存管理器将方法调用的结果存储在缓存中。

一个典型的用法是在服务类内部:

```java
@Service
public class AddressService {
    @Cacheable
    public AddressDTO getAddress(long customerId) {
        // lookup and return result
    }
}
```

使用不带参数的@Cacheable注释将迫使Spring为缓存和缓存键使用默认名称。

我们可以通过在注释中添加一些参数来覆盖这两种行为:

```java
@Service
public class AddressService {
    @Cacheable(value = "address_cache", key = "customerId")
    public AddressDTO getAddress(long customerId) {
        // lookup and return result
    }
}
```

上面的示例告诉Spring使用名为address_cache的缓存和缓存键的customerId参数。

最后，因为缓存管理器本身就是一个Spring bean，我们也可以将它自动绑定到任何其他bean中，并直接使用它:

```java
@Service
public class AddressService {

    @Autowired
    CacheManager cacheManager;

    public AddressDTO getAddress(long customerId) {
        if(cacheManager.containsKey(customerId)) {
            return cacheManager.get(customerId);
        }

        // lookup address, cache result, and return it
    }
}
```

## 5. 结论

在本教程中，我们看到了如何配置Spring Boot来使用咖啡因缓存，以及如何在应用程序中使用缓存的一些示例。
