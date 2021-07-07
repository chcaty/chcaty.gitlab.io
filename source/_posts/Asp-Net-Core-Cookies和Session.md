---
title: Asp.Net Core Cookies和Session
date: 2019-07-01 23:35:38
categories: .Net Core
tags:
 - .Net Core
 - Cookies
 - Session
---
#### 概述

Http是没有记录状态的协定,但是可以通过Cookies将Request来源区分开来,并将部分数据暂存于Cookies和Session,是比较常见的用户数据暂存方式
<!--more-->
#### Cookies

Cookies是将用户数据存在Client的浏览器,每次Request都会把Cookies发送到Server.在Asp.Net Core中要使用Cookie,可以通过HttpContext.Request 及 HttpContext.Response存入和取出.

Startup.cs

```cs
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Caty.Web
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {

        }

        public void Configure(IApplicationBuilder app)
        {
            app.Run(async (context) =>
            {
                string message;
                if (!context.Request.Cookies.TryGetValue("Caty", out message))
                {
                    message = "数据已存入cookies.";
                }
                context.Response.Cookies.Append("Caty", "启用Cookies.");
                // 刪除Cookies数据
                await context.Response.WriteAsync($"{message}");
            });
        }
    }
}
```

> 当Cookies存入的数据越多,封包就会越大,因为每个Request都会带着Cookies数据

#### Session

Session是通过Cookies内的唯一识别标识,把用户数据存入到Server端的数据库或NoSql.
Asp.Net Core使用Session要先加入两个服务

* Session 容器

  Session可以存在不同的地方,通过DI 分布式缓存 ,让Session服务知道要将Session存入哪里.
* Session 服务

  在DI容器加入Session服务,并将Session的中间件加入管道.

Startup.cs

```cs
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Caty.Web
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            // 將 Session 存在 ASP.NET Core 記憶體中
            services.AddDistributedMemoryCache();
            services.AddSession();
        }

        public void Configure(IApplicationBuilder app)
        {
            // SessionMiddleware 加入 Pipeline
            app.UseSession();

            app.Run(async (context) =>
            {
                context.Session.SetString("Sample", "This is Session.");
                string message = context.Session.GetString("Sample");
                await context.Response.WriteAsync($"{message}");
            });
        }
    }
}
```

#### 数据模型

要将Model存到Session中,需要自己进行序列化.如Json

SessionJson.cs

```cs
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Caty.Web
{
    public static class SessionJson
    {
        public static void SetObject<T>(this ISession session, string key, T value)
        {
            session.SetString(key, JsonConvert.SerializeObject(value));
        }

        public static T GetObject<T>(this ISession session, string key)
        {
            var value = session.GetString(key);
            return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
        }
    }
}
```

调用

```cs
var user = context.Session.GetObject<UserModel>("user");
context.Session.SetObject("user", user);
```

#### 安全性

Session数据都存在Server端看似安全,但如果封包被拦截,一样可以取到用户数据.

##### 安全调整建议

* SecurePolicy

  限制只有在Https请求的情况下,才允许使用Session.在加密请求下,不容易被拦截.
* IdleTimeOut

  合理修改Session到期时间,默认是20分钟没有与Server通讯的Request就会将Session'修改为过去状态.
* Name

  修改默认的Session名称,避免暴露网站技术和Server信息.
  
  Startup.cs

  ```cs
  public void ConfigureServices(IServiceCollection services)
  {
      services.AddDistributedMemoryCache();
      service.AddSession(options = >
      {
          options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
          options.Cookie.Name = "CatyWeb";
          options.IdTimeout = TimeSpan.FromMinutes(5);
      });
  }
  ```

#### 强类型

因为Cookies和Session默认是通过字符串的方式来存取数据,弱类型可能会存在打错字的情况.

SessionWapper.cs

```cs
using Microsoft.AspNetCore.Http;
using MyWebsite.Extensions;

public interface ISessionWapper
{
    UserModel User { get; set; }
}

public class SessionWapper : ISessionWapper
{
    private static readonly string _userKey = "session.user";
    private readonly IHttpContextAccessor _httpContextAccessor;

    public SessionWapper(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ISession Session
    {
        get
        {
            return _httpContextAccessor.HttpContext.Session;
        }
    }

    public UserModel User
    {
        get
        {
            return Session.GetObject<UserModel>(_userKey);
        }
        set
        {
            Session.SetObject(_userKey, value);
        }
    }
}
```

在DI容器中加入IHttpContextAccessor和ISeesionWapper.

Startup.cs

```cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
    services.AddSingleton<ISessionWapper, SessionWapper>();
}
```

IHttpContextAccessor
实现了 `IHttpContextAccessor`，让 `HttpContext` 可以注入給需要用到的物件使用。
`IHttpContextAccessor` 是 `HttpContext` 实例的接口，用 **Singleton**的方式可以供其它物件使用。

调用

HomeController.cs

```cs
namespace Caty.Wed.Controllers
{
    public class HomeController : Controller
    {
        private readonly ISessionWapper _sessionWapper;

        public HomeController(ISessionWapper sessionWapper)
        {
            _sessionWapper = sessionWapper;
        }

        public IActionResult Index()
        {
            var user = _sessionWapper.User;
            _sessionWapper.User = user;
            return Ok(user);
        }
    }
}
```
