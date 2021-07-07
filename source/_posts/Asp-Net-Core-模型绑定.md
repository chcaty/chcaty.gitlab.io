---
title: Asp.Net Core 模型绑定
date: 2019-06-26 23:46:33
categories: .Net Core
tags:
 - .Net Core
 - Model
---
#### 概述

ASP.NET Core MVC 的模型绑定会把Http Request 中的数据，以映射的方式对应到相应的参数中去.
<!--more-->
#### 模型绑定

要接收Client传来的数据,可以通过Action的参数接收,如下:

```cs
using Microsft.AspNetCore,Mvc;

namespace Caty.Web.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index(string username, string password)
        {
            return Content($"username:{username},password:{password}");
        }
    }
}
```

其中username和password就是从Http Requset的数据被绑定的模型参数.

默认的模型绑定会从Http Requset的三个地方取值(优先级由上到下)

* Form

  通过Http Post的Form取值

* Route

  通过MVC Route URL取值,如: http://localhost:5002/User/caty, 取的值就是caty.

* Query

  通过URL Query参数取值,如: http://localhost:5002/User?username=caty

如果三者都传入,取值的优先顺序为Form>Route>Query

#### 绑定属性

除了上面提到的三个默认的绑定来源外,还可以通过模型绑定属性从Http Request的其他地方中绑定参数,有以下6个类别:

* \[FromHeader\]

  从Http Header取值

* \[FromForm\]

  通过Http Post的Form取值

* \[FromRoute\]

  通过MVC Route URL取值

* \[FromQuery\]

  通过URL Query参数取值

* \[FromBody\]

  从Http Body取值,通常用于取Json,Xml.

  Asp.Net Core Mvc默认的序列化是使用Json,如果要使用Xml来进行模型绑定,需要在MVC服务中加入XmlSerializerFormatters.

  *Startup.cs*

  ```cs
  public void ConfigureServices(IServiceCollection services)
  {
      services.AddMvc()
              .AddXmlSerializerFormatters();
  }
  ```

* \[FromServices\]

  这不是从Http Requset取值,而是从DI容器取值.DI默认是构造器注入,但Controller可能会因为每个Action用到不一样的Service导致参数过多,所以也可以在Action注入Service.

#### 例子

```cs
public class UserController:Controller
{
    public IActionResult HeaderSample([FromHeader]string header)
    {
        return Content($"header:{header}");
    }
    public IActionResult FormSample([FromForm]string form)
    {
        return Content($"form:{form}");
    }
    public IActionResult IdSample([FromRoute]string id)
    {
        return Content($"id:{id}");
    }
    public IActionResult QuerySample([FromQuery]string query)
    {
        return Content($"query:{query}");
    }
    public IActionResult DISample([FromServices] ILogger<UserController> logger)
    {
        return Content($"logger is null:{logger == null}");
    }
    public IActionResult BodySample([FromBody]UserModel user)
    {
        return Ok(model);
    }
}

public class UserModel
{
    public string Code { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}
```

#### 模型验证

模型绑定也可以验证模型,需要在模型的属性上面带上 ValidationAttributes.

UserModel.cs

```cs
public class UserModel
{
    [Required]
    public string Code { get; set; }

    [RegularExpression(@"\w+")]
    [StringLength(20, MinimumLength = 4)]
    public string Name { get; set; }

    [EmailAddress]
    public string Email { get; set; }
}
```

UserController.cs

```cs
using Microsoft.AspNetCore.Mvc;

namespace MyWebsite.Controllers
{
    public class UserController : Controller
    {
        public IActionResult BodySample([FromBody]UserModel model)
        {
            if (ModelState.IsValid)
            {
                return Ok(model);
            }
            return BadRequest(ModelState);
        }
    }
}
```

#### 自定义模型验证

UserModel.cs

```cs
public class UserModel
{
    [Required]
    public string Code { get; set; }

    [RegularExpression(@"\w+")]
    [StringLength(20, MinimumLength = 4)]
    public string Name { get; set; }

    [EmailAddress]
    public string Email { get; set; }

    [AgeCheck(18,100)]
    public DataTime BirthDate { get; set; }
}
```

AgeCheckAttribute.cs

```cs
using System;
using System.ComponentModel.DataAnnotations;

namespace Caty.Web.Attributes
{
    public class AgeCheckAttribute : ValidationAttribute
    {
        public int MinimumAge { get; private set; }
        public int MaximumAge { get; private set; }

        public AgeCheckAttribute(int minimumAge, int maximumAge)
        {
            MinimumAge = minimumAge;
            MaximumAge = maximumAge;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var date = Convert.ToDateTime(value);

            if (date.AddYears(MinimumAge) > DateTime.Today
                || date.AddYears(MaximumAge) < DateTime.Today)
            {
                return new ValidationResult(GetErrorMessage(validationContext));
            }

            return ValidationResult.Success;
        }

        private string GetErrorMessage(ValidationContext validationContext)
        {
            // 有带 ErrorMessage 的話优先使用
            // [AgeCheck(18, 100, ErrorMessage="xxx")] 
            if (!string.IsNullOrEmpty(this.ErrorMessage))
            {
                return this.ErrorMessage;
            }

            // 自定义错误信息
            return $"{validationContext.DisplayName} can't be in future";
        }
    }
}
```
