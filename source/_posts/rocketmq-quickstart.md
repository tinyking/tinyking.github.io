---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: RocketMQ文档
date: 2017-05-17 09:06:25
tags:
    - MQ
categories:
    - 后端
comments: false
---

> [官方文档](https://rocketmq.incubator.apache.org/docs/quick-start/)

# 快速开始

# 环境准备

安装以下软件：

1. 64位系统，推荐Linux/Unix/Mac
2. 64位 JDK 1.7+
3. Maven 3.2.x
4. Git

# 克隆&编译

```
> git clone -b develop https://github.com/apache/incubator-rocketmq.git
> cd incubator-rocketmq
> mvn -Prelease-all -DskipTests clean install -U
> cd distribution/target/apache-rocketmq

```

# 启动Name Server

```
> nohup sh bin/mqnamesrv &
> tail -f ~/logs/rocketmqlogs/namesrv.log
The Name Server boot success...
```

# 启动Broker

```
> nohup sh bin/mqbroker -n localhost:9876 &
> tail -f ~/logs/rocketmqlogs/broker.log
The broker[%s, 172.30.30.233:10911] boot success...

```

需要提供一个可以网络访问的ip。


# 发送&接受消息

发送&接受消息之前需要通过设置环境变量`NAMESRV_ADDR`，用于通知客户端需要访问的服务地址。

```
> export NAMESRV_ADDR=localhost:9876
> sh bin/tools.sh org.apache.rocketmq.example.quickstart.Producer
SendResult [sendStatus=SEND_OK, msgId= ...

> sh bin/tools.sh org.apache.rocketmq.example.quickstart.Consumer
ConsumeMessageThread_%d Receive New Messages: [MessageExt...
```


# 停止服务

```
> sh bin/mqshutdown broker
The mqbroker(36695) is running...
Send shutdown request to mqbroker(36695) OK

> sh bin/mqshutdown namesrv
The mqnamesrv(36664) is running...
Send shutdown request to mqnamesrv(36664) OK
```
