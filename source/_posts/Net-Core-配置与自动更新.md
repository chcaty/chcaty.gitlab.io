---
title: .Net Core 配置与自动更新
date: 2018-03-07 22:27:31
categories: .Net Core
tags: 
 - .Net Core
---
.Net Core将之前Web. Config中的配置迁移到了appsettings.json文件中，并使用ConfigurationBuilder来读取该配置文件可设置在设置文件变化后自动重新加载，避免了重启程序。
<!--more-->

```cs
var builder = new ConfigurationBuilder()
 .SetBasePath(env.ContentRootPath)
 .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
 .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
 .AddEnvironmentVariables();
```

#### 配置信息读取

配置的读取比以前方便很多，可以直接使用。在ConfigurationBuilder调用Build()方法以后，就可直接取值

```cs
Configuration = builder.Build();
var value = Configuration["Section:Key"];
```

当配置更新以后，使用Configuration["Section: Key"]得到的也是最新的值。

#### 配置强类型

可以直接使用强类型，把配置文件转换成你的对象直接使用，只要对象的属性与配置中一一对应即可。

```cs
services.Configure<DatabaseOption>(configuration.GetSection("Database"));
```

然后在构造函数中注入

```cs
public EntityFrameWorkConfigure(IOptions<DatabaseOption> dataBaseOption)
 {
     _dataBaseOption = dataBaseOption;
 }
```

##### 注意：IOptions<T>是单例的，即当你修改了appsettings.json也不会改变它的值，这样一定要重启你的程序才会更新。

#### 使用IOptionsSnapshot<T>自动更新

如果你希望在使用强类型的时候，也可以自动更新你的配置而不用重启程序，你可以使用IOptionsSnapshot<T>

```cs
public EntityFrameWorkConfigure(IOptionsSnapshot<DatabaseOption> dataBaseOption)
 {
     _dataBaseOption = dataBaseOption;
 }
```

> 原文地址:`http://www.zkea.net/codesnippet/detail/post-80`
