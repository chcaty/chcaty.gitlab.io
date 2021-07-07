---
title: Asp.Net Core 异常处理
date: 2019-07-13 22:34:02
categories: .Net Core
tags:
 - .Net Core
 - Exception
---
异常处理在程序开发中也是一个比较重要的事,一方面可以避免暴露不该暴露的东西,另一方面也在出现问题时,可以及时的定位到异常发生的位置.
<!--more-->

#### Exception Filter

Exception Filter 只能够捕捉到Action和Action Filter 所发出的Exception.其他类型的Filter或Middleware产生的Exception,无法通过Exception Filter 拦截.并不太适合用来做全站通用的Exception Handler.

ExceptionFilter.cs

```cs
public class ExceptionFilter : IAsyncExceptionFilter
{
    public Task OnExceptionAsync(ExceptionContext context)
    {
        context.HttpContext.Response.WriteAsync($"{GetType().Name 出现异常,异常信息:{context.Exception.Message}}");
        return Task.CompletedTask;
    }
}
```

Starpup.cs

```cs
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc(config => 
        {
            config.Filters.Add(new ExceptionFilter());
        });
    }
}
```

> PS:如果只是注册了一个Exception Filter,那么Filter注册的前后顺序并不重要.只有同类型的Filter才会关系到注册的先后顺序.

#### Exception Middleware

Middleware 注册的层级可以在Filter的外层,也就是全部的Filter都会经过Middleware.那么只需要在Exception Middleware注册在所有Middleware的最外层,就可以捕捉到全站的异常.

ExceptionMiddleware.cs

```cs
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await context.Response.WriteAsync($"{GetType().Name} 出现异常,异常消息:{ex.Message}");
        }
    }
}
```

Startup.cs

```cs
public class Startup
{
    public void Configure(IApplicationBuilder app)
    {
        app.UseMiddleware<ExceptionMiddleware>();
    }
}
```

> PS:Middleware的注册顺序很关键,越先注册会在越外层.ExceptionMiddleware注册在越外层,捕捉的范围就越大.

#### Exception Handler

Asp.Net Core有提供Exception Handler 的管道,可以直接调用UseExceptionHandler指定错误页面.

Startup.cs

```cs
public class Startup
{
    public void Configure(IApplicationBuilder app)
    {
        app.UseExceptionHandler("/error")
    }
}
```

ExceptionHandlerOptions

UseExceptionHandler 除了可以指派错误页面外,也可以自己实现错误发生触发的事件.

Startup.cs

```cs
public class Startup
{
    public void Configure(IApplicationBuilder app)
    {
        app.UseExceptionHandler(new ExceptionHandlerOptions()
        {
            ExceptionHandler = async context =>
            {
                bool isApi = Regex.IsMatch(context.Request.Path.Value,"^/api/",RegexOptions.IgnoreCase);
                if(isApi)
                {
                    context.Response.ContentType = "application/json";
                    var json = @"{ ""Message"":""Internal Server Error""}";
                    await context.Response.WriteAsync(json);
                    return;
                }
                context.Response.Redirect("/error");
            }
        });
    }
}
```

上面特別对 API 的错误进行了处理，当请求 `http://localhost:5000/api/*` 发生错误时，会回传 JSON 格式的错误。而且把 请求MVC发生的错误 ，改用转址的方式转到 `http://localhost:5000/error`

#### UseDeveloperExceptionPage

UseDeveloperExceptionPage 是Asp.Net Core提供的错误信息页面服务.

Startup.cs

```cs
public class Startup
{
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        // 在开发阶段调用Asp.Net Core提供的错误信息页面
        if(env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseExceptionHandler("/error");
        }
    }
}
```
