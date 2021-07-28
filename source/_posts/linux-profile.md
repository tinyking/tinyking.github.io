---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: Linux环境变量配置
date: 2017-04-21 13:10:50
tags:
    - Linux
categories:
    - 工具
---


不论使用Linux开发，还是使用Linux生产，都不可避免环境变量的配置。通常都是去修改系统文件：`/etc/profile`, `/etc/enviroment`, `~/.bashrc`, `~/.profile`等等，在这些文件的末尾`export`上自己想要添加的环境变量，`source`一下该文件，配置就立刻生效了。

今天通过阅读`/etc/profile`文件：
```bash
# /etc/profile: system-wide .profile file for the Bourne shell (sh(1))
# and Bourne compatible shells (bash(1), ksh(1), ash(1), ...).

if [ "`id -u`" -eq 0 ]; then
  PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
else
  PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games"
fi
export PATH

if [ "$PS1" ]; then
  if [ "$BASH" ] && [ "$BASH" != "/bin/sh" ]; then
    # The file bash.bashrc already sets the default PS1.
    # PS1='\h:\w\$ '
    if [ -f /etc/bash.bashrc ]; then
      . /etc/bash.bashrc
    fi
  else
    if [ "`id -u`" -eq 0 ]; then
      PS1='# '
    else
      PS1='$ '
    fi
  fi
fi

if [ -d /etc/profile.d ]; then
  for i in /etc/profile.d/*.sh; do
    if [ -r $i ]; then
      . $i
    fi
  done
  unset i
fi
```
发现最后一个`for`循环，其作用是搜用`/etc/profile.d`下的所有的`.sh`结尾的可执行文件，并运行。
因此，我们就可以根据不同的功能编写不同的可执行文件，将他们放到`/etc/profile.d`下，如`jdk.sh`，`ant.sh`，`maven.sh`等等。
