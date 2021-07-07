---
title: .Net Core Ocelot
date: 2018-03-29 18:15:26
categories: .Net Core
tags:
 - .Net Core
 - Ocelot
---
Ocelot是一个用.Net Core实现并且开源的API网关, 它功能强大, 包括了：路由、请求聚合、服务发现、认证、鉴权、限流熔断，并内置了负载均衡器与Service Fabric、Butterfly Tracing集成。
<!--more-->

##### 安装Ocelot

通过nuget安装Ocelot

```cs
Install-Package Ocelot
```

##### 配置

Ocelot.json
最基本的配置信息

```cs
{
    "ReRoutes":[],
    "GlobalConfiguration":{
        "BaseUrl":"https://chcaty.com"
    }
}
```

将配置文件加入Asp.Net Core Configuration

```cs
public static IWebHost BuildWebHost(string[] args) => WebHost.CreateDefaultBuilder(args).ConfigureAppConfiguration((hostingContext,builder) => {
    builder.SetBasePath(hostingContext.HostingEnvironment.ContentRootPath).AddJsonFile("Ocelot.json");
}).UseStartUp<StartUp>().Build();
```

配置依赖注入和中间件

```cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddOcelot();
}

public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    if(env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    app.UseOcelot().Wait();
}
```
