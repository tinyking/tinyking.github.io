---
title: Angular打包优化之momentjs瘦身
tags:
  - Angular
categories:
  - 前端
date: 2019-06-26 16:18:46
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

项目中使用到了moment.js，编译后发现moment的locale文件全部被打包到发布文件中，且moment的大部分都是locale文件，实际上我们只需要zh-cn这个语言包。

使用`webpack-bundle-analyzer`分析见图:

![321acf7d-a2f8-4649-ad76-dcf826773709.png](https://i.loli.net/2020/07/29/QwCLiAhmzOusfak.png)

moment.js 并不是一个现代化的模块化的库， 无法对其进行Tree Shaking优化。

我们需要借助第三方的builder组件: `@angular-builders/custom-webpack`，来扩展Angular的编译过程。

## 安装

> npm i -D @angular-builders/custom-webpack

因为是开发中需要的包，我们要把`@angular-builders/custom-webpack`添加到`devDependencies`中。

## 配置

修改angular.json中builder，将其替换为我们新安装的`@angular-builders/custom-webpack`:

```json
...
"architect": {
        "build": {
          "builder": "@angular-builders/custom-webpack:browser",
          "options": {
            "customWebpackConfig": {
              "path": "./extra-webpack.config.js",
              "replaceDuplicatePlugins": true,
              "mergeStrategies": {
                "externals": "prepend"
              }
            },
            ....
          }
        }
}
```

在上面的配置中，我们用到自定义的`extra-webpack.config.js`，因此我们需要手动创建该文件，内容为：

```javascript

'use strict';

const webpack = require('webpack');

// https://webpack.js.org/plugins/context-replacement-plugin/
module.exports = {
    plugins: [new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)]
};

```

至此，我们的moment.js的优化配置已完成。

再次执行`webpack-bundle-analyzer`分析：

![PIC](https://cdn.nlark.com/yuque/0/2019/png/269363/1561537017238-assets/web-upload/ffc4b654-ab56-4185-8b4b-df925e8052d1.png)

我们会发现，新编辑的文件中locale文件只剩下了我们需要的zh-cn。
