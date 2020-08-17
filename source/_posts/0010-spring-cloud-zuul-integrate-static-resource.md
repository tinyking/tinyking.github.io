---
title: Spring Cloud Zuul集成静态资源
date: 2018-11-23 14:24:30
tags:
    - Zuul
    - Spring Cloud
categories:
    - 后端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

项目中需要将前端的静态资源打包集成到zuul中，直接将静态资源放到zuul项目的/src/main/resources/static下，通过浏览器访问，发现无法访问。原因是zuul对所有的请求都进行了路由转发。

一开始的配置如下：

```
zuul:
    servlet-path: /
    sensitive-headers:
```

在这种配置下，zuul对于后台其他restful服务进行的自动转发：

如eureka中注册了a服务，当访问`/a/service`时，zuul自动将该请求转发到a服务上。

通过修改配置，实现了静态资源的集成，配置如下：

```
zuul:
# servlet-path: /
    sensitive-headers:
    ignored-services: '*'
    routes:
        a: /a/**
        b: /b/**
```

禁用zuul的自动路由配置，通过指定路由，去掉`serlvet-path`

实现集成静态资源。
