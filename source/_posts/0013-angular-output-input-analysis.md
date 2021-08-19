---
title: Angular的@Output与@Input浅析
date: 2018-12-04 09:44:01
tags:
    - Angular
categories:
    - 前端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

# @Output与@Input理解
Output和Input是两个装饰器，是Angular2专门用来实现跨组件通讯，双向绑定等操作所用的。

## @Input

Component本身是一种支持 nest 的结构，Child和Parent之间，如果Parent需要把数据传输给child并在child自己的页面中显示，则需要在Child的对应 directive 标示为 input。

例如：
```
@Input() name: string;
```

我们通过一个例子来分析下`@Input`的流程。

![](https://ws1.sinaimg.cn/large/806e3151ly1fxtu0ia0t7j216m0pgjwe.jpg)

流程：
1. child_component.ts内有students，并且是被@Input标记的，那么这个属性就作为输入属性
2. 在parent_component.html内直接使用了students，那是因为在parent.module.ts内将child组件import进来了
3. [students]这种形式叫属性绑定，绑定的值为school.schoolStudents属性
4. Angular会把schoolStudents的值赋值给students，然后影响到子组件的显示

所以我们可以总结，child_component中有数据要显示，但是这个数据的来源是通过parent_component.html中通过属性绑定的形式作为child组件的输入，要想child组件内的students属性能够成功赋值，那么必须使用@Input。

`@Input`还可以使用typescript的get set存取器的方式来设置属性
```
private _name: string;

@Input get name() {return this._name;}
set(name:string) {this._name = name;}
```

## @Output
Output的数据流方向与input是相反的，所以那就是child控制parent的数据显示，input是parent控制child的数据显示。

**注意**
Angular 2中，@Output的实现必须使用EventEmitter来实现。
并且当你使用了tslint之后，变量不能加on，但是可以通过加入这样一段注释

```
// tslint:disable-next-line:no-output-on-prefix
@Output() onRemoveElement = new EventEmitter<Element>();
```

形如：
```
// 要将EventEmitter先import进来。
import { Component, Input, Output, EventEmitter } from '@angular/core';
...
@Output() mySignal = new EventEmitter<boolean>();
```

EventEmitter();中间的boolean参数是你需要传递数据的类型，当然可以是基本类型，也可以是自定义类型。

我们还是老样子，通过一个例子来分析一下吧。

![](https://ws1.sinaimg.cn/large/806e3151ly1fxtu7s2pydj218a0ueq92.jpg)

我们通过这张图可以看到，整个事件的流程，那我们来分析一下：

child组件内有一个Output customClick的事件，事件的数据类型是number
child组件内有一个onClicked方法，这个是应用在html中button控件的click事件中，通过(click)=”onClicked()”进行方法绑定
parent组件内有一个public的属性showMsg,Angular的ts类默认不写关键字就是public。

parent组件内有一个onCustomClicked方法，这个也是要用在html中的，是和child组件内的output标记的customClick事件进行绑定的
步骤为child的html的button按钮被点击->onClicked方法被调用->emit(99)触发customClick->Angular通过Output数据流识别出发生变化并通知parent的html中(customClick)->onCustomClicked(event)被调用，event)被调用，event为数据99->改变了showMsg属性值->影响到了parent的html中的显示由1变为99。

**小知识：**

其实双向绑定就是这么实现的，只是将input和output一起使用即可达到目的。
