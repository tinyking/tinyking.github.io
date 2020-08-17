---
title: Idea下maven package时，javadoc乱码
date: 2018-10-30 20:24:30
tags:
    - Java
categories:
    - 后端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

在idea中，使用maven打包应用的，javadoc在console输出乱码。解决方法如下：
1. 设置环境变量JAVA_TOOL_OPTIONS: -Dfile.encoding=UTF-8
2. 在idea64.exe.vmoptions中设置-Dfile.encoding=UTF-8

<!--more-->
