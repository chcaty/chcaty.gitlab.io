---
title: .Net Core 修改IOC为Autofac
date: 2018-03-17 09:42:34
categories: .Net Core
tags:
 - .Net Core
 - Autofac
---
本文主要讲解如何更换Asp.Net Core的IOC为Autofac
<!--more-->

##### 安装Autofac

在Nuget上，找到Autofac和Autofac. Extensions. DependencyInjection，直接安装。

##### 创建容器并注册依赖

修改Startup.cs中的代码，主要ConfigureServices(IServiceCollection services)方法。其中该方法默认的返回值为void，这里需要修改返回值为IServiceProvider。代码如下：

```cs
public IContainer ApplicationContainer { get; private set; }
// ConfigureServices is where you register dependencies. This gets
// called by the runtime before the Configure method, below.
public IServiceProvider ConfigureServices(IServiceCollection services)
{
    // Add services to the collection.
    services.AddMvc();

    // Create the container builder.
    var builder = new ContainerBuilder();

    // Register dependencies, populate the services from
    // the collection, and build the container. If you want
    // to dispose of the container at the end of the app,
    // be sure to keep a reference to it as a property or field.
    builder.RegisterType<MyType>().As<IMyType>();
    builder.Populate(services);
    this.ApplicationContainer = builder.Build();

    // Create the IServiceProvider based on the container.
    return new AutofacServiceProvider(this.ApplicationContainer);
}
```
