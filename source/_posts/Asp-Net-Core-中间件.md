---
title: Asp.Net Core 中间件
date: 2019-06-25 23:39:29
categories: .Net Core
tags:
 - .Net Core
 - Middleware
---
#### 定义

.Net Core 里面的中间件串联在一起组成了管道,所有的 Request 及 Response都会经过管道.
<!--more-->
#### 建立中间件

*FirstMiddleware.cs*

```cs
public class TestMiddleware
{
    private readonly RequestDelegate _next;

    public TestMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        await context.Response.WriteAsync($"TestMiddleware 进入. \r\n");

        await _next(context);

        await context.Response.WriteAsync($"TestMiddleware 退出. \r\n");
    }
}
```

#### 全局注册

在Startup.Configue中注册,则全部的Request都会通过该中间件.

*Startup.cs*

```cs
public class Startup
{
    public void Configure(IApplicationBuilder app)
    {
        app.UseMiddleware<TestMiddleware>();
    }
}
```

#### 区域注册

中间件也可以仅在特定的控制器和请求上注册.

*ValueController.cs*

```cs
[MiddlewareFilter(typeof(TestMiddleware))]
public class ValueController : Controller
{
    [MiddlewareFilter(typeof(TestMiddleware))]
    public IActionResult Index()
    {
        // ...
    }
}
```

#### 扩展方法注册

大部分的中间件都会用一个静态方法来进行注册.

*CustomMiddlewareExtensions.cs*

```cs
public static class CustomMiddlewareExtensions
{
    public static IApplicationBuilder UseTestMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<TestMiddleware>();
    }
}
```

*Startup.cs*

```cs
public class Startup
{
    public void Configure(IApplicationBuilder app)
    {
        app.UseTestMiddleware();
    }
}
```
