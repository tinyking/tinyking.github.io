---
title: Angular中的自定义异步验证器
date: 2018-10-25 09:24:30
tags:
    - Angular
categories:
    - 前端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

在实际工作中，我们经常需要一个基于后端API验证值的验证器。为此，Angular提供了一种定义自定义异步验证器的简便方法。

本文将介绍如何为Angular应用程序创建自定义异步验证器。

<!--more-->

通常你会调用一个真正的后端，但是在这里我们将创建一个虚拟的JSON文件，我们可以通过使用Http服务来调用它。如果正在使用Angular CLI，则可以将JSON文件放在/assets文件夹中，它将自动可用；

`/assets/users.json`

```json
[
  { "name": "Paul", "email": "paul@example.com" },
  { "name": "Ringo", "email": "ringo@example.com" },
  { "name": "John", "email": "john@example.com" },
  { "name": "George", "email": "george@example.com" }
]
```

# 注册服务

接下来，让我们创建一个具有`checkEmailNotTaken`方法的服务，该方法触发对我们的JSON文件的http GET调用。这里我们使用`RxJS`的延迟运算符来模拟一些延迟：

`signup.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';

@Injectable()
export class SignupService {
  constructor(private http: Http) {}

  checkEmailNotTaken(email: string) {
    return this.http
      .get('assets/users.json')
      .delay(1000)
      .map(res => res.json())
      .map(users => users.filter(user => user.email === email))
      .map(users => !users.length);
  }
}
```

请注意我们如何筛选与提供给方法的用户具有相同电子邮件的用户。然后我们再次映射结果并进行测试以确保我们得到一个空置对象。

在真实场景中，您可能还想使用debounceTime和distinctUntilChanged运算符的组合，如我们在创建实时搜索的帖子中所讨论的。引入一些这样的去抖动将有助于将发送到后端API的请求数量保持在最低水平。

## 组件和异步验证器

我们的简单组件初始化我们的反应形式并定义我们的异步验证器：*validateEmailNotTaken*。请注意我们的`FormBuilder.group`声明中的表单控件如何将异步验证器作为第三个参数。这里我们只使用一个异步验证器，但是你想在数组中包含多个异步验证器：

app.component.ts

```typescript
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

import { SignupService } from './signup.service';

@Component({ ... })
export class AppComponent implements OnInit {
  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private signupService: SignupService
  ) {}

  ngOnInit() {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
        this.validateEmailNotTaken.bind(this)
      ]
    });
  }

  validateEmailNotTaken(control: AbstractControl) {
    return this.signupService.checkEmailNotTaken(control.value).map(res => {
      return res ? null : { emailTaken: true };
    });
  }
}
```

我们的验证器与典型的自定义验证器非常相似。这里我们直接在组件类中定义了验证器而不是单独的文件。这样可以更轻松地访问我们注入的服务实例。另请注意我们如何绑定**此**值以确保它指向组件类。

我们还可以在自己的文件中定义我们的异步验证器，以便更容易地重用和分离关注点。唯一棘手的部分是找到一种方法来提供我们的服务实例。在这里，例如，我们创建一个具有*createValidator*静态方法的类，该方法接收我们的服务实例并返回我们的验证器函数：

/validators/async-email.validator.ts

```
import { AbstractControl } from '@angular/forms';
import { SignupService } from '../signup.service';

export class ValidateEmailNotTaken {
  static createValidator(signupService: SignupService) {
    return (control: AbstractControl) => {
      return signupService.checkEmailNotTaken(control.value).map(res => {
        return res ? null : { emailTaken: true };
      });
    };
  }
}
```

然后，回到我们的组件中，我们导入*ValidateEmailNotTaken*类，我们可以使用这样的验证器：

```
ngOnInit() {
  this.myForm = this.fb.group({
    name: ['', Validators.required],
    email: [
      '',
      [Validators.required, Validators.email],
      ValidateEmailNotTaken.createValidator(this.signupService)
    ]
  });
}
```

## 模板

在模板中，事情真的很简单：

app.component.html

```
<form [formGroup]="myForm">
  <input type="text" formControlName="name">
  <input type="email" formControlName="email">

  <div *ngIf="myForm.get('email').status === 'PENDING'">
    Checking...
  </div>
  <div *ngIf="myForm.get('email').status === 'VALID'">
    😺 Email is available!
  </div>

  <div *ngIf="myForm.get('email').errors && myForm.get('email').errors.emailTaken">
    😢 Oh noes, this email is already taken!
  </div>
</form>
```

您可以看到我们根据*电子邮件*表单控件上status属性的值显示不同的消息。对于可能的值**状态**是*VALID*，*INVALID*，*PENDING*和*禁用*。如果异步验证错误输出我们的*emailTaken*错误，我们也会显示错误消息。

使用异步验证器验证的表单字段在验证*待处理*时也将具有*ng-pending*类。这样可以轻松设置当前待验证字段的样式。

✨你有它！使用后端API检查有效性的简便方法。
