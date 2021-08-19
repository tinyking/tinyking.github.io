---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: vs code调试Angular
date: 2018-07-10 10:49:46
tags:
    - Angular
    - VS Code
categories:
    - 前端
---

# vs code调试Angular
为了调试客户端Angular代码，需要安装[Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) Chrome扩展应用

打开vs code的扩展应用视图(`Ctrl+Shift+X`), 搜索`chrome`。

![image](https://code.visualstudio.com/assets/docs/nodejs/reactjs/debugger-for-chrome.png)

点击`Install`，等安装完成后点击`Reload`，重新加载扩展应用使新安装的应用生效。

## 设置断点

在`app.component.ts`中设置断点，断点显示为红色原点。

![image](https://code.visualstudio.com/assets/docs/nodejs/angular/breakpoint.png)

## 配置Chrome debugger
首先配置调试器。打开调试视图(`Ctrl+Shift+D`)，点击设置按钮，创建调试器配置文件`launch.json`。环境选择`Chrome`，会在`.vscode`文件夹下生成一个`launch.json`文件。

修改url端口号，将`8080`修改为`4200`，如下：

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "url": "http://localhost:4200",
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```

`F5`或绿色三角运行调试器，会打开一个新的浏览器实例。

![image](https://code.visualstudio.com/assets/docs/nodejs/angular/hit-breakpoint.png)

可以用`F10`单步调试。还可以查看变量信息，栈信息。
![image](https://code.visualstudio.com/assets/docs/nodejs/angular/debug-variable.png)
