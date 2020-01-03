---
title: 微服务-Consul学习(二)
date: 2019-03-11 23:43:58
categories: 微服务
tags: 
 - .Net Core
 - 微服务
---
上一次学习到了在命令行如何去启动和注册服务.今天学习如何通过Consul Api 接口注册服务.
<!--more-->
#### 创建一个.Net Core WebApi项目
模板选择Api.
#### 创建HealthController,用于Consul的健康检查
HealthController.cs
``` cs
using Microsoft.AspNetCore.Mvc;

namespace ConsulApiTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() => Ok("ok");
    }
}
```
#### 创建ConsulBuilderExtensions,用于注册服务
ConsulBuilderExtensions.cs
```cs
using Consul;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using System;

namespace ConsulApiTest
{
    public static class  ConsulBuilderExtensions
    {
        public static IApplicationBuilder RegisterConsul(this IApplicationBuilder app, IApplicationLifetime lifetime, ServiceEntity serviceEntity)
        {
            var consulClient = new ConsulClient(x => x.Address = new Uri($"http://{serviceEntity.ConsulIP}:{serviceEntity.ConsulPort}"));//请求注册的 Consul 地址
            var httpCheck = new AgentServiceCheck()
            {
                DeregisterCriticalServiceAfter = TimeSpan.FromSeconds(5),//服务启动多久后注册
                Interval = TimeSpan.FromSeconds(10),//健康检查时间间隔，或者称为心跳间隔
                HTTP = $"https://{serviceEntity.IP}:{serviceEntity.Port}/api/health",//健康检查地址 (如果项目没有勾选https的话,把https换成http)
                Timeout = TimeSpan.FromSeconds(5)
            };

            // Register service with consul
            var registration = new AgentServiceRegistration()
            {
                Checks = new[] { httpCheck },
                ID = serviceEntity.ServiceName + "_" + serviceEntity.Port,
                Name = serviceEntity.ServiceName,
                Address = serviceEntity.IP,
                Port = serviceEntity.Port,
                Tags = new[] { $"urlprefix-/{serviceEntity.ServiceName}" }//添加 urlprefix-/servicename 格式的 tag 标签，以便 Fabio 识别
            };
            consulClient.Agent.ServiceRegister(registration).Wait();//服务启动时注册，内部实现其实就是使用 Consul API 进行注册（HttpClient发起）
            lifetime.ApplicationStopping.Register(() =>
            {
                consulClient.Agent.ServiceDeregister(registration.ID).Wait();//服务停止时取消注册
            });
            return app;
        }
    }
}
```
##### 注意:
1. 需引入Consul包
2. ServiceEntity类,定义如下
ServiceEntity.cs
```cs
namespace ConsulApiTest
{
    public class ServiceEntity
    {
        public string IP { get; set; }
        public int Port { get; set; }
        public string ServiceName { get; set; }
        public string ConsulIP { get; set; }
        public int ConsulPort { get; set; }
    }
}
```
3. appSettings.json配置文件 定义如下
appSettings.json
```cs
{
  "Service": {
    "Name": "DMSWebAPITest",
    "IP": "localhost",
    "Port": "44330"//这里需换成项目运行所使用的端口
  },
  "Consul": {
    "IP": "localhost",
    "Port": "8500"
  }
}
```
#### 在Startup.cs中,调用ConsulBuilderExtensions拓展方法
Startup.cs
```cs
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace ConsulApiTest
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IApplicationLifetime lifetime)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseMvc();
            // 服务注册
            ServiceEntity serviceEntity = new ServiceEntity
            {
                IP = Configuration["Service:IP"],
                Port = Convert.ToInt32(Configuration["Service:Port"]),  
                ServiceName = Configuration["Service:Name"],
                ConsulIP = Configuration["Consul:IP"],
                ConsulPort = Convert.ToInt32(Configuration["Consul:Port"])
            };
            app.RegisterConsul(lifetime, serviceEntity);
        }
    }
}

```
#### 小结
* 在学习过程还是遇到一些问题,不过最终还是处理好了,有时候可能需要细心一点
* 以上实现了通过配置文件注册，API接口注册到Consul实例，后续加入Ocelot构建API网关，到时会结合Consul进行进一步的集成，另外，还会尝试Polly进行熔断降级。