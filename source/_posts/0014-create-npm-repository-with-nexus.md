---
title: 【Nexus系列】之npm私服库配置
date: 2018-12-21 15:44:01
tags:
    - Npm
    - Nexus
categories:
    - 工具
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---



![](https://ws1.sinaimg.cn/large/806e3151ly1fyd08s62ypj20xc0dwwmr.jpg)

# 创建Repository
Nexus Repository Manager 3 可以用于多种类型的包管理。 因工作需要，需要配置基于Nexus 3的npm包管理。


> Nexus默认账号: admin/admin123

![](https://ws1.sinaimg.cn/large/806e3151ly1fycz6n4q9cj20xr0hrac9.jpg)

1. 选择配置页面
2. 选择左侧的Repositories
3. 点击Create repository功能

![](https://ws1.sinaimg.cn/large/806e3151ly1fycz8kaf4jj20gk0o7ta9.jpg)

这样就会看到Nexus 3支持的repository类型。对于Java开发者maven2的应该就很熟悉了。

仔细观察会发现，每一种repository都包含三种类型可以创建, group, hosted,proxy。下面分别对每种做说明：

- proxy

根据proxy名字，就可以想象的出这种类型的repository是用来坐代理的。比如我们在建Maven私服，需要和中央库连通，此时就需要用proxy来创建repository。见Nexus模式的maven-central库。

- hosted

这种repository可以简单的理解为用于私有的，内部的repository。我们工作中开发的一些工具，组件库等不方便放到中央库，但是却又需要在公司内部共享，就需要创建hosted类型的repository，用于发布公司内部的组件。见maven-releases, maven-snapshots。

- group

最后来说说group类型。其实这种类型是一种虚拟的repository，用于将proxy和hosted类型的repository组合成一个，方便使用者使用。如maven-public, 在里面既包含了maven-central，同时也包含了maven-releases, maven-snapshots,这样，不管是网上中央库的jar包，还是我们自己发布的jar都可以通过maven-public来获取到。

结合maven repository配置的经验，对于npm repository也采用同样的套路配置。

1. 配置proxy库

![](https://ws1.sinaimg.cn/large/806e3151ly1fyczoph1jbj20kj0dbdgk.jpg)
在proxy类型的配置界面，发现里面的Name、Remote storage是必填的。Name可以随便填。Remote storage需要填类似maven中央库的地址，这里npm的选择淘宝的私服地址`https://registry.npm.taobao.org`

2. 配置hosted库
![](https://ws1.sinaimg.cn/large/806e3151ly1fyczsmhcnbj20is0i6wf5.jpg)

hosted库配置比较简单，只需要填写name就可以了。

3. 配置Group库

![](https://ws1.sinaimg.cn/large/806e3151ly1fycztxee51j20l50l1mxw.jpg)

在group配置中，name同样是必须的。此外还多了一个members的配置，将左侧的npm-hosted,npm-proxy添加到右侧的members中，这样就可以通过group同时访问npm-hosted,npm-proxy中的资源了。



# 发布到npm私服

![](https://ws1.sinaimg.cn/large/806e3151ly1fyczztbu5ij20k009jgp4.jpg)

首先，需要配置权限，将npm Bearer Token Realm启用。

配置本机的npm登陆
```
npm login --registry=http://localhost:8888/repository/npm-hosted/
```
然后输入用户名密码，邮箱，成功后会在`.npmrc`文件中生成一条记录

```
//localhost:8888/repository/npm-hosted/:_authToken=NpmToken.16b06a38-cae5-32ca-8a5f-2310ef16e156
```
在确保项目有 package.json 前提下，执行：

```
npm publish  --registry=http://localhost:8888/repository/npm-hosted/

```
即可在私服中查询到已发的npm组件
![](https://ws1.sinaimg.cn/large/806e3151ly1fyd02la9jnj21h60ez3zv.jpg)


---

> Author ：笑笑粑粑  
> 曾用网名：TinyKing  
> 微信公众号：Java码农  
> 知乎专栏： [爱笑笑爱分享](https://zhuanlan.zhihu.com/tinyking)  
> 个人博客： [爱笑笑，爱生活](https://www.wangjianchao.cn/)  
> 自我评价： 一个爱好广泛的CRUD程序猿 \^_^   
