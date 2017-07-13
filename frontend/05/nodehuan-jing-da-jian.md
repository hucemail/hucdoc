# 前言

这篇主要介绍node环境的安装，如需要学习nodejs、Express可以[查看这个博客](https://github.com/nswbmw/N-blog/wiki/_pages),这里面的教程很详细。

# 下载安装

Nodejs官方网址：[https://nodejs.org](https://nodejs.org)

本地下载：[node-v6.10.2-x64.msi](assets/node-v6.10.2-x64.msi)

这里根据需要从官方下载node安装包，然后进行下一步安装，一直下一步，完成即可。新版node会自动配置环境变量

> 
{% em type="red" %} 这里需要注意的是中文和空格目录的问题，尽可能的在一个盘符根目录建立一个文件夹用于安装node、ruby等。
因为这些环境的安装往往会因为中文目录或者是带空格的目录导致后面出现难以理解的错误，还很难排除，我就遇到过{% endem %}


# 检测版本

检测是否安装成功，需要启动cmd。

```
node -v
```

正常显示node的版本号。表示环境以及安装成功了。

node安装好之后，相应的npm也正常，npm是基于node环境安装其他插件使用的。检测npm的命令如下：


```
npm -v
```


    
    


