---
title: 如何用Angular6创建各种动画效果
date: 2019-02-15 09:44:01
tags:
    - Angular
categories:
    - 前端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---


# 如何用Angular 6创建各种动画效果

## 介绍

就技术角度而言，动画可以被定义为从初始状态到最终状态的转换过程。如今它已是各种Web应用不可或缺的组成部分。通过动画，我们不仅能创建出各种酷炫的UI，同时它们也能增加应用程序的趣味性。因此，设计精美的动画在吸引用户眼球的同时，也增强了他们的浏览体验。

Angular能够让我们创建出具有原生表现效果的动画。我们将通过本文学习到如何使用Angular 6来创建各种动画效果。

## 准备工作

安装vs code和 Angular cli。

## 源代码

[https://stackblitz.com/edit/tk-angular-animations-01](https://stackblitz.com/edit/tk-angular-animations-01)

## 理解Angular动画的不同状态

动画是某个元素从一种状态向另一种状态的转变，Angular为单个元素定义出了三种不同的状态。

1. void状态：void状态表示某个元素处于不是DOM一部分的状态。当一个元素被创建且尚未放到DOM中、或者该元素从DOM中移除时，就处于该状态。此状态特别实用，特别是当我们想通过添加或删除DOM中的元素，来创建动画的时候，我们在代码中使用关键字void来定义这种状态。
2. wildcard状态：又称元素的默认状态。不管当前的动画状态如何，各种样式都用这种状态来定义元素。我们在代码中用符号*来定义这种状态。
3. Custom状态：元素的这种状态需要在代码中被明确定义。我们在代码中可以使用任何自定义的名称来表示这种状态。

## 动画转换定时

我们在自己的应用中，通过定义动画转换的定时，来显示从一个状态过度到另一个状态。Angular为我们提供了如下三种与时间相关的属性：

1. 持续时间(Duration)

此属性表示我们的动画从开始(初始状态)到完成(最终状态)所需的时间。我们可以用以下三种方式来定义动画的持续时间：

- 使用一个整数值，来表示以毫秒为单位的时间，例如：500
- 使用一个字符串值，来表示以毫秒为单位的时间，例如：’500ms’
- 使用一个字符串值，来表示以秒为单位的时间。例如：’0.5’

2. 延迟(Delay)

此属性代表动画从触发到和实际转换开始之间的时间间隔。该属性遵循与上述持续时间相同的语法规则。要定义延迟，我们需要在持续时间值的后面，以字符串的形式添加延迟的数值，即：'Duration Delay'。例如' 0.3s 500ms’，表示转换将等待500毫秒，然后运行0.3秒。

3. 滑动(Easing)

此属性表示动画在其执行过程中是如何被加速或减速的。我们可以在持续时间和延迟的字符串后面，添加第三个变量。当然，如果延迟数值不存在的话，那么Easing将成为第二个数值。这同样也是一个可选属性。例如：

- '0.3s 500ms ease-in'。这意味着转换将等待500毫秒，然后运行0.3秒(300毫秒)，实现滑入的效果。
- '300ms ease-out'。这意味着转换将运行300毫秒(0.3秒)，实现滑出的效果。

## 创建Angular 6应用

请在您的计算机上打开命令提示行，并执行以下命令集：

- mkdir ngAnimationDemo
- cd ngAnimationDemo
- ng new ngAnimation

这些命令将创建一个名为ngAnimationDemo的目录，然后在该目录内创建一个名为ngAnimation的Angular应用。

请使用Visual Studio Code打开ngAnimation应用。接着我们将创建自己的组件。

请依次进入View >> Integrated Terminal，这将打开Visual Studio Code的终端窗口。

请执行以下命令，以创建相应的组件：

```
ng g c animationdemo
```

它将在/src/app文件夹内创建我们的组件--animationdemo。

为了用到Angular动画，我们需要在应用中导入特定的动画模块--BrowserAnimationsModule。请打开app.module.ts文件，并添加如下的导入定义：

```ts
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  
// other import definitions  
@NgModule({ imports: [BrowserAnimationsModule // other imports]})  
```
## 理解Angular动画的语法

下面，我们在组件的元数据中编写动画代码。其语法如下：

```ts
@Component({
// other component properties.
  animations: [
    trigger('triggerName'), [
      state('stateName', style())
      transition('stateChangeExpression', [Animation Steps])
    ]
  ]
})
```

此处，我们用到了名为animations的属性。该属性的输入是一个阵列，此阵列包含一个或多个“触发器”。同时，每个触发器都带有唯一的名称、和用来定义动画的状态和各种转换的具体实现。

另外，每一个状态函数都会通过“stateName”来唯一地识别其状态、并用样式函数来显示在该状态下的元素样式。

当然，每个转换函数也都通过stateChangeExpression，来定义元素状态转换、并定义动画的不同步骤所对应的阵列，从而能够显示出转换是如何发生的。在此，我们就可以用逗号分隔的数值，来将多个触发器函数包括到动画的属性之中。

由于这些功能(触发、状态、和转换)都被定义在@angular/animations模块之中，因此，我们需要在自己的组件导入该模块。

为了将动画应用到某个元素之上，我们需要在元素的定义中包含触发器的名称，即：在元素的标签里使用@后面加触发器名称的格式。对应的代码示例如下：

```html
<div @changeSize></div>  
```

这是将触发器changeSize应用到元素的上。

下面，让我们创建更多的动画，以更好地理解Angular的动画概念吧。

更改大小的动画

我们将创建一个动画，来实现一键改变的大小。

请打开animationdemo.component.ts文件，将如下代码添加到导入定义之中。

```ts
import { trigger, state, style, animate, transition } from '@angular/animations';
```

在组件的元数据中添加如下的动画属性定义。

```ts
animations: [
  trigger('changeDivSize', [
    state('initial', style({
      backgroundColor: 'green',
      width: '100px',
      height: '100px'
    })),
    state('final', style({
      backgroundColor: 'red',
      width: '200px',
      height: '200px'
    })),
    transition('initial=>final', animate('1500ms')),
    transition('final=>initial', animate('1000ms'))
  ]),
]  

```

在此，我们定义了一个触发器—changeDivSize，而且该触发器里的两个功能函数。该元素在“初始”状态时呈现绿色，并随着宽度和高度的增加，在“最终”状态时呈现为红色。

同时，我们定义了状态的转换规则：从“初始”态到“最终”态将持续1500毫秒，而从“最终”态返回“初始”态则为1000毫秒。

为了改变元素的状态，我们在组件的类定义中定义了一个功能函数。我们将如下代码包含在AnimationdemoComponent类中：

```ts
currentState = 'initial';
changeState() {
  this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
}  
```

此处，我们定义了一个changeState方法，来切换元素的状态。

请打开animationdemo.component.html文件，并添加以下代码：

```html
<h3>Change the div size</h3>
<button (click)="changeState()">Change Size</button>
<br />
<div [@changeDivSize]=currentState></div>
<br />
```

我们定义了一个按钮，来调用点击时的changeState函数。由于我们前面已经定义了元素，并对它应用了changeDivSize动画触发器，因此当按钮被点击时，它会更新元素的状态，其大小则会伴随着转换效果而发生变化。

在执行该应用之前，我们也需要将引用包含在app.component.html文件内的Animationdemo组件中。

打开app.component.html文件，您会发现该文件中已包含了一些默认的HTML代码。请删除所有的代码，并按照下图所示放置组件的选择器：

```html
<app-animationdemo></app-animationdemo>
```

请在Visual Studio Code的终端窗口里运行ng serve命令，以执行该代码。运行完毕后，它会提示您在浏览器中打开http://localhost:4200。随后，您就会在浏览器中看到如下点击按钮的动画效果。



## 气球动画效果

在前面的动画示例中，转化仅发生在两个方向。而在本节中，我们将学习如何改变所有方向上的尺寸。这与气球的充、放气比较类似，故称为气球动画效果。

请在动画属性中添加如下的触发器定义。

```ts
trigger('balloonEffect', [
   state('initial', style({
     backgroundColor: 'green',
     transform: 'scale(1)'
   })),
   state('final', style({
     backgroundColor: 'red',
     transform: 'scale(1.5)'
   })),
   transition('final=>initial', animate('1000ms')),
   transition('initial=>final', animate('1500ms'))
 ]),
 ```

在此，我们使用转换属性来更改所有方向的尺寸大小。当该元素的状态发生变化时转换随即发生。

请在app.component.html文件中添加如下HTML代码。

```html
<h3>Balloon Effect</h3>
<div (click)="changeState()"  
  style="width:100px;height:100px; border-radius: 100%; margin: 3rem; background-color: green"
  [@balloonEffect]=currentState>
</div>
```

在此，我们定义了一个div，并通过CSS样式来定义成一个圆圈。我们将通过点击div去调用changeState，从而实现元素状态的切换。

下图便是该动画在浏览器中的运行效果：



淡入和淡出动画

有时候，我们需要在显示动画的同时，对DOM添加或移除元素。下面，我们来看看如何通过对一个列表添加或删除条目，以实现淡入和淡出的动画效果。

请将如下代码插入AnimationdemoComponent类的定义之中。

```ts
listItem = [];
list_order: number = 1;
addItem() {
  var listitem = "ListItem " + this.list_order;
  this.list_order++;
  this.listItem.push(listitem);
}
removeItem() {
  this.listItem.length -= 1;
}
```

请在该动画的属性中添加如下的触发器定义。

```ts
trigger('fadeInOut', [
  state('void', style({
    opacity: 0
  })),
  transition('void <=> *', animate(1000)),
]),  
```

在此，我们定义了触发器fadeInOut。当该元素被添加到DOM时，它的状态就从void转换为wildcard，我们表示为void => *。而当该元素从DOM删除时，它的状态就从wildcard转换为void，我们表示为* => void。

我们给动画的不同方向使用相同的动画定时，其语法为<=>。正如该触发器所定义的，动画从void => * 和 * => void，都需要1000毫秒才能完成。

请在app.component.html文件中添加如下HTML代码。

```html
<h3>Fade-In and Fade-Out animation</h3>
<button (click)="addItem()">Add List</button>
<button (click)="removeItem()">Remove List</button>
<div style="width:200px; margin-left: 20px">
  <ul>
    <li *ngFor="let list of listItem" [@fadeInOut]>
      {{list}}
    </li>
  </ul>
</div>
```

在此，我们定义了两个按钮来添加和删除条目。我们将fadeInOut触发器与元素绑定，以实现在对DOM进行添加、删除时，能够出现淡入和淡出的效果。

下图便是该动画在浏览器中的运行效果：



进入和离开动画

此外，我们还能够通过对DOM的添加，实现某个元素从左边进入屏幕;而在删除时，能让该元素从右边离开屏幕。

由于从void => * 和 * => void 的转换十分常见。因此，Angular为这些动画提供了别名机制：

- 对于 void => * ，我们可以用':enter'
- 对于 * => void ，我们可以用':leave'

这两个别名使得此类转换更具可读性，也更容易被理解。

请在动画的属性中添加如下触发器的定义。

```ts
trigger('EnterLeave', [
  state('flyIn', style({ transform: 'translateX(0)' })),
  transition(':enter', [
    style({ transform: 'translateX(-100%)' }),
    animate('0.5s 300ms ease-in')
  ]),
  transition(':leave', [
    animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
  ])
])  
```

在此，我们定义了触发器EnterLeave。那么':enter'的转换需要等待300毫秒，然后运行0.5秒，并实现滑入的效果;而':leave'的转换只运行0.3秒，实现滑出的效果。

请在app.component.html文件中添加如下HTML代码。

```html
<h3>Enter and Leave animation</h3>
<button (click)="addItem()">Add List</button>
<button (click)="removeItem()">Remove List</button>
<div style="width:200px; margin-left: 20px">
  <ul>
    <li *ngFor="let list of listItem" [@EnterLeave]="'flyIn'">
      {{list}}
    </li>
  </ul>
</div>
```

在此，我们定义了两个按钮来对列表添加和删除条目。我们将EnterLeave触发器与元素绑定，以实现在对DOM进行添加、删除时，出现滑入和滑出的效果。

下图便是该动画在浏览器中的运行效果：



## 结论

综上所述，我们针对Angular 6的动画效果，探讨了动画状态和转换的概念，也通过一个应用示例展示了实际的动画代码与效果。
