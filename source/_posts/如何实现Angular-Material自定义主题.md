---
title: 如何实现Angular Material自定义主题
date: 2019-08-02 18:08:21
tags:
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---
## 什么是主题

**主题**就是一组要应用于 Angular Material 的颜色，也可以理解成应用的皮肤。在以前使用 QQ 空间的时候，腾讯就做好多些空间皮肤（主题）进行出售。现在 Android 手机系统也都有好多主题，让用户自己手机系统的主题。

在 Angular Material 中，主题由多个调色板组成。具体来说，包括：

- 主调色板：那些在所有屏幕和组件中广泛使用的颜色。
- 强调调色板：那些用于浮动按钮和可交互元素的颜色。
- 警告调色板：那些用于传达出错状态的颜色。
- 前景调色板：那些用于问题和图标的颜色。
- 背景色调色板：那些用做原色背景色的颜色。

<a name="93502147"></a>
## 预定义主题

Angular Material 自带了几个预构建主题的 `css` 文件。这些主题文件包含了所有核心样式（所有组件中通用的），这样你的应用就只需要包含单个 `css` 文件了。

有效的预定义主题有：

- `deeppurple-amber.css`
- `indigo-pink.css`
- `pink-bluegrey.css`
- `purple-green.css`

你可以从 `@angular/material/prebuilt-themes` 直接把主题文件包含到应用中。

如果你正在使用 Angular CLI，那么只需要在 `styles.css` 文件中添加一行就可以了：

```scss
@import '@angular/material/prebuilt-themes/deeppurple-amber.css';
```

如果你使用的 `ng add @angular/material` 添加的依赖，Material Schematics 会在控制台给出交互信息，在选择相应的主题后，会自动将样式添加到 `angular.json` 中：

```json
"styles": [
              "./node_modules/@angular/material/prebuilt-themes/indigo-pink.css",
              "src/styles.scss"
   ],
```

<a name="76fe220f"></a>
## 自定义主题

自定义主题文件要做两件事：

1. 导入 `mat-core()` 混入器。它包括所有功能多个组件使用的公共样式。**在你的应用中，应该只包含一次该混入器。**如果包含多次，你的应用就会出现这些公共样式的多个副本。
1. 定义一个主题数据结构，它由多个调色板组成。该对象可以用 `mat-light-theme` 或 `mat-dark-theme` 函数构建。然后，函数的输出会传给 `angular-material-theme` 混入器，它会输出所有该主题所对应的样式。

典型的主题文件定义如下：

```scss
// 引入material的theming，其中包含了混入器
@import '~@angular/material/theming';

// 导入核心混入器，确保只导入一次
@include mat-core();

// 定义主调色板
$candy-app-primary: mat-palette($mat-indigo);

// 强调调色板
$candy-app-accent:  mat-palette($mat-pink, A200, A100, A400);

// 警告调色板
$candy-app-warn:    mat-palette($mat-red);

// 创建一个light主题
$candy-app-theme: mat-light-theme($candy-app-primary, $candy-app-accent, $candy-app-warn);

// 启动主题
@include angular-material-theme($candy-app-theme);
```

<a name="a54b8e84"></a>
## 多重主题

你可以通过多次调用 `angular-material-theme` 混入器，每次包含一些额外的 CSS 类，来为应用创建多个主题。

记住，只能包含 `@mat-core` 一次；不应该让每个主题都包含它一次。

多重主题的例子：

```scss
// 引入material的theming，其中包含了混入器
@import '~@angular/material/theming';
// Plus imports for other components in your app.

// 导入核心混入器，确保只导入一次
@include mat-core();

// 定义主调色板
$candy-app-primary: mat-palette($mat-indigo);
// 强调调色板
$candy-app-accent:  mat-palette($mat-pink, A200, A100, A400);
// 创建一个light主题
$candy-app-theme:   mat-light-theme($candy-app-primary, $candy-app-accent);

// 将candy-app-theme定义成默认主题
@include angular-material-theme($candy-app-theme);


// 定义个深色主题.
$dark-primary: mat-palette($mat-blue-grey);
$dark-accent:  mat-palette($mat-amber, A200, A100, A400);
$dark-warn:    mat-palette($mat-deep-orange);
$dark-theme:   mat-dark-theme($dark-primary, $dark-accent, $dark-warn);

// 所有在unicorn-dark-theme样式下的组件主题都将是深色的
.unicorn-dark-theme {
  @include angular-material-theme($dark-theme);
}
```

<a name="be9cb3aa"></a>
## 基于浮层的组件

由于某些组件（比如菜单、选择框、对话框等）位于全局的浮层容器中，所以想要让它们被主题的 css 类选择器（比如 `.unicorn-dark-theme`）影响到还需要做一个额外的步骤。

要做到这一点，你可以给全局浮层容器添加一个合适的类。比如上面的例子要改成这样：

```typescript
import {OverlayContainer} from '@angular/cdk/overlay';

@NgModule({
  // ...
})
export class UnicornCandyAppModule {
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('unicorn-dark-theme');
  }
}
```

当然，浮层容器也是渲染在 body 中的，所以可以在 body 中添加样式

```html
<body class="unicorn-dark-theme">
    <!--....-->
</body>
```

这样就不需要上面的 `ts` 类了。

<a name="4b02068c"></a>
## 主题动态切换

在上面多主题的基础上，我们实现主题的动态切换。可以通过修改 body 的 class，从而实现主题的切换。

```typescript
export class AppComponent {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  changeTheme() {
    const theme = 'unicorn-dark-theme';
    this.document.body.classList.toggle(theme);
  }
}
```
