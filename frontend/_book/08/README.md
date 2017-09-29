# 前言

> html5的内容有：
> 
> 新增了许多语义化标签和表单，**五星**
> 
> canvas画布，**五星**
> 
> 音频视频处理，**五星**
> 
> webStorage存储，**五星**
> 
> SVG，**五星**
> 
> 服务器推送，**五星**
> 
> webGL，**三星**

---

[源码下载](../assets/HTML5.zip)


当前章节介绍HTML5，知识点：

* [01.标签](01.md)
* [02.表单](02.md)
* [03.绘画](03.md)
* [04.音视频](04.md)
* [05.web存储](05.md)
* [06.SVG](06.md)
* [07.服务器推送](07.md)
* [08.WEBGL](08.md)


# 额外介绍

目前很多浏览器还是不支持H5的，如：360兼容模式不支持，极速模式才支持。为了更好的用户体验，通常不支持H5的浏览器我们都会跳转到提示页面。

那么下面是几种判断浏览器是否支持H5的方法：

	window.onload = function () {
            if (window.applicationCache) {
                alert("你的浏览器支持HTML5");
            } else {
                alert("你的浏览器不支持HTML5");
            }
        }

第二种方式：

        window.onload = function () {
            if (typeof(Worker) !== "undefined") {   alert("支持HTML5");   }   else {   alert("不支持HTML5");   }  
        }