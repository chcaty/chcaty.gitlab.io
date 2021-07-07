---
title: Asp.Net Core Url 重写
date: 2019-06-25 23:49:06
categories: .Net Core
tags:
 - .Net Core
 - Url 重写
---
#### Url重写的引用

* 需要引入nuget包 Microsoft.AspNetCore.Rewrite
* 在Startup.cs 建立Url重写规则,并注册Url重写中间件

  ```cs
    public class  Startup
    {
        public void Configure(IApplicationBuilder app)
        {
            var rewrite = new RewriteOptions()
                //Url重写
                .AddRewrite("error.html", "home/error", skipRemainingRules: true);
                //Url重定向
                .AddRedirect("main", "home/index");
            app.UseRewriter(rewrite);
        }
    }
    ```
<!--more-->
#### Url重写

Url重写是属于Server端的转换事件,当Client端Request的时候,发现原地址被替换了,则自动回传新地址的内容.

##### AddRewrite()方法

有三个参数,当Url符合参数1时就将参数2路由的内容回传给Client,skipRemainingRules为true时,当找到匹配条件时,则不再继续往下寻找.参数1支持正则匹配.

```cs
AddRewrite("users?id=(\w+)", "users/$1", true);
```

#### Url重定向

Url重定向是属于Client的转换事件,当 Client 端 Request 來的時候，发现原地址被替换了，Server 會先回传給 Client 告知新地址，再由 Client 重新 Request 新地址.

##### AddRedirect()方法

有3个参数,当Url符合参数1时,会回传参数2的Url给Client,参数3用于指定回传的HTTP Stastus Code(301/302),不指定时默认为302,参数1支持正则匹配.

```cs
AddRedirect("api/(.*)/(.*)/(.*)", "api?p1=$1&p2=$2&p3=$3", 301);
```

##### HTTP Status Code 301

301是指该网址已经永久转移到另一个地方,常用于网站搬家和网站改版,新旧版本路径不相同,要重新对应的情况

##### HTTP Status Code 302

302是指该网站暂时被转移到另一个地方,常用于网站维护时.
