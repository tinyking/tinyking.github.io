---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: WebStorm VSCode集成cmder
date: 2019-06-26 18:27:25
categories:
    - 工具
---

## 概述

cmder是一个增强型命令行工具，不仅可以使用windows下的所有命令，更爽的是可以使用linux的命令,shell命令。

## 安装

1. 去[cmder官网](https://cmder.net/)下载压缩包
2. 解压下载的cmder
3. (可选)将您自己的可执行文件放入`bin`文件夹中，以便注入到系统的`Path`中
4. 运行cmder.exe

## VS Code配置Cmder

使用`ctrl+,`快捷键打开设置页面，选择右上角的`{}`切换到`settings.json`文件，添加下面的配置即可

```json
{
    ...
    "terminal.integrated.shell.windows": "C:\\windows\\System32\\cmd.exe",
    "terminal.integrated.shellArgs.windows": [
        "/k D:\\Tools\\cmder_mini\\vendor\\init.bat"
    ],
    ...
}
```

## WebStorm配置Cmder

`ctrl+alt+s`打开设置窗口，选择`Tools>Terminal`

设置

```text
"cmd.exe" /k ""%Cmder%\vendor\init.bat""
```

![Cmder](https://cdn.nlark.com/yuque/0/2019/png/269363/1561552882498-assets/web-upload/380d4999-0a28-4c73-8d54-e7055d85fc41.png)
