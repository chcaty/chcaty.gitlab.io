---
title: .Net Core 使用日志NLog
date: 2018-03-16 21:40:12
categories: .Net Core
tags:
 - .Net Core
 - NLog
---
将 ASP.NET Core 提供的默认日志提供程序替换成 NLog。
<!--more-->

##### 添加相关依赖
```
Install-Package NLog.Extensions.Logging -Pre
Install-Package NLog.Web.AspNetCore
```

##### 创建好Nlog配置文件(nlog.config)
```cs
<?xml version="1.0" encoding="utf-8" ?>  
<nlog xmlns="http://www.nlog-project.org/schemas/NLog.xsd"  
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
      autoReload="true"  
      internalLogLevel="Warn"  
      internalLogFile="internal-nlog.txt">  
  
  <!--define various log targets-->  
  <targets>  
  
    <!--write logs to file-->  
    <target xsi:type="File" name="allfile" fileName="nlog-all-${shortdate}.log"  
                 layout="${longdate}|${logger}|${uppercase:${level}}|${message} ${exception}" />  
  
    <target xsi:type="File" name="ownFile-web" fileName="nlog-my-${shortdate}.log"  
                 layout="${longdate}|${logger}|${uppercase:${level}}|${message} ${exception}" />  
  
    <target xsi:type="Null" name="blackhole" />  
  
  </targets>  
  
  <rules>  
    <!--All logs, including from Microsoft-->  
    <logger name="*" minlevel="Trace" writeTo="allfile" />  
  
    <!--Skip Microsoft logs and so log only own logs-->  
    <logger name="Microsoft.*" minlevel="Trace" writeTo="blackhole" final="true" />  
    <logger name="*" minlevel="Trace" writeTo="ownFile-web" />  
  </rules>  
</nlog>  
```

##### Startup.cs中添加使用的服务
```cs
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)  
{
    loggerFactory.AddNLog();//添加NLog  
    env.ConfigureNLog("nlog.config");//读取Nlog配置文件  
    //..............  
} 
```

##### 使用日志
```cs
//获得日志的实例  
static Logger Logger = LogManager.GetCurrentClassLogger();  
public IActionResult Index()  
{
    Logger.Info("普通信息日志-----------");  
    Logger.Debug("调试日志-----------");  
    Logger.Error("错误日志-----------");  
    Logger.Fatal("异常日志-----------");  
    Logger.Warn("警告日志-----------");  
    Logger.Trace("跟踪日志-----------");  
    Logger.Log(NLog.LogLevel.Warn, "Log日志------------------");  
    return View();  
}  
```