---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: JavaScript编程规范
date: 2017-04-21 13:10:50
tags:
    - JavaScript
categories:
    - 前端
---

## 背景
JavaScript是一种客户端脚本语言，Web工程都会用到它，这份指南列出了编写JavaScript时需要遵守的规则。

## JavaScript语言规范

### 变量
声明变量必须加上var
关键字:
```
var a1 = 1;
var b1 = 11;
```

当你没有写var
，变量就会暴露在全局上下文中，这样很可能会和现有的变量冲突。另外，如果没有加上，很难明确该变量的作用域是什么，变量很可能在局部作用域中，很容易泄漏到Document或者Window中，所以务必用var
变量。

### 常量
常量的形式如：`NAMES_LIKE_THIS`，即使用大写字符，并用下划线分割，你也可用`@const`标记来指明它是一个常量，但请不要使用`const`关键字。
对于基本类型的常量，只需要转换命名：
```
/**
 * The number of seconds of minute.
 * @type {number}
 */
eflag.example.SECONDES_IN_A_MINUTE = 60;
```
对于非基本类型，使用`@const`
标记：
```
/**
 * The number of seconds in each of the given units.
 * @type {Object.<number>}
 * @const
 */
eflag.example.SECONDS_TABLE = {minute: 60,hour: 60 * 60,day: 60 * 60 * 24}
```
至于关键字`const`，因为IE不能识别，所以不要使用。

### 分号
总是使用分号。 如果仅依靠语句间的隐式分割，有时会很麻烦，使用分号，你自己更能清楚那里是语句的起止。
行末分号：
```
var foo = 1,bar = 2,baz = 3;
var obj = {foo: 1,bar: 2,baz: 3};
```
### 单引号(`''`)和双引号(`""`)
由于JavaScript对于单引号和双引号都可以识别为字符串，但为了统一规范，所以在JavaScript中字符串的定义要求使用单引号：
```
var val = 'a';
```
同样，html中属性使用的是双引号：
```
<input type="text">
```
在JavaScript中动态生成html标签时：
```
var _input = '<input type="text">';
```
### 空格
参数和括号间五空格：
```
function fn(arg1, arg2){}
```
冒号后面有空格
```
{foo: 1,bar: 2,baz: 3}
```
条件语句有空格
```
if (true) {}
while (true) {}
switch(v){}
```
### Tips and Tricks

### True和False布尔表达式
下面的布尔表达式都会返回`false`：
```
null
undefined
''
空字符串
0
```
数字`0` 但小心下面的，可都返回`true`：
```
'0'
字符串0
[]
空数组
{}
空对象
```
如果你想检查字符串是否为`null`或`空`：
```
if (y != null && y != '') {}
```
写成这样会更好：
```
if (y) {}
```
### 条件（三元）操作符(`?:`)
三元操作符用于替代下面的代码：
```
if (val != 0) {
  return foo();
} else {
  return bar();
}
```
你可以写成：
```
return val ? foo() : bar();
```
在生成HTML代码时也是很有用的：
```
var html = '<input type="checkbox"' + (isChecked ? ' checked' : '')+ (isEnabled ? '' : ' disabled')+ ' name="foo">';
```
### `&&`和`||`

二元布尔操作符是可短路的，只有在必要的时候才会计算到最后一项。 `||`被称作为`default`操作符，因为可以这样：
```
/**
 * @param {*=} opt_win
 */
function foo(opt_win) {
  var win;
  if (opt_win) {
    win = opt_win;
  } else {
    win = window;
  }
// ...
}
```
你可以使用它来简化上面的代码：
```
/**
 * @param {*=} opt_win
 */
function foo(opt_win) {
  var win = opt_win || window;
  // ...
}
```
### 使用`join()`来创建字符串
通常是这样使用的：
```
function listHtml(items) {
  var html = '<div class="foo"';
  for (var i = 0; i < items.length; i++) {
    if (i > 0) {
      html += ',';
    }
    html += itemHtml(items[i]);
  }
  html += '</div>';
  return html;
}
```
但这样在IE下非常慢，可以用下面的方式：
```
function listHtml(items) {
  var html = [];
  for (var i = 0; i < items.length; i++) {
    html[i] = itemHtml(items[i]);
  }
  return '<div class="foo">' + html.join(', ') + '</div>';
}
```
你也可以使用数组作为字符串构造器，然后通过`myArray.join('')`
转换成字符串，不过由于赋值操作快于数组的`push()`，所以尽量使用复制操作。
