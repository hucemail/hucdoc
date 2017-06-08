# 前言

这篇主要介绍node环境中 gitbook 插件。

可以使用它配合markdown文档来编写API等一些文档手册。

# 初始化

因为需要用到当前路径安装，所以先初始化一个package.json

	npm init

一路回车

# 安装

安装前查看可用版本：

	npm view gitbook-cli versions --json

全局安装命令如下：

	npm install gitbook-cli -g

全局安装完成后，会在下面的路径中看到相应的安装文件

	C:\Users\Administrator\AppData\Roaming\npm

<span class="red">这只是安装了cli，使用时需要安装的是gitbook。<span>

安装前查看可用版本：

	npm view gitbook versions --json

安装指定版本：

	npm install gitbook@3.2.2 --save -d

安装最新版本：

	npm install gitbook --save -d

<span class="red">注意，带-g参数是全局安装，不带-g参数将会在当前路径安装<span>


# 检测版本

	gitbook -V

V要大小哦

# 使用

环境安装好之后接下来就是使用

首先在根目录创建SUMMARY.md文件，这是book的目录

SUMMARY.md


	# Summary
	
	* [简介](README.md)
	* [JavaScript基础](1/README.md)
	    * [变量](1/01.md)


接下来在当前路径执行

	gitbook init

这时候，整个结构会都根据目录中的配置初始化好了。

启动服务器

	gitbook serve -p 4000

这时候浏览 http://localhost:4000/ 就可以看到我们的写的文档了。

打包

	gitbook build