---
title: Mysql建表语句中显示双引号
date: 2018-11-20 20:24:30
tags:
    - MySQL
categories:
    - 工具
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

在工作中使用Mysql数据库，发现建表后的ddl显示表名、字段都是双引号。这样的ddl在线上工单系统无法通过，需要将双引号转成反引号(`)才行。


通过执行命令`show VARIABLES like '%sql%'`发现，`sql_mode`的值是`ANSI_QUOTES`。

查看my.cnf配置文件，发现有如下配置:

```
# 对本地的mysql客户端的配置
[client]
#default-character-set = utf8
# 对其他远程连接的mysql客户端的配置
[mysql]
default-character-set = utf8
# 本地mysql服务的配置

[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
user=mysql
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0
character-set-server = utf8
sql_mode='ANSI_QUOTES'
default-storage-engine=INNODB

server-id=1
log-bin=mysql-bin
binlog_format=MIXED
expire_logs_days=30

[mysqld_safe]
log-error=/var/log/mysqld.log

```

将mysqld下的sql_mode配置去掉，重启服务即可。
