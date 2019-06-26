---
title: Angular @ViewChild深度解析
photos:
    - https://i.loli.net/2019/06/10/5cfdf6dca539f47762.png
tags:
    - Angular
categories:
    - 前端
---

![Angular Framework](https://i.loli.net/2019/06/10/5cfdf6dca539f47762.png)

Angular `@ViewChild`装饰器是我们在学习Angular的过程中常用的装饰器之一。这个装饰器有很多特性，其中的一些特性可能不是很常见，但却非常有用。

本文中，我们将快速的介绍这个装饰器中所有可用的特性。

## 目录

在本文中，主要涉及一下内容：

- 我们什么时候需要`@ViewChild`装饰器
- `AfterViewInit`生命周期钩子
- `@ViewChild`模板查询的范围是什么
- 使用`@ViewChild`插入组件
- 如何使用`@ViewChild`插入纯HTML元素
- 使用`@ViewChild`插入组件的纯HTML元素
- 如何使用`@ViewChild`注入应用于单个元素或组件的多个指令之一
- 代码示例（Github存储库）
- 结论


## 我们什么时候需要`@ViewChild`装饰器

如我们所知，在Angular中，我们通过将纯HTML元素与其他Angular组件组合来定义组件模板。

举个例子，我们这里有一个Angular AppComponent模板，它在模板中混合了HTML和自定义组件：

如我们所见，此模板包含几个不同的元素类型，例如：

- 纯HTML元素，如`h2`和`div`
- 自定义应用程序组件，如`<color sample>`组件
- 第三方组件（如颜色选择器）
- 以及多个Angular Material组件

这就是AppComponent在屏幕上的样子：

![color picker](https://s3-us-west-1.amazonaws.com/angular-university/blog-images/angular-viewchild/view-child-1.png)

我们将在这个初始模板中建立所有示例的基础。`<color sample>`组件是小调色板蓝色方块，旁边有一个链接到颜色选择器弹出窗口的输入。


## 何时使用@viewchild装饰器？

很多时候，我们可以通过使用模板引用（如`#primaryinput`或`#primarycolorsample`）直接在模板中协调这些多个组件和HTML元素，而不使用`AppComponent`类。

但情况并非总是如此！有时，`AppComponent`可能需要引用其模板中包含的多个元素，以调解它们的交互。

如果是这样的话，那么我们可以获取对这些模板元素的引用，并通过查询模板将它们注入`AppComponent`类：这就是`@ViewChild`的目的。


## 使用@viewchild插入对组件的引用

假设`AppComponent`需要在其模板内使用的`<color sample>`组件的引用，以便直接对其调用方法。

在这种情况下，我们可以使用`@ViewChild`插入对名为`#primaryColorSample`的`<color sample>`实例的引用：

通过使用`@ViewChild`，`primarySampleComponent`成员变量将由带有`ColorSampleComponent`实例的Angular填充。

此注入的`ColorSampleComponent`实例与模板中存在的`<color sample>`自定义元素链接的实例相同。

### 通过@viewchild注入的变量何时可用？

此注入成员变量的值在组件构造时不立即可用！

在视图初始化完成后，Angular将自动填充此属性，但只能在组件生命周期的后期填充。

## `AfterViewInit`生命周期钩子
如果我们想编写使用@viewchild注入的引用的组件初始化代码，我们需要在afterviewinit生命周期钩子中完成。



下面是如何使用此生命周期挂钩的示例：



如果我们现在运行这个程序，下面是我们在控制台中得到的输出：

![](https://s3-us-west-1.amazonaws.com/angular-university/blog-images/angular-viewchild/view-child-2.png)

如我们所见，angular已经自动地用对组件的引用填充了成员变量primarycolorsample！

### 我们可以使用ngoninit（）而不是ngafterview init（）吗？

如果我们想确保@viewchild注入的引用存在，我们应该始终使用ngafterview init（）编写初始化代码。



根据具体情况，模板引用可能已经存在于ngoninit（）上，但我们不应该指望它。

## @viewchild模板查询的范围是什么？

使用@viewchild，我们可以将给定组件模板上的任何组件或指令（或HTML元素）注入到组件本身。



但是我们可以在组件树下查询组件多远？让我们尝试使用@viewschild查询组件树中更深的组件。



例如，让我们来看一下<color sample>组件：



如我们所见，该组件内部使用<mat icon>组件来显示小调色板图标。



现在让我们继续，看看是否可以查询<mat icon>组件并将其直接注入AppComponent：



如果我们尝试运行这个，这就是我们在控制台中得到的：

![](https://s3-us-west-1.amazonaws.com/angular-university/blog-images/angular-viewchild/view-child-3.png)

正如我们在控制台结果中看到的那样：

> @viewchild装饰器无法跨组件边界查看！

### @viewchild模板查询的可见性范围

这意味着使用@viewchild完成的查询只能看到组件本身模板内的元素。必须认识到@viewchild不能用于注入：



其子组件模板中的任何内容

父组件模板中也没有任何内容

总而言之，@viewchild修饰符是组件本地的模板查询机制。



有了这个，我们已经介绍了@viewchild最常见的用例，但是还有很多其他的用例：让我们看看更多的用例！

## 使用@viewchild插入对dom元素的引用

我们可能希望直接与模板的纯HTML元素（例如appcomponent内的h2标题标记）交互，而不是直接插入子组件。



为了做到这一点，我们需要首先为要注入的HTML标记分配一个模板引用：



如我们所见，我们已经将标题模板引用分配给了h2标记。我们现在可以通过以下方式将h2元素直接注入组件类：



如我们所见，我们正在将字符串“title”传递给@viewchild decorator，它对应于应用于h2标记的模板引用的名称。



因为h2是一个普通的html元素，而不是一个角组件，所以这次注入的是对h2标记的本机dom元素的包装引用：

![](https://s3-us-west-1.amazonaws.com/angular-university/blog-images/angular-viewchild/view-child-4.png)

elementRef简单地包装了本机DOM元素，我们可以通过访问nativeElement属性来检索它。



使用nativeElement属性，我们现在可以将任何本地DOM操作应用于h2标题标记，例如addEventListener（）。



这就是我们如何使用@viewschild与模板中的纯HTML元素进行交互的方法，但这就引出了一个问题：



如果我们需要与角组件相关联的DOM元素，该怎么办？



毕竟，<color sample>html标记仍然是一个dom元素，即使它有一个colorsamplecomponent实例附加在它上面。

## 使用@viewchild插入对组件的dom元素的引用

---

> 原文地址：https://blog.angular-university.io/angular-viewchild/