---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: TypeScript编码指南
date: 2019-06-05 16:17
tags:
    - TypeScript
categories:
    - 前端
---

# TypeScript编码指南

![](https://cdn.pixabay.com/photo/2016/10/20/08/39/business-1754904_960_720.jpg)

## 命名
1. 使用 `PascalCase` 方式对类进行命名.
2. 接口命名中不要使用前缀字母 `I` .
3. 使用 `PascalCase` 方式对枚举值进行命名.
4. 使用 `camelCase` 方式对函数进行命名.
5. 使用 `camelCase` 方式对属性和本地变量进行命名.
6. 私有属性命名不要使用前缀 `_` .
7. 尽可能在命名中使用整个单词 .
## [](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#components)组件

1. 每个逻辑组件一个文件 (例如： parser, scanner, emitter, checker).
2. 不要添加新文件. :)
3. 带有".generated.*"后缀的文件是自动生成的，不要手动去修改.
## [](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#types)类型

1. 除非您需要跨多个组件共享，否则不要导出类型/函数.
2. 不要向全局命名空间引入新类型/值.
3. 共享类型应在 `types.ts` 中定义.
4. 在文件中，应首先输入类型定义.
## [](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#null-and-undefined)`null` 和 `undefined`

1. 使用 `undefined` , 不要使用 `null` .

## 一般假设

1. 将节点，符号等对象视为创建它们的组件之外的不可变对象。 不要改变它们。
2. 创建后，默认情况下将数组视为不可变.

## [](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#classes)类

1. 为保持一致性，请不要在核心编译器管道中使用类。 请改用函数闭包.

## [](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#flags)标志

1. 应该将类型上超过2个相关的布尔属性转换为标志。

## [](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#comments)注释

1. 对函数，接口，枚举和类使用JSDoc样式注释。

## [](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#strings)字符串

1. 使用双引号.
2. 用户可见的所有字符串都需要进行本地化（在diagnosticMessages.json中创建一个条目）。

## 诊断信息

1. 在句子末尾使用句号.
2. 对不确定的实体使用不定的文章.
3. 应该命名确定的实体（这是为变量名，类型名等等。）.
4. 在陈述规则时，主题应该是单数的 (e.g. "An external module cannot..." instead of "External modules cannot...").
5. 使用现在时.

## 诊断消息代码
诊断分为一般范围。 如果添加新的诊断消息，请使用大于相应范围中最后使用的数字的第一个整数。

- 1000 句法消息的范围
- 2000 用于语义消息
- 4000 用于声明发出消息
- 5000 用于编译器选项消息
- 6000 用于命令行编译器消息
- 7000 对于noImplicitAny消息

## 一般构造
出于各种原因，我们避免某些结构，并使用我们自己的一些结构。 其中：

1. 不要使用 `for..in` 语句; 相反，使用 `ts.forEach` ， `ts.forEachKey` 和 `ts.forEachValue` 。 请注意它们的语义略有不同。
2. 当它不是非常不方便时，尝试使用 `ts.forEach` ， `ts.map` 和 `ts.filter` 而不是循环。

## [](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#style)风格

1. 使用箭头函数而不是匿名函数。必要时仅限制环绕箭头功能参数。例如， `（x）=> x + x` 错误，但以下是正确的:
  1. `x => x + x`
  2. `(x,y) => x + y`
  3. `<T>(x: T, y: T) => x === y`
2. 始终用花括号环绕循环和条件体。 允许在同一行上的语句省略大括号.
3. 开放的花括号总是与任何必要条件都在同一条线上.
4. 带括号的构造应该没有周围的空格。单个空格在这些构造中使用逗号，冒号和分号。 例如：
  1. `for (var i = 0, n = str.length; i < 10; i++) { }`
  2. `if (x < 10) { }`
  3. `function f(x: number, y: string): void { }`
5. 每个变量语句使用一个声明 <br />(i.e. 使用`var x = 1; var y = 2;` 而不是 `var x = 1, y = 2;`).
4. `else` 与闭合的大括号分开.
5. 每个缩进使用4个空格.

> 原文地址: [https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines)


## 总结
在实际开发过程中，可能有些编码风格和文中的有不同，但只要风格统一就好。不要不同的风格混搭使用。<br />比如：

1. 字符串不要一会使用单引号，一会使用双引号
2. 缩进有的文件使用2个空格，有的文件使用4个
