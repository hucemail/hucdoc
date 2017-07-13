# 前言

这篇主要介绍node环境中  http-server的一个小型http服务器插件。

如：我们编写好一个网页，如果要部署要不就是安装IIS或者下载tomcat等，会耗费很长时间安装或者下载，因为包大嘛。只是为了本机调试的话何不用http-server等小型服务器呢？

# 安装

安装前查看可用版本：

	npm view http-server versions --json

全局安装命令如下：

	npm install http-server -g

全局安装完成后，会在下面的路径中看到相应的安装文件

	C:\Users\Administrator\AppData\Roaming\npm

# 使用

使用http-server就简单了，因为我们经过全局安装了之后，可以在任何路径下执行http-server命令.

	http-server -p 8000

在需要的目录中执行命令，会出现一些提示，

	http://172.16.6.17:8080
	http://127.0.0.1:8080

这时候通过浏览器打开地址， 默认会访问当前目录下的index.html

结束http-server只需要关闭cmd窗口或者ctrl+c。