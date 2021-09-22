---
title:  .Net Core Mock MediatR
date: 2021-09-22 23:33:57
categories: C# 
tags: 
 - MediatR
 - C#
---
### 前言

最近公司新架构开始逐步投入使用了，里面用到了Mediator。Mdeiator 是一款进程内的消息订阅、发布框架。支持在进程内以单程或多播的形式进行消息传递。使用Mdeiator，可以实现消息的发送和处理充分解耦。
<!--more-->

### 中介者模式

说到了Mediat，中介者模式是需要了解一下的。

#### 中介者模式的定义

中介者模式(Mediator Pattern)定义：用一个中介对象来封装一系列的对象交互，中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。中介者模式又称为调停者模式，它是一种对象行为型模式。

#### 中介者模式的优点

* 简化了对象之间的交互
* 将各同事对象解耦
* 减少子类生成

### MediatR

引用 MediatR.Extensions.Microsoft.DependencyInjection 包，然后注册服务。

```cs
// 注入实现了Handler的对象所在的程序集并添加到Ioc容器
services.AddMediatR(typeof(Startup));
```

#### 单播消息传播

单播消息传输，也就是一对一的消息传递，一个消息对应一个消息处理。相关的接口主要为IRequest（抽象单播消息）和IRequestHandler（消息处理）。单播消息可以自定义返回值，也可以没有返回值（`IRequest<Unit>`）。

定义一个根据Id查询学生信息的单播消息，返回类型为StudentInfo，代码如下

```cs
#region StudentInfo.cs
/// <summary>
/// 学生信息
/// </summary>
public class StudentInfo
{
    /// <summary>
    /// Id
    /// </summary>
    public int Id { get; set; }
    /// <summary>
    /// 名字
    /// </summary>
    public string Name { get; set; }
    /// <summary>
    /// 性别 1-男， 2-女
    /// </summary>
    public int Sex { get; set; }
    /// <summary>
    /// 班级
    /// </summary>
    public string ClassName { get; set; }
    /// <summary>
    /// 学号
    /// </summary>
    public string Code { get; set; }
    /// <summary>
    /// 出生年月
    /// </summary>
    public DateTime BirthTime { get; set; }
}
#endregion

#region GetStudentByIdQuery.cs
/// <summary>
/// 查询学生消息类型
/// </summary>
public class GetStudentByIdQuery : IRequest<StudentInfo>
{
    /// <summary>
    /// 学生Id
    /// </summary>
    public int Id { get; set; }
}
#endregion

#region GetStudentByIdQueryHandler.cs
internal class GetStudentByIdQueryHandler : IRequestHandler<GetStudentByIdQuery, StudentInfo>
{
    public async Task<StudentInfo> Handle(GetStudentByIdQuery request, CancellationToken cancellationToken)
    {
        return new StudentInfo { Id = 0 };
    }
}
#endregion
```

#### 多播消息传输

多播消息传输，也就是一对多的消息传递，一个消息对应多个消息处理。相关的接口主要为INotification（抽象多播消息）和INotificationHandler（消息处理）。多播消息传递是无返回值

定义一个推送学生信息变更的多播消息，代码如下

```cs
#region StudentInfoModifyNotify.cs
/// <summary>
/// 查询学生消息类型
/// </summary>
public class StudentInfoModifyNotify : INotification
{
    /// <summary>
    /// 学生Id
    /// </summary>
    public int Id { get; set; }
}
#endregion

#region StudentInfoModifyNotifyHandlerA.cs
internal class GetStudentByIdQueryHandlerA : INotificationHandler<StudentInfoModifyNotify>
{
    public async Task<StudentInfo> Handle(GetStudentByIdQueryHandler notification, CancellationToken cancellationToken)
    {
      Console.WriteLine($"A已接收到学生信息变更通知！");
      return Task.CompletedTask;
    }
}
#endregion

#region StudentInfoModifyNotifyHandlerB.cs
internal class GetStudentByIdQueryHandlerB : INotificationHandler<StudentInfoModifyNotify>
{
    public async Task<StudentInfo> Handle(GetStudentByIdQueryHandler notification, CancellationToken cancellationToken)
    {
      Console.WriteLine($"B已接收到学生信息变更通知！");
      return Task.CompletedTask;
    }
}
#endregion
```

#### Mock MediatR

如何在单元测试中Mock MediatR 返回的数据，在网上已经有很多的写好的例子了。但是他们大部分都是通过控制器构造函数直接使用Mock的MediatR。而我需求是直接把Mock 出来的 MediatR 直接注入到IoC在容器中，在阅读官方文档以后，发现对应注入IMediatR的方法。下面是封装的一个Mock MediatR的方法。

```cs
// <summary>
/// MockMediator 调用方单元测试时可以模拟Mediator返的数据
/// </summary>
public static class Mock
{
    public static IServiceCollection UseMockMediator(this IServiceCollection services)
    {
        // 移除原来的Mediator注入
        var mediator = services.SingleOrDefault(d => d.ServiceType == typeof(IMediator));
        if (mediator != null)
            services.Remove(mediator);
        // Mock Mediator
        var fakeMediator = new Mock<IMediator>();
        fakeMediator.Setup(x => x.Send(It.IsAny<GetStudentByIdQuery>(), It.IsAny<CancellationToken>())).Returns(
            async () =>
                await Task.FromResult(new StudentInfo
                {
                    BirthTime = DateTime.Now,
                    ClassName = "测试班级",
                    Code = "test0001",
                    CreateTime = DateTime.Now.AddDays(-10),
                    Id = 1,
                    Name = "测试学生"
                }));
        // 将MockMediator注入
        services.TryAdd(new ServiceDescriptor(typeof(IMediator), fakeMediator.Object));
        return services;
    }
}
```
