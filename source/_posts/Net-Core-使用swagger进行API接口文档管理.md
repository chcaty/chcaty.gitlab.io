---
title: .Net Core 使用swagger进行API接口文档管理
date: 2018-03-11 22:20:31
categories: .Net Core
tags:
 - .Net Core
 - WebApi
---

##### 什么是Swagger

Swagger可以从不同的代码中, 根据注释生成API信息, swagger拥有强大的社区, 并且对于各种语言都支持良好, 有很多的工具可以通过swagger生成的文件生成API文档
<!--more-->

##### .Net Core中使用

.Net Core中使用, 首先要用nuget引用Swashbuckle. AspNetCore, 在startup.cs中加入如下代码

###### Startup.cs

```cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc();
    services.AddSwaggerGen(c => 
    {
        c.SwaggerDoc("v1", new Info { Title = "Hello", Version = "v1" });
        var basePath = PlatformServices.Default.Application.ApplicationBasePath;
        var xmlPath = Path.Combine(basePath, "WebApplication2.xml");
        c.IncludeXmlComments(xmlPath);
    });
    services.AddMvcCore().AddApiExplorer();
}

public void Configure(IApplicationBuilderapp, IHostingEnvironment env)
{
    if(env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseMvcWithDefaultRoute();
    app.UseSwagger(c =>
    {

    });
    app.UseSwaggerUI(c =>
    {
        c.ShowExtensions();
        c.VaildatorUrl(null);

        c.SwaggerEndpoint("/swagger/v1/swagger.json", "test V1");
    });
}
```

以上部分为加载swagger的代码, 位于startup.cs中, 下面是controller代码

###### ValuesController.cs

```cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication2.Controllers
{
    /// <summary>
    /// 测试信息
    /// </summmary>
    /// <returns></returns>
    [Route("api/[controller]/[action]")]
    public class ValuesController : Controller
    {
        /// <summary>
        /// 获得所有信息
        /// </summmary>
        /// <returns></returns>
        [HttpGet]
        public IEnumercble<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        /// <summary>
        /// 根据ID获取信息
        /// </summmary>
        /// <param name="id"></param>
        /// <returns></returns>
        // Get api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        /// <summary>
        /// Post数据信息
        /// </summmary>
        /// <param name="value"></param>
        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {

        }

        /// <summary>
        /// 根据ID put数据
        /// </summmary>
        /// <param name="id"></param>
        /// <param name="value"></param>
        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {

        }

        /// <summary>
        /// 根据ID删除数据
        /// </summmary>
        /// <param name="id"></param>
        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {

        }

        /// <summary>
        /// 复杂数据操作
        /// </summmary>
        /// <param name="id"></param>
        [HttpPost]
        public namevalue test(namevalue _info)
        {
            return _info;
        }
    }

    public class namevalue
    {
        /// <summary>
        /// name的信息
        /// </summmary>
        public String name { get; set; }

        /// <summary>
        /// value的信息
        /// </summmary>
        public String value { get; set; }
    }
}
```
