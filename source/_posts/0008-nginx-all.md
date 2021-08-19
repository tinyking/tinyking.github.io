---
title: nginx功能解密
date: 2018-11-20 12:24:30
tags:
    - Nginx
categories:
    - 工具
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

> 本文旨在用最通俗的语言讲述最枯燥的基本知识

Nginx作为一个高性能的web服务器，想必大家垂涎已久，蠢蠢欲动，想学习一番了吧，语法不多说，网上一大堆。下面博主就nginx
的非常常用的几个功能做一些讲述和分析，学会了这几个功能，平常的开发和部署就不是什么问题了。因此希望大家看完之后，能自己装个nginx来学习配置测试，这样才能真正的掌握它。

> 文章提纲：
>
> 1. 正向代理
> 2. 反向代理
> 3. 透明代理
> 4. 负载均衡
> 5. 静态服务器
> 6. Nginx的安装

------

### 1. 正向代理

> 正向代理：内网服务器主动去请求外网的服务的一种行为

光看概念，可能有读者还是搞不明白：什么叫做“正向”，什么叫做“代理”，我们分别来理解一下这两个名词。

> 正向：相同的或一致的方向
> 代理：自己做不了的事情或者自己不打算做的事情，委托或依靠别人来完成。

借助解释，回归到nginx的概念，正向代理其实就是说客户端无法主动或者不打算完成主动去向某服务器发起请求，而是委托了nginx代理服务器去向服务器发起请求，并且获得处理结果，返回给客户端。
从下图可以看出：**客户端向目标服务器发起的请求，是由代理服务器代替它向目标主机发起，得到结果之后，通过代理服务器返回给客户端。**

![img](https://www.itcodemonkey.com/data/upload/portal/20181114/1542195547528384.jpg)



举个栗子：广大社会主义接班人都知道，为了保护祖国的花朵不受外界的乌烟瘴气熏陶，国家对网络做了一些“优化”，正常情况下是不能外网的，但作为程序员的我们如果没有谷歌等搜索引擎的帮助，再销魂的代码也会因此失色，因此，网络上也曾出现过一些fan qiang技术和软件供有需要的人使用，如某VPN等，其实VPN的原理大体上也类似于一个正向代理，也就是需要访问外网的电脑，发起一个访问外网的请求，通过本机上的VPN去寻找一个可以访问国外网站的代理服务器，代理服务器向外国网站发起请求，然后把结果返回给本机。

> 正向代理的配置:

```
server {
    #指定DNS服务器IP地址  
    resolver 114.114.114.114;   
    #指定代理端口    
    listen 8080;  
    location / {
        #设定代理服务器的协议和地址（固定不变）    
        proxy_pass http://$http_host$request_uri;
    }  
}
```

这样就可以做到内网中端口为8080的服务器主动请求到1.2.13.4的主机上，如在Linux下可以：

```
1curl --proxy proxy_server:8080 http://www.taobao.com/
```

正向代理的关键配置：

> 1. resolver：DNS服务器IP地址
> 2. listen：主动发起请求的内网服务器端口
> 3. proxy_pass：代理服务器的协议和地址

### 2. 反向代理

> 反向代理：reverse proxy，是指用代理服务器来接受客户端发来的请求，然后将请求转发给内网中的上游服务器，上游服务器处理完之后，把结果通过nginx返回给客户端。

上面讲述了正向代理的原理，相信对于反向代理，就很好理解了吧。
反向代理是对于来自外界的请求，先通过nginx统一接受，然后按需转发给内网中的服务器，并且把处理请求返回给外界客户端，此时代理服务器对外表现的就是一个web服务器，客户端根本不知道“上游服务器”的存在。



![img](https://www.itcodemonkey.com/data/upload/portal/20181114/1542195548421886.jpg)



举个栗子：一个服务器的80端口只有一个，而服务器中可能有多个项目，如果A项目是端口是8081，B项目是8082，C项目是8083，假设指向该服务器的域名为www.xxx.com，此时访问B项目是www.xxx.com:8082，以此类推其它项目的URL也是要加上一个端口号，这样就很不美观了，这时我们把80端口给nginx服务器，给每个项目分配一个独立的子域名，如A项目是a.xxx.com，并且在nginx中设置每个项目的转发配置，然后对所有项目的访问都由nginx服务器接受，然后根据配置转发给不同的服务器处理。具体流程如下图所示：



![img](https://www.itcodemonkey.com/data/upload/portal/20181114/1542195548507062.jpg)





> 反向代理配置:

```
server {
    #监听端口
    listen 80;
    #服务器名称，也就是客户端访问的域名地址
    server_name  a.xxx.com;
    #nginx日志输出文件
    access_log  logs/nginx.access.log  main;
    #nginx错误日志输出文件
    error_log  logs/nginx.error.log;
    root   html;
    index  index.html index.htm index.php;
    location / {
        #被代理服务器的地址
        proxy_pass  http://localhost:8081;
        #对发送给客户端的URL进行修改的操作
        proxy_redirect     off;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_max_temp_file_size 0;
   }
}
```

这样就可以通过a.xxx.com来访问a项目对应的网站了，而不需要带上难看的端口号。
反向代理的配置关键点是：

> 1. server_name：代表客户端向服务器发起请求时输入的域名
> 2. proxy_pass：代表源服务器的访问地址，也就是真正处理请求的服务器（localhost+端口号）。

### 3. 透明代理

> 透明代理：也叫做简单代理，意思客户端向服务端发起请求时，请求会先到达透明代理服务器，代理服务器再把请求转交给真实的源服务器处理，也就是是客户端根本不知道有代理服务器的存在。

举个栗子：它的用法有点类似于拦截器，如某些制度严格的公司里的办公电脑，无论我们用电脑做了什么事情，安全部门都能拦截我们对外发送的任何东西，这是因为电脑在对外发送时，实际上先经过网络上的一个透明的服务器，经过它的处理之后，才接着往外网走，而我们在网上冲浪时，根本没有感知到有拦截器拦截我们的数据和信息。

![img](https://www.itcodemonkey.com/data/upload/portal/20181114/1542195548380599.jpg)



有人说透明代理和反向代理有点像，都是由代理服务器先接受请求，再转发到源服务器。其实本质上是有区别的，透明代理是客户端感知不到代理服务器的存在，而反向代理是客户端感知只有一个代理服务器的存在，因此他们一个是隐藏了自己，一个是隐藏了源服务器。事实上，透明代理和正向代理才是相像的，都是由客户端主动发起请求，代理服务器处理；他们差异点在于：正向代理是代理服务器代替客户端请求，而透明代理是客户端在发起请求时，会先经过透明代理服务器，再达到服务端，在这过程中，客户端是感知不到这个代理服务器的。

### 4. 负载均衡

负载均衡：将服务器接收到的请求按照规则分发的过程，称为负载均衡。负载均衡是反向代理的一种体现。

可能绝大部分人接触到的web项目，刚开始时都是一台服务器就搞定了，但当网站访问量越来越大时，单台服务器就扛不住了，这时候需要增加服务器做成集群来分担流量压力，而在架设这些服务器时，nginx就充当了接受流量和分流的作用了，当请求到nginx服务器时，nginx就可以根据设置好的负载信息，把请求分配到不同的服务器，服务器处理完毕后，nginx获取处理结果返回给客户端，这样，用nginx的反向代理，即可实现了负载均衡。



![img](https://www.itcodemonkey.com/data/upload/portal/20181114/1542195549241458.jpg)

nginx实现负载均衡有几种模式：

> 1. 轮询：每个请求按时间顺序逐一分配到不同的后端服务器，也是nginx的默认模式。轮询模式的配置很简单，只需要把服务器列表加入到upstream模块中即可。

下面的配置是指：**负载中有三台服务器，当请求到达时，nginx按照时间顺序把请求分配给三台服务器处理。**

```
upstream serverList {
    server 1.2.3.4;
    server 1.2.3.5;
    server 1.2.3.6;
}
```

> 1. ip_hash：每个请求按访问IP的hash结果分配，同一个IP客户端固定访问一个后端服务器。可以保证来自同一ip的请求被打到固定的机器上，可以解决session问题。

下面的配置是指：**负载中有三台服务器，当请求到达时，nginx优先按照ip_hash的结果进行分配，也就是同一个IP的请求固定在某一台服务器上，其它则按时间顺序把请求分配给三台服务器处理。**

```
upstream serverList {
    ip_hash
    server 1.2.3.4;
    server 1.2.3.5;
    server 1.2.3.6;
}
```

> 1. url_hash：按访问url的hash结果来分配请求，相同的url固定转发到同一个后端服务器处理。

```
upstream serverList {
    server 1.2.3.4;
    server 1.2.3.5;
    server 1.2.3.6;
    hash $request_uri;
    hash_method crc32;
}
```

> 1. fair：按后端服务器的响应时间来分配请求，响应时间短的优先分配。

```
upstream serverList {
    server 1.2.3.4;
    server 1.2.3.5;
    server 1.2.3.6;
    fair;
}
```

而在每一种模式中，每一台服务器后面的可以携带的参数有：

> 1. down: 当前服务器暂不参与负载
> 2. weight: 权重，值越大，服务器的负载量越大。
> 3. max_fails：允许请求失败的次数，默认为1。
> 4. fail_timeout:max_fails次失败后暂停的时间。
> 5. backup：备份机， 只有其它所有的非backup机器down或者忙时才会请求backup机器。

如下面的配置是指：**负载中有三台服务器，当请求到达时，nginx按时间顺序和权重把请求分配给三台服务器处理，例如有100个请求，有30%是服务器4处理，有50%的请求是服务器5处理，有20%的请求是服务器6处理。**

```
upstream serverList {
    server 1.2.3.4 weight=30;
    server 1.2.3.5 weight=50;
    server 1.2.3.6 weight=20;
}
```

如下面的配置是指：**负载中有三台服务器，服务器4的失败超时时间为60s，服务器5暂不参与负载，服务器6只用作备份机。**

```
upstream serverList {
    server 1.2.3.4 fail_timeout=60s;
    server 1.2.3.5 down;
    server 1.2.3.6 backup;
}
```

> 下面是一个配置负载均衡的示例（只写了关键配置）：
> 其中：
>
> 1. upstream：是负载的配置模块，serverList是名称，随便起
> 2. server_name：是客户端请求的域名地址
> 3. proxy_pass：是指向负载的列表的模块，如serverList

```
upstream serverList {
    server 1.2.3.4 weight=30;
    server 1.2.3.5 down;
    server 1.2.3.6 backup;
}   

server {
    listen 80;
    server_name  www.xxx.com;
    root   html;
    index  index.html index.htm index.php;
    location / {
        proxy_pass  http://serverList;
        proxy_redirect     off;
        proxy_set_header   Host             $host;
   }
}
```

### 5. 静态服务器

现在很多项目流行前后分离，也就是前端服务器和后端服务器分离，分别部署，这样的方式能让前后端人员能各司其职，不需要互相依赖，而前后分离中，前端项目的运行是不需要用Tomcat、Apache等服务器环境的，因此可以直接用nginx来作为静态服务器。

> 静态服务器的配置如下,其中关键配置为：
>
> 1. root：直接静态项目的绝对路径的根目录。
> 2. server_name : 静态网站访问的域名地址。

```
server {
        listen       80;                                                         
        server_name  www.xxx.com;                                               
        client_max_body_size 1024M;
        location / {
               root   /var/www/xxx_static;
               index  index.html;
           }
    }
```

### 6. nginx的安装

学了这么多nginx的配置用法之后，我们需要对每一个知识点做一下测试，才能印象深刻，在此之前，我们需要知道nginx是怎么安装，下面以Linux环境为例，简述yum方式安装nginx的步骤：

1. 安装依赖：

```
//一键安装上面四个依赖
yum -y install gcc zlib zlib-devel pcre-devel openssl openssl-devel
```

1. 安装nginx：

```
yum install nginx
```

1. 检查是否安装成功：

```
nginx -v
```

1. 启动/挺尸nginx：

```
/etc/init.d/nginx start
/etc/init.d/nginx stop
```

1. 编辑配置文件：

```
/etc/nginx/nginx.conf
```

这些步骤都完成之后，我们就可以进入nginx的配置文件nginx.conf对上面的各个知识点，进行配置和测试了。


> 来自：[编程无界](https://mp.weixin.qq.com/s/DDbLVj0jxpfOmJDZxt9SYg)（微信号：qianshic），作者：假不理
