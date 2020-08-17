---
title: Angular之自定义组件添加默认样式
tags:
  - Angular
date: 2020-01-21 11:28:02
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---


Angular的核心思想之一就是：组件化。组件化可以使我们的代码更好的复用。

在使用官方提供的Angular库[Angular Material](https://material.angular.io/)时，细心的同学就会发现，Material的每一个组件都有它自己样式，如：

- **按钮**：`mat-button`
- **工具条**：`mat-toolbar`
- **表格**：`mat-table`
- etc.

每个组件添加自己独有的样式，增加css作用域的控制，实现了样式的隔离。

那么，如果给一个自定义组件添加默认样式呢？接下来我们介绍三种方法来实现我们的目标。

## 方法一：host
在组件的`@Component`装饰器中提供了`host`属性，该属性可以为我们提供很多功能的支持，其中一项就是给组件添加样式。

以Material中的Table为例：

```typescript
@Component({
  moduleId: module.id,
  selector: 'mat-table, table[mat-table]',
  exportAs: 'matTable',
  template: CDK_TABLE_TEMPLATE,
  styleUrls: ['table.css'],
  host: {
    'class': 'mat-table',
  },
  providers: [{provide: CdkTable, useExisting: MatTable}],
  encapsulation: ViewEncapsulation.None,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MatTable<T> extends CdkTable<T> {
  /** Overrides the sticky CSS class set by the `CdkTable`. */
  protected stickyCssClass = 'mat-table-sticky';
}
```

在MatTable的源码中，我们可以看到为host属性设置了`'class': 'mat-table'`，在我们使用MatTable组件时，就会添加上默认的样式: `mat-table`.

{% note danger %}
**注意**

虽然在Angular中提供了host属性，并且官方的Material库也是使用该属性实现了很多功能，但是，在Angular编码规范中却不推荐使用该方法。详见：[HostListener 和 HostBinding 装饰器 vs. 组件元数据 host
](https://angular.cn/guide/styleguide#hostlistenerhostbinding-decorators-versus-host-metadata)
{% endnote %}


## 方法二：HostBinding

如方法一中注意事项中提到的，官方不推荐使用`host`属性，推荐使用`@HostBinding`装饰器来实现`host`的关于dom属性相关的功能。

还是以MatTable为例，需要做一下改造来实现相应的功能：

```typescript
@Component({
  moduleId: module.id,
  selector: 'mat-table, table[mat-table]',
  exportAs: 'matTable',
  template: CDK_TABLE_TEMPLATE,
  styleUrls: ['table.css'],
//   host: {
//     'class': 'mat-table',
//   },
  providers: [{provide: CdkTable, useExisting: MatTable}],
  encapsulation: ViewEncapsulation.None,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MatTable<T> extends CdkTable<T> {
  /** Overrides the sticky CSS class set by the `CdkTable`. */
  protected stickyCssClass = 'mat-table-sticky';

  // 使用HostBinding装饰器
  @HostBinding('class.mat-table') clz = true;
}
```

## 方法三：Renderer2

`Renderer2`是Angular的渲染引擎，我们可以通过它来为自定义组件添加默认样式。

还是以MatTable为例，需要做一下改造来实现相应的功能：

```typescript
@Component({
  moduleId: module.id,
  selector: 'mat-table, table[mat-table]',
  exportAs: 'matTable',
  template: CDK_TABLE_TEMPLATE,
  styleUrls: ['table.css'],
//   host: {
//     'class': 'mat-table',
//   },
  providers: [{provide: CdkTable, useExisting: MatTable}],
  encapsulation: ViewEncapsulation.None,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MatTable<T> extends CdkTable<T> {
  /** Overrides the sticky CSS class set by the `CdkTable`. */
  protected stickyCssClass = 'mat-table-sticky';

  constructor(render: Renderer2, eleRef: ElementRef) {
      render.addClass(eleRef.nativeElement, 'mat-table');
  }
}
```


## 总结

很多时候，实现一个功能的方法有很多，需要我们不断的去挖掘，去思考。条条大路通罗马，只要努力了总会有收获。
