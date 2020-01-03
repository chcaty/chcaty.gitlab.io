---
title: Asp.Net Core中使用Session
date: 2018-03-11 00:18:04
categories: .Net Core
tags:
 - .Net Core
 - Session
---
##### 添加Session
在你的项目上基于NuGet添加：Microsoft.AspNetCore.Session。
<!--more-->

##### 修改Startup.cs
在startup.cs找到方法ConfigureServices(IServiceCollection services) 注入Session(这个地方是Asp.net Core pipeline):services.AddSession();

接下来我们要告诉Asp.net Core使用内存存储Session数据，在Configure(IApplicationBuilder app,...)中添加代码:app.UseSession();

##### Session
1. 在MVC Controller里使用HttpContext.Session
```cs
using Microsoft.AspNetCore.Http;

public class HomeController:Controller
{
    public IActionResult Index()
    {
        HttpContext.Session.SetString("code","123456");
        return View();  
    }

    public IActionResult About()
    {
        ViewBag.Code=HttpContext.Session.GetString("code");
        return View();
    }
}
```

2. 如果不是在Controller里，你可以注入IHttpContextAccessor
```cs
public class SomeOtherClass
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private ISession _session=> _httpContextAccessor.HttpContext.Session;

    public SomeOtherClass(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor=httpContextAccessor;
    }

    public void Set()
    {
        _session.SetString("code","123456");
    }
    
    public void Get()
    {
        string code = _session.GetString("code");
    }
}
```

##### 存储复杂对象
存储对象时把对象序列化成一个json字符串存储。
```cs
public static class SessionExtensions
{
    public static void SetObjectAsJson(this ISession session, string key, object value)
    {
        session.SetString(key, JsonConvert.SerializeObject(value));
    }

    public static T GetObjectFromJson<T>(this ISession session, string key)
    {
        var value = session.GetString(key);

        return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
    }
}
```

```cs
var myComplexObject = new MyClass();
HttpContext.Session.SetObjectAsJson("Test", myComplexObject);

var myComplexObject = HttpContext.Session.GetObjectFromJson<MyClass>("Test");
```

##### 使用SQL Server或Redis存储
1、SQL Server

添加引用  "Microsoft.Extensions.Caching.SqlServer": "1.0.0"

注入：
```cs
// Microsoft SQL Server implementation of IDistributedCache.
// Note that this would require setting up the session state database.
services.AddSqlServerCache(o =>
{
    o.ConnectionString = "Server=.;Database=ASPNET5SessionState;Trusted_Connection=True;";
    o.SchemaName = "dbo";
    o.TableName = "Sessions";
});
```

2、Redis

添加引用   "Microsoft.Extensions.Caching.Redis": "1.0.0"

注入：
```cs
// Redis implementation of IDistributedCache.
// This will override any previously registered IDistributedCache service.
services.AddSingleton<IDistributedCache, RedisCache>();
```