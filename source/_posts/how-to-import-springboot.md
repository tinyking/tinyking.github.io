---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: Spring Boot依赖引入的多种方式
date: 2018-10-15 09:06:30
tags:
    - Java
categories:
    - 后端
---

使用Spring Boot开发，不可避免的会面临Maven依赖包版本的管理。

有如下几种方式可以管理Spring Boot的版本。

## 1. 使用parent继承
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>myproject</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.0.0.RELEASE</version>
    </parent>

    <!-- Additional lines to be added here... -->

</project>
```

使用parent继承的方式，简单、方便使用。但是有的时候项目又需要继承其他的parent，这个时候parent继承的方式就满足不了需求了。不过不用担心，还有其他方式。

## 2.使用import方式

```xml
<dependencyManagement>
        <dependencies>
        <dependency>
            <!-- Import dependency management from Spring Boot -->
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>2.0.0.RELEASE</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```
在parent的pom文件中，声明dependencyManagement，这样在实际的项目pom文件中，直接声明需要的spring boot包就可以，不需要填写version属性。

还有一种是使用maven plugin。

## 3.使用Spring boot Maven插件
```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```
spring boot依赖管理，根据不同的实际需求，选择不同的管理方式，可以大大提高效率。
