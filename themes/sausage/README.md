hexo-theme-sausage
---
**sausage 腊肠**

基于[Hexo-Theme-Yilia](https://github.com/litten/hexo-theme-yilia), 喜欢的话拿去.

可以点击我的[个人博客](http://qbeenslee.com)查看效果, 手机可以扫码:

![demo](https://raw.githubusercontent.com/qbeenslee/ART/master/hexo-theme-sausage/03152016202908.png)


关于本Hexo主题的[详细说明](http://qbeenslee.com/article/hexo-theme-sausage-help/)


## install 安装

```
git clone https://github.com/qbeenslee/hexo-theme-sausage.git themes/sausage
```

## update 更新

```
cd themes/sausage
git pull
```
## art 效果预览

PC端效果

![](https://raw.githubusercontent.com/qbeenslee/ART/master/hexo-theme-sausage/03152016202909.png)

移动端效果

![](https://raw.githubusercontent.com/qbeenslee/ART/master/hexo-theme-sausage/03152016202907.png)


## config 配置

``` yaml
#Header
# 如要添加标签页面, 需要生成一个内容为空的markdown文件
menu:
  文章: '/archives'
  随笔: '/categories/note'
  标签: '/tags'
  留言: '/feedback'

rss: '/atom.xml'

#CDN站点路径, 同域名则为空
# CDN_PATH:

# 主题修改版本, 搭配CDN使用, 会在生成的'style.css'添加后缀, 比如'style01.css'.
# 这样为了避免CDN缓存造成的样式更新不及时.
# theme_version: '01'

#Content
excerpt_link: more
fancybox: false
mathjax: false

#是否开启动画效果
animate: false

#是否在新窗口打开链接
open_in_new: false

#favicon
# favicon: '/img/favicon.ico'

#头像url
avatar: 'http://7xrcp8.com1.z0.glb.clouddn.com/avatar.png'

#网站快捷方式显示在桌面的图标
# apple_touch_icon: 'http://weibo.com/favicon.ico'
#显示在网页标题栏的网站图标
# shortcut_icon: 'http://weibo.com/favicon.ico'

# 现在左侧栏底部的图案
# logo: 'http://images.missyuan.com/attachments/day_090901/20090901_26d53fd68595b3773beaH7sYHt89zOHT.png'

#关于我页面
aboutme: "/aboutme/"
#版权页面
copyright: "/copyright/"


#是否开启多说评论，填写你在多说申请的项目名称(short_name)
# duoshuo: 

#博客内容可被选中, 全局生效
content_selectable: true

#折叠评论
fold_comments: false
```

## 更新日志

### 20160718

添加标签页, 添加文章可设置是否可选, 以及多处样式修正.
