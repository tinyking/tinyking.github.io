---
title: Angular material中自定义分页信息
date: 2018-12-03 14:44:01
tags:
    - Angular
categories:
    - 前端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

在项目开发中，用到了Material的分页组件，需要对该组件进行汉化。

![](https://ws1.sinaimg.cn/large/806e3151ly1fxtkeefsycj20gt065jrd.jpg)

首先创建自定义汉化类：

```typescript
import {MatPaginatorIntl} from '@angular/material';

export class MatPaginatorIntlCro extends MatPaginatorIntl  {
  /** A label for the page size selector. */
  itemsPerPageLabel = '每页条数: ';
  /** A label for the button that increments the current page. */
  nextPageLabel = '下一页';
  /** A label for the button that decrements the current page. */
  previousPageLabel = '上一页';
  /** A label for the button that moves to the first page. */
  firstPageLabel = '首页';
  /** A label for the button that moves to the last page. */
  lastPageLabel = '尾页';
  /** A label for the range of items within the current page and the length of the whole list. */
  getRangeLabel =  (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return '0 od' + length;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length
                      ? Math.min(startIndex + pageSize, length)
                      : startIndex + pageSize;
    return `第${startIndex + 1}-${endIndex}条, 总共${length}条`;
  }
}
```

在`app.module.ts`中声明该Provider：
```typescript
 providers: [
    {provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }
    ]
```
这样在再使用分页组件时，相关信息将显示中文。
