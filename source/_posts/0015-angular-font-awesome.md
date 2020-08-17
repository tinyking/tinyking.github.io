---
title: Angular项目中集成Font Awesome图标
date: 2019-04-15 17:48
tags:
    - Angular
categories:
    - 前端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---


![素材制作.png](https://cdn.nlark.com/yuque/0/2019/png/269363/1555038251526-53b022c7-d2ea-4e41-adcd-dd4a4454c98b.png#align=left&display=inline&height=420&name=%E7%B4%A0%E6%9D%90%E5%88%B6%E4%BD%9C.png&originHeight=720&originWidth=1280&size=588090&status=done&width=746)<br /><br />通过三部操作就可以在Angular项目中使用Font Awesome图标：
1. 安装
1. 样式配置
1. 使用

<a name="e655a410"></a>
# 安装
通过 `NPM` 安装，并保存到 `package.json` 

```
npm install --save font-awesome
```

<a name="9ae6f0a6"></a>
# 配置样式 css
在 `style.css` 

```css
@import '~font-awesome/css/font-awesome.css';
```

<a name="ca2b37d4"></a>
# 配置样式 scss
在 `style.scss` 

```css
$fa-font-path: "../node_modules/font-awesome/fonts";
@import '~font-awesome/scss/font-awesome.scss';
```

<a name="1e1072c7"></a>
# 在Angular使用

```html
<i class="fa fa-area-chart"></i>
```

<a name="c7feb89a"></a>
# 配合Angular Material 

```typescript
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry) {
    matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }
}
```

```html
<mat-icon fontSet="fontawesome" fontIcon="fa-area-chart"></mat-icon>
```
