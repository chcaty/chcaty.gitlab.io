---
title: Asp.Net Core 过滤器
date: 2019-07-03 23:52:10
categories: .Net Core
tags:
 - .Net Core
 - Filter
---
#### Filter 简介
Filter的作用是在Action执行前或执行后做一些加工处理.跟中间件类似,但执行的顺序略有不同.把Filter用好了,可以减少代码量和提高执行效率.
<!--more-->
##### Filter 分类
* Authorization Filter

  优先级最高,常用于验证请求是否合法,不合格则跳过后续处理

* Resource Filter

  第二优先级,在授权之后,模型绑定之前执行,常用于需要对模型加工处理.

* Action Filter

  与Resource Filter类似,但不经过模型绑定

* Exception Filter

  异常处理的Filter

* Result Filter

  在Action完成后,最后会经过的Filter.

##### Filter 运作方式

每一个Request都会先经过已注册的中间件才会执行过滤器.

顺序一般为:Request -> 中间件 -> Authorization Filters -> Resource Filters -> 模型绑定 -> Action Filters -> Action -> Action Filters -> Result Filters -> Resource Filters -> 中间件 -> Response

#### 创建Filter

*Authorization Filter.cs*
```cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Caty.Web.Filters
{
    public class AuthorizationFilter : IAuthorizationFilter, IAsyncAuthorizationFilter
    {
        // 同步
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            context.HttpContext.Response.WriteAsync($"{GetType().Name} 进入.\r\n");
        }
        // 异步
        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            await context.HttpContext.Response.WriteAsync($"{GetType().Name} 进入.\r\n");
        }
    }
}
```
*Resource Filter.cs*
```cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Caty.Web.Filters
{
    public class ResourceFilter : IResourceFilter,IAsyncResourceFilter
    {
        // 同步
        public void OnResourceExecuting(ResourceExecutingFilterContext context)
        {
            context.HttpContext.Response.WriteAsync($"{GetType().Name} 进入.\r\n");
        }

        public void OnResourceExecuted(ResourceExecutedFilterContext context)
        {
            context.HttpContext.Response.WriteAsync($"{GetType().Name} 退出.\r\n");
        }
        // 异步
        public async Task OnResourceExecutionAsync(AuthorizationFilterContext context)
        {
            await context.HttpContext.Response.WriteAsync($"{GetType().Name} 进入.\r\n");
            await next();
            await context.HttpContext.Response.WriteAsync($"{GetType().Name} 退出.\r\n");
        }
    }
}
```
Action Filter, Result Filter,Exception Filter 与 Resource Filter 类似,只是分别继承了不同的接口,
* Action Filter 同步继承 IActionFilter,异步继承IAsyncActionFilter;
* Result Filter 同步继承IResultFilter,异步继承IAsyncResultFilter;
* Exception Filter 同步继承IExceptionFilter ,异步继承IAsyncExceptionFilter.

#### 注册 Filter

有两种注册方式,一种是全局注册,另一种是用\[Attribute\]来区域注册,只用于特定的控制器或接口.

##### 全局注册

Startup.cs

```cs
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc(config => 
        {
            config.Filters.Add(new ResultFilter());
            config.Filters.Add(new ExceptionFilter());
            config.Filters.Add(new ResourceFilter());
        });
    }
}
```

##### 区域注册

在控制器或者接口上面加上\[TypeFilter(type)\]就可以区域注册Filter.

```cs
namespace Caty.Web.Controllers
{
    [TypeFilter(typeof(AuthorizationFilter))]
    public class HomeController : Controller
    {
        [TypeFilter(typeof(ActionFilter))]
        public void Index()
        {
            Response.WriteAsync("Hello World! \r\n");
        }
        
        [TypeFilter(typeof(ActionFilter))]
        public void Error()
        {
            throw new System.Exception("Error");
        }
    }
}
```

如果Filter继承Attribute,则可以用\[Attribute\]进行Filter的注册.

```cs
public class AuthorizationFilter : Attribute, IAuthorizationFilter
{
    // ...
}
public class ActionFilter : Attribute, IActionFilter
{
    // ...
}
```

```cs
namespace Caty.Web.Controllers
{
    [AuthorizationFilter]
    public class HomeController : Controller
    {
        [ActionFilter]
        public void Index()
        {
            Response.WriteAsync("Hello World! \r\n");
        }
        
        [ActionFilter]
        public void Error()
        {
            throw new System.Exception("Error");
        }
    }
}
```

#### 执行顺序

预设注册同类型的Filter是以先进后出的方式处理封包,注册层级也会影响执行顺序.

Global->Controller->Action

也可以通过实现IOrderFilter修改执行顺序.

```cs
public class ActionFilter : Attribute, IActionFilter, IOrderedFilter
{
    public string Name { get; set; }

    public int Order { get; set; } = 0;

    public void OnActionExecuting(ActionExecutingContext context)
    {
        context.HttpContext.Response.WriteAsync($"{GetType().Name}({Name}) 进入. \r\n");
    }
    public void OnActionExecuted(ActionExecutedContext context)
    {
        context.HttpContext.Response.WriteAsync($"{GetType().Name}({Name}) 退出. \r\n");
    }
}
```

在注册Filter时带上Order,数值越小优先级越高.

```cs
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc(config =>
        {
            config.Filters.Add(new ActionFilter() { Name = "Global", Order = 3 });
        });
    }
}
```
