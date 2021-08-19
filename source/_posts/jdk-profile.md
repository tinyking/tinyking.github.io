---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: Java系列  - JDK环境配置
date: 2017-04-21 13:10:50
tags:
    - Java
categories:
    - 工具
---

# Linux
打开`/etc/profile`, 添加如下代码：
```bash
export JAVA_HOME=/opt/jdk
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib
export PATH=$JAVA_HOME/bin:$PATH
```
执行代码，使配置生效
```bash
source /etc/profile
```

安装命令 **需要root权限**
```bash
alternatives --install /usr/bin/java java /opt/jdk/bin/java 1600
alternatives --install /usr/bin/javac javac /opt/jdk/bin/javac 1600
```


# Windows
> windows下，path路径以`;`分割，bat变量`%JAVA_HOME%`
