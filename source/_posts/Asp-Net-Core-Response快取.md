---
title: Asp.Net Core Response快取
date: 2019-08-10 15:00:47
categories: .Net Core
tags:
 - .Net Core
 - Response
---
#### .Net Core Response简介

对Response回传的结果使用适当的快取机制,可以有助于性能提升,避免重复调用.

Asp.Net Core Response 快取分两种

* Client 端缓存

* Server 端快取

Asp.Net Core 可以通过ResponseCache设定Response的暂存方式,并设置到要使用Response快取的Controller或Action
<!--more-->

#### Client 端缓存

通过HttpHeader的Cache-Control告知浏览器,将页面保存至浏览器缓存区.Client端缓存只要设置ResponseCache即可.

##### Client 端缓存设置

*HomeController.cs*

```cs
public class HomeController : Controller
{
    [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Client)]
    public IActionResult Index()
    {
        return View();
    }
}
```

##### Client 端缓存参数

* Duration

  设置快取有效时间(单位是秒)

* Location

  设置快取方式,有三种选项

  * ResponseCacheLocation.Any

    可共用的缓存

  * ResponseCacheLocation.Client

    不可共用的缓存,根据使用者区分

  * ResponseCacheLocation.None

    不使用缓存功能

* NoStore

  不保存Response结果

* VaryByHeader

  设置区分缓存的HttpHeader

* VaryByQueryKeys

  设置区分缓存的Url Query String

* CacheProfileName

  可以在MVC Service设置好CacheProfile,然后在多个地方使用

  *Startup.cs*

  ```cs
  public void ConfigureServices(IServiceCoolection services)
  {
      services.AddMvc(options =>
      {
          options.CacheProfiles.Add("Default",
          new CacheProfile()
          {
              Duration = 60,
              Location = ResponseCacheLocation.Client
          });
      });
  }
  ```

  在Controller和Action,直接通过\[ResponseCache(CacheProfileName = "Default")\]来设置.

#### Server 端快取

Server 端Response快取适用于常被请求的页面或Api,且数据是可共用的数据,即所有请求返回的数据都是相同的.当在请求相同页面时,会把上次的处理结果从Server的快取中回传给Client,省去后续的操作.

* 第一次请求Action时,会经过根据后续步骤,获得返回值.

* 第二次请求Action时,由于上次回传结果已经存在Server快取,直接从快取回传上次的结果,省去后续步骤.

Server快取需要用到 Microsoft.AspNetCore.ResponseCaching 套件.

如果要搭配Server 端Response快取,除了使用\[ResponseCache\]外,还需要在DI容器中注入ResponseCaching 服务以及注册ResponseCaching的中间件.

##### Service 端快取设置

*Startup.cs*

```cs
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddResponseCaching(options => 
        {
            options.UseCaseSensitivePaths = false;
            options.MaximumBodySize = 1024;
            options.SizeLimit = 100 * 1024 * 1024;
        });
        services.AddMvc();
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseResponseCaching();
        app.UseMvcWithDefaultRoute();
    }
}
```

##### Service 端快取参数

* UseCaseSensitivePaths

  Url是否区分大小写为不同的Response快取,默认为true

* MaximumBodySize

  单个Response快取的大小限制(单位Bytes),默认64MB

* SizeLimit

  Response快取的总大小限制(单位Bytes),默认为100MB

##### Service 端快取条件

* 回传状态必须是Http Status 200(OK)

* Request 的Http Methods 必须是Get或Head

* 不能有其他的中间件在ResponseCaching中间件加工之前修改Response

* Http Header 不能用 Authorization

* Http Header 的CacheContro必须是public的

* Http Header 不能用Set-Cookie

* Http Header的Vary值不能为\*

* 不能使用IHttpSendFileFeature

* 不能设置 no-store

* 单一回传快取不能大于 MaximunBodySize

* 总快取大小不能大于SizeLimit
