---
title: IdentityServer4 ClientCredential模式
date: 2019-11-02 12:48:58
categories: .Net Core
tags:
 - .Net Core
 - IdentityServer4
---
#### 使用客户端认证保护Api

此博客介绍了使用IdentityServer保护API的最基本场景.
在这种情况下,我们将定义一个API和要访问它的客户端.客户端将在IdentityServer上请求访问令牌,并使用它来访问API.

#### 准备

先交代一下需要用的到包以及版本

* .Net Core 3.0.0
* IdentityServer4.AccessTokenValidation 3.0.1
* IdentityServer4 3.0.2
* IdentityModel 4.0.0

#### IdentityServerCenter

这是一个ASP.NET Core Web Api项目,认证服务中心,主要用为Token的发放,引用IdentityServer4包

<!--more-->

##### Config.cs

```cs
public class Config
{
    public static IEnumerable<ApiResource> GetResources()
    {
        return new List<ApiResource>()
        {
            new ApiResource("api", "My Api")
        };
    }

    public static IEnumerable<Client> GetClients()
    {
        return new List<Client>
        {
            new Client()
            {
                ClientId = "client",
                AllowedGrantTypes = GrantTypes.ClientCredentials,
                ClientSecrets = new List<Secret>
                {
                    new Secret("secret".Sha256())
                },
                AllowedScopes = {"api"}
            }
        };
    }
}
```

##### Startup.cs

```cs
public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddIdentityServer()
            .AddDeveloperSigningCredential()
            .AddInMemoryApiResources(Config.GetResources())
            .AddInMemoryClients(Config.GetClients());
        services.AddControllers();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        app.UseHttpsRedirection();
        app.UseIdentityServer();
        app.UseRouting();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}
```

通过查看launchsettings.json,获知和修改项目运行时的端口.
