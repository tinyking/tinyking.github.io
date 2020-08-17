---
title: 使用webpack-bundle-analyzer分析Angular应用
date: 2019-06-26 16:20:30
tags:
    - Angular
categories:
  - 前端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

## 概述

`webpack-bundle-analyzer`是一个前端分析工具，可以生成可视化大小的webpack输出文件与互动缩放树形图，为开发人员对Application进行优化提供更为直观的指导依据。

## Angular集成webpack-bundle-analyzer

### 安装
`webpack-bundle-analyzer`是一个开发者工具，实际发布的Application并不依赖于它，因此，我们需要将`webpack-bundle-analyzer`安装到`devDependencies`:

```bash
npm i -D webpack-bundle-analyzer
```

### 配置

修改package.json文件，在scripts中，增加新的执行命令：

```json
  "scripts": {
    "bundle-report": "ng build --configuration=production --stats-json && webpack-bundle-analyzer dist/stats.json"
  },
```

### 使用

此时就可以使用新添加的命令对Angular Application进行分析了：

```bash
npm run bundle-report
```

![](https://cdn.nlark.com/yuque/0/2019/png/269363/1561538113639-assets/web-upload/c6b3fa2a-2b5f-44aa-b14b-27d5f1cbe0e8.png)


## 结论
通过使用`webpack-bundle-analyzer`，我们可以直观的看到那些模块体积比较大，这样我们就可以有针对性的对其进行优化。对应Web应用来说，文件越小是越好的，性能也会更优。
