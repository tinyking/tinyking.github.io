---
title: 如何用Angular Reactive Form的实现领域模型one-to-many
tags:
    - Angular
categories:
    - 前端
---

在应用系统中，必不可少的一样功能就是表单录入。在Angular中，提供了两种表单模式：**响应式表单**和**模板驱动表单**。


## Angular表单

### 模板驱动表单

模板驱动表单是通过使用`ngModel`创建双向数据绑定，以读取和写入输入控件的值。如下：

**.component.ts里面声明模型：


```html
<input type="text" class="form-control" id="name"
       required
       [(ngModel)]="model.name" name="name">
```