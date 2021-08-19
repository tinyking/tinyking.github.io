---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: 记一次线上问题的排查过程
date: 2018-04-05
tags:
    - Nginx
    - Tomcat
categories:
    - 工具
---

# 问题

XX系统中，一个用户需要维护的项目数过多，填写的任务数超多，产生了一次工时保存中，只有前面一部分的xx数据持久化到数据库，后面的数据没有保存。

`图1`

![](http://ww1.sinaimg.cn/large/806e3151ly1fptj4uwnnuj21200i8gm5.jpg)


# 排查过程

## 1.增加日志，监控参数信息

首先想到的是否后面部分的数据在保存过程中发生了异常。排查异常日志，发现没有该问题存在。

然后增加方法参数信息日志，数据参数信息。发现参数集合size=200，前端发送集合size=400。判断问题可以能是因为服务器容器环境(Nginx+Tomcat)导致

## 2.开发环境问题重现

### 2.1 模拟数据

在测试环境模拟线上数据。如`图1`

### 2.2 只配置Tomcat

在idea中直接启动tomcat，无nginx环境，如果没有问题，则可暂时确定为nginx问题。

然而，在过程中发现了新的问题。

```
org.springframework.beans.InvalidPropertyException: Invalid property 'detail[256]' of bean class [com.suning.asvp.mer.entity.InviteCooperationInfo]: Index of out of bounds in property path 'detail[256]'; nested exception is java.lang.IndexOutOfBoundsException: Index: 256, Size: 256  
    at org.springframework.beans.BeanWrapperImpl.getPropertyValue(BeanWrapperImpl.java:833) ~[spring-beans-3.1.2.RELEASE.jar:3.1.2.RELEASE]  
    at org.springframework.beans.BeanWrapperImpl.getNestedBeanWrapper(BeanWrapperImpl.java:576) ~[spring-beans-3.1.2.RELEASE.jar:3.1.2.RELEASE]  
    at org.springframework.beans.BeanWrapperImpl.getBeanWrapperForPropertyPath(BeanWrapperImpl.java:553) ~[spring-beans-3.1.2.RELEASE.jar:3.1.2.RELEASE]  
    at org.springframework.beans.BeanWrapperImpl.setPropertyValue(BeanWrapperImpl.java:914) ~[spring-beans-3.1.2.RELEASE.jar:3.1.2.RELEASE]  
    at org.springframework.beans.AbstractPropertyAccessor.setPropertyValues(AbstractPropertyAccessor.java:76) ~[spring-beans-3.1.2.RELEASE.jar:3.1.2.RELEASE]  
    at org.springframework.validation.DataBinder.applyPropertyValues(DataBinder.java:692) ~[spring-context-3.1.2.RELEASE.jar:3.1.2.RELEASE]  
    at org.springframework.validation.DataBinder.doBind(DataBinder.java:588) ~[spring-context-3.1.2.RELEASE.jar:3.1.2.RELEASE]  
    at org.springframework.web.bind.WebDataBinder.doBind(WebDataBinder.java:191) ~[spring-web-3.1.2.RELEASE.jar:3.1.2.RELEASE]  
    at org.springframework.web.bind.ServletRequestDataBinder.bind(ServletRequestDataBinder.java:112) ~[spring-web-3.1.2.RELEASE.jar:3.1.2.RELEASE]
```

查看BeanWrapperImpl源码
```
else if (value instanceof List) {  
    int index = Integer.parseInt(key);                        
    List list = (List) value;  
    growCollectionIfNecessary(list, index, indexedPropertyName, pd, i + 1);                       
    value = list.get(index);// 测试报错时，此处list只有256个，index为256时，取第257个报错  
}  
```

```
@SuppressWarnings("unchecked")  
    private void growCollectionIfNecessary(  
            Collection collection, int index, String name, PropertyDescriptor pd, int nestingLevel) {  


        if (!this.autoGrowNestedPaths) {  
            return;  
        }  
        int size = collection.size();  
        // 当个数小于autoGrowCollectionLimit这个值时才会向list中添加新元素  
        if (index >= size && index < this.autoGrowCollectionLimit) {  
            Class elementType = GenericCollectionTypeResolver.getCollectionReturnType(pd.getReadMethod(), nestingLevel);  
            if (elementType != null) {  
                for (int i = collection.size(); i < index + 1; i++) {  
                    collection.add(newValue(elementType, name));  
                }  
            }  
        }  
    }  
```

根据上面的分析找到autoGrowCollectionLimit的定义

```
public class DataBinder implements PropertyEditorRegistry, TypeConverter {  

    /** Default object name used for binding: "target" */  
    public static final String DEFAULT_OBJECT_NAME = "target";  

    /** Default limit for array and collection growing: 256 */  
    public static final int DEFAULT_AUTO_GROW_COLLECTION_LIMIT = 256;  

    private int autoGrowCollectionLimit = DEFAULT_AUTO_GROW_COLLECTION_LIMIT;
```

解决方案，是在自己的Controller中加入如下方法

```
@InitBinder  
protected void initBinder(WebDataBinder binder) {  
    binder.setAutoGrowNestedPaths(true);  
    binder.setAutoGrowCollectionLimit(1024);  
}  
```

==**BUT** 这个问题和线上的不同，只能算是意外收获。革命尚未成功，同志仍需努力！！！！==

### 2.3 增加Nginx
经过2.2的奋斗，暂时判定是否为Nginx post请求参数做了限制。嗯，开搞~ 在开发环境配置Nginx代理，过程略·····

nginx.conf 如下
```
upstream xxxxxxx {
	server 127.0.0.1:8080  weight=10 max_fails=2 fail_timeout=30s ;
}

server {
    listen       80;
    server_name  xxxxxxx.com;
    client_max_body_size 100M;  # 配置post size

    #charset koi8-r;

    #access_log  logs/host.access.log  main;

   location / {
		#proxy_next_upstream     http_500 http_502 http_503 http_504 error timeout invalid_header;
		proxy_set_header        Host  $host;
		proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_pass              http://xxxxxxx;
		expires                 0;
	}
}
```

对于`client_max_body_size 100M;`，网上都是与文件上传相关的。不过都是通过post， request body的方式上传数据，所以通用。

测试~~

功能正常，没有重现线上问题。 哭死~~~

革命还要继续~~

### 2.4 Tomcat post设置

去线上服务器拉去配置

```
<Connector port="1601" maxParameterCount="1000" protocol="HTTP/1.1" redirectPort="8443" maxSpareThreads="750" maxThreads="1000" minSpareTHreads="50" acceptCount="1000" connectionTimeout="20000" URIEncoding="utf-8"/>
```

经分析，发现线上没有body size的配置，却有`maxParameterCount="1000"`。该参数为限制请求的参数个数，从而变相限制body size。

在开发环境配置该参数，测试，**问题重现**。


## 3. 解决

问题原因定位好了，剩下的就是如何解决了。

两个方案：

- 修改线上配置

    *该上实施难度系数高，因为公司使用的统一发布部署平台，开发人员无服务器操作权限。*

- 修改代码

    *修改保存逻辑，分片存储*


# 总结

问题排查，需要先对整体有个把握，然后分析影响范围。不能钻牛角尖，采用西医“头疼医头”的方式。有可能最后结果还是要医头，但此时的医头已经是建立在中医的辩证主义上，对症下药。
