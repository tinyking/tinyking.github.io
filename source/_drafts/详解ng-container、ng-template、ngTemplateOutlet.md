---
title: 详解ng-container、ng-template、ngTemplateOutlet
photos:
    - https://i.loli.net/2019/06/10/5cfdf6dca539f47762.png
tags:
    - Angular
categories:
    - 前端
---

![Angular Framework](https://i.loli.net/2019/06/10/5cfdf6dca539f47762.png)


## ng-container

在Angular中，`ng-container`是一个虚拟的节点元素，在实际渲染时，`ng-container`标签不会渲染。也就是使用`ng-container`包含的dom元素，实际渲染后只能看到被包含的dom元素。

如：
```html
<ng-container>
    <p>这是一个包含在
</ng-container>
```