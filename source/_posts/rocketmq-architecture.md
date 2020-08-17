---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: RocketMQ架构简介
date: 2018-04-09
tags:
    - MQ
categories:
    - 后端
---


# 概览
Apache RocketMQ是一款具有低延迟，高性能和可靠性，数十亿容量和灵活可扩展性的分布式消息传递和流媒体平台。它由四部分组成：Name Servers，brokers，producers和consumers。 它们中的每一个都可以在没有单点故障的情况下进行水平扩展。

![RocketMQ架构](http://rocketmq.apache.org/assets/images/rmq-basic-arc.png)

# NameServer集群
Name Servers提供轻量级服务发现和路由。每个Name Server记录完整的路由信息，提供相应的读写服务，并支持快速存储扩展。

# Broker集群
Brokers通过提供轻量级的TOPIC和QUEUE机制来实现消息存储。 它们支持Push和Pull模式，包含容错机制（2个或3个副本），并提供强大的峰值填充和按原始时间顺序累积数千亿条消息的能力。此外，broker提供灾难恢复，丰富的指标统计数据和警报机制，而传统的消息传递系统都缺乏这些机制。

# Producer集群
Producer集群支持分布式部署。分布式producer通过多种负载均衡模式向Broker集群发送消息。发送过程支持fast failure并具有低延迟。

# Consumer集群
Consumer也支持Push和Pull模型的分布式部署。 它还支持群集消费和消息广播。 它提供了实时的消息订阅机制，可以满足大多数消费者的需求。
