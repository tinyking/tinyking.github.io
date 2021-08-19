---
title: 使用Angular cli管理多种环境配置
date: 2018-10-16 18:24:30
tags:
    - Angular
categories:
    - 前端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

大多数的web应用在发布生产之前，需要在多种环境下去运行。例如，您可能需要为QA团队构建一个构建以执行某些测试，或者在您的持续集成服务器上运行特定构建。

这些构建需要不同的配置：
  - 不同的服务URLS
  - 不同的logging选项
  - 等等

Angular CLI提供了一种环境功能，允许运行针对特定环境的构建。 例如，以下是如何运行生产构建：

```
ng build --env=prod   // For Angular 2 to 5
```
在升级到Angular 6+后，构建命令如下：
```
ng build --configuration=production
```
上面代码中的prod标志是指v6之前的.angular-cli.json的环境部分的prod（v6+则是production）属性。
默认情况下有两个选项：dev和prod
```json
"environments": {
  "dev": "environments/environment.ts",
  "prod": "environments/environment.prod.ts"
}
```
您可以在此处添加所需的环境。 例如，如果您需要QA构建选项，只需在.angular-cli.json中添加以下条目：

```json
"environments": {
  "dev": "environments/environment.ts",
  "prod": "environments/environment.prod.ts",
  "qa": "environments/environment.qa.ts"
}
```
对于v6 +，angular.json environments现在称为configurations。 以下是在v6之后添加新qa环境的方法：
```json
"configurations": {
  "production": { ... },
  "qa": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.qa.ts"
      }
    ]
  }
}
```
然后，您必须在environments目录中创建实际文件environment.qa.ts。

下面是默认的dev配置：
```
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false
};
```
您可以在上面的environment对象中添加任何特定于环境的属性。 例如，让我们添加一个服务器URL：
```
export const environment = {
  production: false,
  serverUrl: "http://dev.server.mycompany.com"
};
```
然后，您需要做的就是为QA提供不同的URL，即在environment.qa.ts中定义具有正确值的相同属性：
```
export const environment = {
  production: false,
  serverUrl: "http://qa.server.mycompany.com"
};
```
既然已经定义了您的环境，那么如何在代码中使用这些属性？ 很简单，您只需要导入环境对象，如下所示：
```
import {environment} from '../../environments/environment';


@Injectable()
export class AuthService {

  LOGIN_URL: string = environment.serverUrl + '/login' ;
```
然后，当您运行QA构建时，Angular CLI将使用environment.qa.ts来读取environment.serverUrl属性值，并且您已设置为将该构建部署到QA环境。
