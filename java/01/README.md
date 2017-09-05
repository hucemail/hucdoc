# 前言

参考地址：[http://jingyan.baidu.com/article/ed2a5d1f64dca409f6be172b.html](http://jingyan.baidu.com/article/ed2a5d1f64dca409f6be172b.html)


# JDK安装

首先安装JDK和JRE，百度搜索JDK 64位下载，操作系统是64位的话一定要下载64位的。

双击安装，JDK和JRE都安装在同一个目录。


配置系统环境变量：

**JAVA_HOME**

> E:\Program Files\Java\jdk1.8.0_144

**CLASSPATH**

>  .;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar; 

**PATH**

> %JAVA_HOME%\bin;%JAVA_HOME%\jre\bin;


**检测环境**

> java -version
> 
> javac


# eclipse安装

下载64位的eclipse，双击，选择第二个Java EE

下一步，指定安装路径，安装即可，在线安装因为国内网络的原因可能会失败，多试几次或者翻墙安装。


