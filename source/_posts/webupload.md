---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: Bootstrap模态框使WebUploader点击失效问题解决
date: 2017-04-21 13:10:50
tags:
    - Bootstrap
    - webuploader
categories:
    - 前端
---

在使用Bootstrap模态框页面上使用上传组件WebUploader，发现点击失效。

解决方法：

```javascript
var uploader;
//在点击弹出模态框的时候再初始化WebUploader，解决点击上传无反应问题
$("#myModal").on("shown.bs.modal",function(){
    uploader = WebUploader.create({
        swf : '/web/public/Uploader.swf',
        server : $("#jumicontextPath").val()+'/common/file/upload',// 后台路径
        pick : '#filePicker', // 选择文件的按钮。可选。内部根据当前运行是创建，可能是input元素，也可能是flash.
        resize : false,// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        chunked : true, // 是否分片
        duplicate:true,//去重， 根据文件名字、文件大小和最后修改时间来生成hash Key.
        chunkSize : 52428 * 100, // 分片大小， 5M
        /*    fileSingleSizeLimit:100*1024,//文件大小限制*/
        auto : true,
        // 只允许选择图片文件。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/jpg,image/jpeg,image/png'
        }
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function (file,response) {
        var fileUrl = response.data.fileUrl;
        //TODO
        $("#responeseText").text("上传成功,文件名："+response.data.fileName);
    });

    // 当文件上传出错时触发
    uploader.on('uploadError', function (file) {
        $("#responeseText").text("上传失败");
    });

    //当validate不通过时触发
    uploader.on('error', function (type) {
        if(type=="F_EXCEED_SIZE"){
            alert("文件大小不能超过xxx KB!");
        }
    });
});
```

单单这样也会有问题，这样每次弹出模态框之后都加载一个边框，使按钮越来越大，所以需要在关闭模态框后销毁webuploader


```javascript
//关闭模态框销毁WebUploader，解决再次打开模态框时按钮越变越大问题
$('#myModal').on('hide.bs.modal', function () {
    $("#responeseText").text("");
    uploader.destroy();
});
```


-----

| 事件            | 描述                                                  |
|:----------------|:------------------------------------------------------|
| show.bs.modal   | 在调用 show 方法后触发。                              |
| shown.bs.modal  | 当模态框对用户可见时触发（将等待 CSS 过渡效果完成）。 |
| hide.bs.modal   | 当调用 hide 实例方法时触发。                          |
| hidden.bs.modal | 当模态框完全对用户隐藏时触发。                        |
