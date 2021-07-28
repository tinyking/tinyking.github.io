---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: Keepalived 简单配置
date: 2017-04-21 13:10:50
tags:
    - Keepalived
categories:
    - 工具
---


## 安装

解压文件
```bash
tar -xvf keepalived-x.x.x.tar.gz
```
进入文件夹`keepalived-x.x.x`

```
./configure

make && make install
```

在安装过程中需要注意以下几点：

- gcc环境
- openssl环境
- root权限


## 配置

```bash
# cp /usr/local/etc/rc.d/init.d/keepalived /etc/rc.d/init.d/
# cp /usr/local/etc/sysconfig/keepalived /etc/sysconfig/
# mkdir /etc/keepalived  
# cp /usr/local/etc/keepalived/keepalived.conf /etc/keepalived/
# cp /usr/local/sbin/keepalived /usr/sbin/
```

做成系统启动服务方便管理.

```bash
# vi /etc/rc.local   
/etc/init.d/keepalived start
```
增加上面一行。

修改配置`/etc/keepalived/keepalived.conf`


```config
! Configuation File for keepalived

global_defs {
    notification_email {
        acassen@firewall.loc    # 邮件地址，当异常时发邮件通知。可以是多个，每个一行

    }
    notification_email_from Alexandre.Cassen@firewall.loc
    smtp_server 192.168.200.1
    smtp_connect_timeout 30
    router_id LVS_DEVEL
    vrrp_skip_check_adv_addr
    vrrp_strict
}

vrrp_instance VI_1 {
    state MASTER    # 从机设为BACKUP
    interface   eth0   # 网卡接口
    mcast_src_ip 10.0.0.131  # 默认没有这项，加上这项后服务好用了
    priority  100  # 优先级，从机小与主机
    advert_int 1  
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    virtual_ipaddress {
        10.0.0.111   # 虚拟ip设置，可以是多个，主从一致
    }
}

```


> 参考文档 http://wenku.baidu.com/view/8e38022d2af90242a895e532.html
