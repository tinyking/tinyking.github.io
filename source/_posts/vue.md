---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: 【vue系列】安装nodejs
date: 2017-04-21 11:10:50
tags:
    - Vue
categories:
    - 前端
---

去官网下载安装包






## npm常用命令


```
npm install xxx // 安装模块

npm install xxx -g  // 将模块安装到全局环境中 参考http://goddyzhao.tumblr.com/post/9835631010/no-direct-command-for-local-installed-command-line-modul

npm ls // 查看安装的模块及依赖

npm ls -g // 查看全局安装的模块及依赖

npm uninstall xxx  (-g) // 卸载模块

npm cache clean // 清理缓存
```

## 淘宝npm源

```
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
```

然后就可以使用`cnpm`


## 使用webpack server

```
./node_modules/.bin/webpack-dev-server --progress --colors
```
