---
title: 使用Prettier来规范你的Angular项目
tags:
  - Angular
categories:
  - 工具
date: 2019-06-27 17:10:42
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---


在实际项目中，我们经常会遇到团队人员写的代码风格不统一，尤其是前端代码。比如在JavaScript中，字符串可以是使用单引号`'This is string'`，也可以使用双引号`"This is string"`。对于JavaScript语言来说，这两种格式都是正确的，但是对于一个项目来讲，这就是没有规范的表现。

今天，我们就来分享一个叫prettier的前端工具，来实现我们前端项目的规范化。

## 接下来，我们一步一步的在Angular项目中集成prettier

创建一个Angular项目

```sh
ng new prettierProject
```

## 1. 安装prettier

```sh
npm install --save-dev --save-exact prettier
```

## 2. 配置prettier

在项目的根目录下创建`.prettierrc`文件

```json
{
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "semi": true,
  "bracketSpacing": false,
  "printWidth": 140,
  "overrides": [
    {
      "files": [
        "*.json",
        ".eslintrc",
        ".tslintrc",
        ".prettierrc"
      ],
      "options": {
        "parser": "json",
        "tabWidth": 2
      }
    },
    {
      "files": [
        "*.ts"
      ],
      "options": {
        "parser": "typescript"
      }
    }
  ]
}

```

## 3. 配置prettier ignore

在项目的根目录下创建`.prettierignore`文件:

```text
package.json
package-lock.json
dist
.angulardoc.json
.vscode/*
```

这个文件会告诉prettier那些文件不需要它进行格式化。

## 4. VS Code集成prettier

安装插件

[Prettier — Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

![Prettier — Code formatter](https://cdn.nlark.com/yuque/0/2019/png/269363/1561624825143-assets/web-upload/47f86bf5-f1e0-4335-8dc3-72442b366a74.png)

在项目根目录创建`.vscode/settings.json`文件：

```json
{
    "editor.formatOnSave": true
}
```

通过这个配置可以让我们在保存文件的时候，VS Code自动帮我们格式化，这样我们在写代码的时候，就可以不必为调格式浪费太多的时间。

## 5. 配置prettier和tslint共存

```sh
npm install --save-dev tslint-config-prettier
```

在`tslint.json`文件中添加下面的配置：

```json
{
    "extends": [
        "tslint:latest",
        "tslint-config-prettier"
    ]
}
```

## 6. 配置git hook

安装`husky`，创建一个Git hook

```sh
npm install  --save-dev pretty-quick husky
```

在`package.json`中添加下面的配置:

```json
"husky": {
    "hooks": {
      "pre-commit": "pretty-quick --staged"
    }
}
```
