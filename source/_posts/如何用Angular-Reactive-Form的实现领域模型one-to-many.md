---
title: 如何用Angular Reactive Form的实现领域模型one-to-many
tags:
  - Angular
categories:
  - 前端
date: 2019-06-14 20:57:53
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---


在应用系统中，必不可少的一样功能就是表单录入。在Angular中，提供了两种表单模式：**响应式表单**和**模板驱动表单**。


## Angular表单

### 模板驱动表单

模板驱动表单是通过使用`ngModel`创建双向数据绑定，以读取和写入输入控件的值。如下：

首先ts文件里面创建模型：
```typescript
 model = new Hero(18, 'Dr IQ', this.powers[0], 'Chuck Overstreet');
```

然后再html文件中，通过ngModel指令，实现模型数据的双向绑定:

```html
<input type="text" class="form-control" id="name"
       required
       [(ngModel)]="model.name" name="name">
```

应为在`input`上通过`ngModel`实现了对`model.name`的双向绑定，此时，我们在界面的`input`中输入的内容会实时的反应到ts中的`model`中。

### 响应式表单

响应式表单使用显式的、不可变的方式，管理表单在特定的时间点上的状态。对表单状态的每一次变更都会返回一个新的状态，这样可以在变化时维护模型的整体性。响应式表单是围绕 Observable 的流构建的，表单的输入和值都是通过这些输入值组成的流来提供的，它可以同步访问。

当使用响应式表单时，FormControl 类是最基本的构造块。要注册单个的表单控件，请在组件中导入 FormControl 类，并创建一个 FormControl 的新实例，把它保存在类的某个属性中。

```typescript
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-name-editor',
  templateUrl: './name-editor.component.html',
  styleUrls: ['./name-editor.component.css']
})
export class NameEditorComponent {
  name = new FormControl('');
}
```

在组件类中创建了控件之后，你还要把它和模板中的一个表单控件关联起来。修改模板，为表单控件添加 formControl 绑定，formControl 是由 ReactiveFormsModule 中的 FormControlDirective 提供的。

```html
<label>
  Name:
  <input type="text" [formControl]="name">
</label>
```

## one-to-many的领域模型

我们现在有个数据字典的数据模型，每个字典又包含了多个字典项。我们用TypeScript描述下我们的模型:
```typescript
export class Dict {
    id: number;
    code: string;
    name: string;

    items: Item[];
}

export class Item {
    code: string;
    value: string;
}

```
在这个数据字典的模型中，`Dict`和`Item`的关系就是`one-to-many`。

## 响应式表单实现字典模型

如果只是字典模型，没有字典项`Item`的话，在Angular的官方文档中已经给出了这样的模型实现方式：

```typescript

// 使用FormBuilder来实现
export class ReactiveFormDemoComponent implements OnInit {

  formGroup: FormGroup = this.fb.group({
    id: [''],
    code: [''],
    name: ['']
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

  }



  doSubmit() {
    console.log(this.formGroup.value);
  }
}
```
在上面的代码中，我们通过`FormBuilder`来创建`FormGroup`，然后我们就可以在html中使用它：

```html
<div>
  <form [formGroup]="formGroup" (ngSubmit)="doSubmit()">

    <div>
      <span>code</span>
      <input formControlName="code">
    </div>
    <div>
      <span>name</span>
      <input formControlName="name">
    </div>
    <button type="submit"> Submit</button>
  </form>
</div>

```
这种常规的模型实现起来还是比较简单的。

那么对于one-to-many的模型我们应该怎么去实现呢？

首先，我们来分析这个Dict模型。我们会发现items是一个Item[]，此时，我们可以在官方文档中找到，在响应式表单中有一个FormArray用来表示FormControl的数组模式。

接下来我们看Item，其实它本身也是一个简单模型，我们可以用FormGroup来与之对应。

现在我们对上面的代码进行改造：

```typescript

// 使用FormBuilder来实现
export class ReactiveFormDemoComponent implements OnInit {

  formGroup: FormGroup = this.fb.group({
    id: [''],
    code: [''],
    name: ['']，
    items: this.fb.array([])  // 使用FormBuilder创建一个FormArray
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

  }


  doSubmit() {
    console.log(this.formGroup.value);
  }

  get items() {
    return this.formGroup.get('items') as FormArray;
  }
}
```

```html
<div>
  <form [formGroup]="formGroup" (ngSubmit)="doSubmit()">

    <div>
      <span>code</span>
      <input formControlName="code">
    </div>
    <div>
      <span>name</span>
      <input formControlName="name">
    </div>

     <div formArrayName="items">
      <table border="1">
        <tr>
          <th>CODE</th>
          <th>Name</th>
        </tr>
        <ng-container *ngFor="let form of list.controls" [formGroup]="form">
          <tr>
            <td><input formControlName="code"></td>
            <td><input formControlName="value"> </td>
          </tr>
        </ng-container>
      </table>
    </div>
    <button type="submit"> Submit</button>
  </form>
</div>

```
## 结论
复杂的东西都是由简单的组成的。就是Java中的基本数据类型一样。通过数据结构+算法，我们可以组装出复杂的对象，最后以应用的方式展示出来。所以，任何复杂的东西，只要我们认真分析，总能找到简单的实现方法。
