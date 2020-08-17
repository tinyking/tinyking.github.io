---
title: Angular核心技术之组件
id: angular-he-xin-ji-shu-zhi-zu-jian
date: 2019-08-02 18:09:40
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

# 组件(component)

Angular 组件是一个由模板组成的元素，通过组件来渲染我们的应用。

<a name="FEhYx"></a>
## 一个简单组件
Angular提供了@Component装饰器来，我们需要使用该装饰器来定义一个组件。

@Component内置了一些参数：

- `providers` : 用来声明一些资源，这些资源可以在构造函数中通过DI注入。
- `selector` :  在html中适应的查询选择器，Angular会使用定义的组件替换html中的该选择器
- `styles` :  定义一组内联样式，数组类型
- `styleUrls` ：一组样式文件
- `template` ：内联模板
- `templateUrl` ：模板文件

例子：

```typescript
import { Component } from '@angular/core';

@Component({
	selector: 'app-required',
  styleUrls: ['requried.component.scss'],
  templateUrl: 'required.component.html'
})
export class RequiredComponent { }
```

<a name="wtq6O"></a>
## 模板 & 样式
模板是html文件，里面可以包含一些逻辑。

我们可以通过两种方式来指定组件的模板：

1. 通过文件路径来指定模板

```typescript
@Component({
  templateUrl: 'hero.component.html'
})
```

2. 通过使用内联方式指定模板

```typescript
@Component({
  template: '<div>This is a template.</div>'
})
```

组件中定义的模板可以包含样式，我们可以在@Component中定义当前模板的样式。在组件中定义的样式和应用的style.css中定义是有区别的。组件中定义的任何样式，作用域都被限制在此组件内。<br />例如，我们在组件中添加样式：

```css
div {background: red;}
```

组件模板内的所有的div背景都会渲染成红色，但是其他组件中的div不会受到此样式的影响。<br />编译后的代码类似如下这样：

```html
<style>div[_ngcontent-c1] {background:red;}</style>
```

我们可以通过两种方式为组件的模板定义样式：

1. 通过文件的方式

```typescript
@Component({
  styleUrls: ['hero.component.css']
})
```


2. 通过内联的方式

```typescript
styles: [`div {background: red;}`]
```

<a name="kG6AR"></a>
## 如何选择
不论模版还是样式，组件都提供来两种方式来声明它们。理论上我们可以随心所欲，自由组合。但实际的开发过程中我们还是需要有自己的原则：根据实际内容的多少来选择声明方式，内容较多就选择文件方式，这样可以使代码结构更加清晰，整洁。

<a name="H1L5Y"></a>
## 组件测试
`hero.component.html` 

```html
<form (ngSubmit)="submit($event)" [formGroup]="form" novalidate>
  <input type="text" formControlName="name"/>
  <button type="submit"> Show hero name</button>
</form>
```

`hero.component.ts` 

```typescript
import { FromControl, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  slector: 'app-hero',
  templateUrl: 'hero.component.html'
})
export class HeroComponent {
  public form = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  submit(event) {
    console.log(event);
    console.log(this.form.controls.name.value);
  }
}
```

`hero.component.spec.ts` 

```typescript
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { HeroComponent } from 'hero.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixtrue = TestBed.createComponent(HeroComponent);
    component = fixtrue.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBetruthy();
  });

  it('should log hero name in the console when user submit form', async(() => {
    const heroName = 'Saitama';
    const element = <HTMLFormElement>fixture.debugElement.nativeElement.querySelector('form');

    spyOn(console, 'log').and.callThrough();

    component.form.controls['name'].setValue(heroName);

    element.querySelector('button').click();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(console.log).toHaveBeenCalledWith(heroName);
    });
  }));

  it('should validate name field as required', () => {
    component.form.controls['name'].setValue('');
    expect(component.form.invalid).toBeTruthy();
  });
})
```

<a name="RVpq8"></a>
## 嵌套组件
组件是通过selector来渲染的，所以我们就可以通过嵌套的方式来使用所有的组件。

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-required',
  template: `{{name}} is required.`
})
export class RequiredComponent {
  @Input()
  public name: string = '';
}
```
我们就可以在其他的组件中，通过使用app-required标签来嵌套我们的组件。

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sample',
  template: `
  <input type="text" name="heroName" />
	<app-required name="Hero Name"></app-required>
`
})
export class SampleComponent {
  @Input()
  public name = '';
}
```
