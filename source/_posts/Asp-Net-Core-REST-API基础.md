---
title: Asp.Net Core REST API基础
date: 2018-06-08 15:37:04
categories: .Net Core
tags:
 - .Net Core
 - REST API
---
#### 前言
前段时间,毕业设计用的是前后端分离的设计,后端就是基于Asp.Net Core开发的 REST API,借这个机会,顺路梳理一下关于REST API与Asp.Net Core建立REST API的基础知识
<!--more-->
#### REST 的定义
REST 是 Representational State Transfer 的缩写. 它是一种架构的风格, 这种风格基于一套预定义的规则, 这些规则描述了网络资源是如何定义和寻址的.
一个实现了REST这些规则的服务就叫做RESTful的服务.
#### REST 的原则
RESTful API 最关心的有这几方面: 性能, 可扩展性, 简洁性, 互操作性, 通讯可见性, 组件便携性和可靠性.
这些方面被封装在REST的6个原则里, 它们是: 
1. 客户端-服务端约束: 客户端和服务端是分离的, 它们可以独自的进化.
2. 无状态: 客户端和服务段的通信必须是无状态的, 状态应包含在请求里的. 也就是说请求里要包含服务端需要的所有的信息, 以便服务端可以理解请求并可以创造上下文.
3. 分层系统: 就像其它的软件架构一样, REST也需要分层结构, 但是不允许某层直接访问不相邻的层. 
4. 统一接口: 这里分为4点, 他们是: 资源标识符(URI), 资源的操作(也就是方法Method, HTTP动词), 自描述的响应(可以认为是媒体类型Media-Type), 以及状态管理(超媒体作为应用状态的引擎 HATEOAS, Hypermedia as the Engine of Application State).
5. 缓存: 缓存约束派生于无状态约束, 它要求从服务端返回的响应必须明确表明是可缓存的还是不可缓存的.
6. 按需编码: 这允许客户端可以从服务端访问特定的资源而无须知晓如何处理它们. 服务端可以扩展或自定义客户端的功能.
#### Asp.Net Core Action
在Controller里面，可以使用public修饰符来定义Action，通常会带有参数，可以返回任何类型，但是大多数情况下应该返回IActionResult。Action的方法名要么是以HTTP的动词开头，要么是使用HTTP动词属性标签，包括：[HttpGet], [HttpPut], [HttpPost], [HttpDelete], [HttpHead], [HttpOptions], [HttpPatch].

Controller基类提供了很多帮助方法，例如：Ok, NotFound, BadRequest等，它们分别对应HTTP的状态码 200, 404, 400；此外还有Redirect，LocalRedirect，RedirectToRoute，Json，File，Content等方法。

路由属性标签可以标注在Controller或者Action方法上

##### 实体绑定
如果定义在路由里,Action可以自动映射,没有定义在路由里的,可以通过使用属性标签告诉Action从哪里获取参数,属性标签包含[FromBody],[FromForm],[FromHeader],[FromRoute],[FromServices]等
```cs
using System;
using Microsoft.AspNetCore.Mvc;
using IRS.Model;

namespace IRS.Web.Controllers
{
    [Route("api/address")]
    public class AddressController : Controller
    {
        private ICategoryInfoService _categoryInfoService;
        public AddressController(ICategoryInfoService categoryInfoService)
        {
            _categoryInfoService = categoryInfoService;
        }
        
        [HttpGet]
        public ActionResult GetAddressInfos()
        {
            var addresslist = _categoryInfoService.LoadEntities(c => c.CategoryInfoType == 1);
            return Json(new
            {
                data = addresslist
            });
        }
        
        [HttpGet("{id}")]
        public ActionResult GetAddressInfo(int id)
        {
            var address = _categoryInfoService.LoadEntities(c => c.CategoryInfoId == id && c.CategoryInfoType == 1).FirstOrDefault();
            return Json(new
            {
                data =address
            });
        }
        
        [HttpPost]
        public ActionResult AddAddressInfo([FromBody] CategoryInfo categoryInfo)
        {
            var result = _categoryInfoService.AddEntity(categoryInfo);
            return Json(new
            {
                status_code = 200
            });
        }
    }
}
```

##### 实体验证
Asp.Net Core内置的实体验证是通过验证属性标签来实现的
```cs
 public class CategoryInfo
    {
        [Required]
        public int CategoryInfoId { get; set; }
        [Required]
        public int CategoryInfoType { get; set; }
        [MinLength(3)]
        public string CategoryInfoName { get; set; }
        [Range(0,1)]
        public int CategoryInfoEnable { get; set; }
        public int CategoryInfoOrder { get; set; }
        public int StartFlag { get; set; }
        public int EndFlag { get; set; }
    }
```
判断实体参数是否符合要求，可以检查ModelState.IsValid属性
```cs
public IActionResult Post([FromBody] CategoryInfo category)
{
    if(ModelState.IsValid)
    {
        return Ok();
    }
    return BadRequest(ModelState);
}
```
使用Display可以自定义属性的显式名称，在其它错误信息里可以使用{0}来引用该名称
```cs
public class CategoryInfo
    {
        [Required]
        public int CategoryInfoId { get; set; }
        [Required]
        public int CategoryInfoType { get; set; }
        [Display(Name ="分类名"), Required, MaxLength(10, ErrorMessage="{0}的长度不可超过{1}")]
        public string CategoryInfoName { get; set; }
        [Range(0,1)]
        public int CategoryInfoEnable { get; set; }
        public int CategoryInfoOrder { get; set; }
        public int StartFlag { get; set; }
        public int EndFlag { get; set; }
    }
```
通过继承VaildationAttribute来创建自定义验证属性标签
```cs
using System.ComponentModel.DataAnnotations;

namespace IRS.API.CustomValidations
{
    public class NameHasHyphenAttribute:ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var str = value.ToString();
            if(str.IndexOf(' ') == -1)
            {
                return new ValidationResult("名称必须包含-");
            }
            return ValidationResult.Success;
        }
    }
}
```
将标签放到CategoryInfoName属性上即可.

未完待续....