---
title: Idea手动设置Spring Boot项目使用Run Dashboard运行
date: 2018-10-17 09:24:30
tags:
    - Idea
    - Java
categories:
    - 工具
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

最近在做基于Spring cloud的微服务开发，开发过程中，要启动很多Spring Boot项目，Idea提供了`Run Dashboard`功能，来方便管理Spring Boot项目。

![](http://ww1.sinaimg.cn/large/806e3151ly1fwazgrcb0yj20gc095t8t.jpg)

<!--more-->

通常Idea会自动提示是否要用`Run Dashboard`管理。

如果没有自动提示，可以手动打开`view >> Tool Windows >> Run Dashboard`
![](http://ww1.sinaimg.cn/large/806e3151ly1fwazjtuwvuj20f80gz0to.jpg)

如果还没有找到`Run Dashboard`，就需要手动添加，打开workspace.xml，找到`<component name="RunDashboard">`，将其设置成如下：

```xml
<component name="RunDashboard">
    <option name="configurationTypes">
        <set>
        <option value="SpringBootApplicationConfigurationType" />
        </set>
    </option>
    <option name="ruleStates">
        <list>
        <RuleState>
            <option name="name" value="ConfigurationTypeDashboardGroupingRule" />
        </RuleState>
        <RuleState>
            <option name="name" value="StatusDashboardGroupingRule" />
        </RuleState>
        </list>
    </option>
</component>
```
