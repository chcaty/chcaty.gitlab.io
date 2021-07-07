---
title: Asp.Net Core 压缩封包
date: 2019-08-10 15:04:49
categories: .Net Core
tags:
 - .Net Core
 - Gzip
---
#### 简介

Asp.Net Core 不会自动把所有封包进行压缩,要对Response的内容进行压缩,可以使用ResponseCompression套件提供的压缩方式
<!--more-->

#### 启用封包压缩

在Startup.ConfigureServices 加入封包压缩的服务以及Startup.Configure 注册封包压缩的中间件.

Startup.cs

```cs
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddResponseCompression();
        services.AddMvc();
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseResponseCompression();
        app.UseStaticFiles();
        app.UseMvcWithDefaultRoute();
    }
}
```

> ps:默认的压缩方式是Gzip

#### ResponseCompressionOptions

可以通过ResponseCompressionOptions调整要被压缩的MimeTypes以及压缩的方法等.

Startup.cs

```cs
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
            options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[]
            {
                "image/png"
            });
        });
        services.Configure<GzipCompressionProviderOptions>(options =>
        {
            options.Level = System.IO.Compression.CompressionLevel.Optimal;
        });
        services.AddMvc();
    }
}
```

* EnableForHttps

  是否要对Https的封包进行压缩.默认为false

* MimeType

  设置要进行压缩的MimeTypes.默认的有text/plain, text/css, application/javascript, text/html, application/xml, text/xml, application/json, text/json.

* GzipCompressionProviderOptions

  设定Gzip的压缩方式,默认为CompressionLevelFastest 快速压缩.

> 压缩的好处是Response的封包变小,节省流量,但会消耗Cpu效能

##### 自定义压缩

某些情况可能会需要自定义封包的压缩方式,例如Server to Server的Api对接,双方使用约定好的压缩方式.

可以继承ICompressionProvider,实例化自定义的压缩方法.并通过HttpHeader的Accept-Encoding指定压缩方式.再将自定义的压缩方法加入到ResponseCompressionOptions.Providers.

CustomCompressionProvider.cs

```cs
public class CustomCompressionProvider:ICompressionProvider
{
    public string EncodingName => "customcompression";
    public bool SupportsFlush => true;

    public Stream CreateStream(Stream outputStream)
    {
        return outputStream;
    }
}
```

Startup.cs

```cs
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddResponseCompression(options =>
        {
            options.Providers.Add<CustomCompressionProvider>();
        });
        services.AddMvc();
    }
}
```

当Http Header的Accept-Encoding = customcompression 就会使用CustomCompressionProvider压缩封包.
