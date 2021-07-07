---
title: 使用WebApiClient请求和管理Restful Api
date: 2018-03-10 22:06:47
categories: .Net
tags:
 - .Net
 - Web Api
---
WebApiClient的出现,大幅度减轻了接口调用者的工作量,而且在调用Http接口上还非常容易维护和更新,还可以轻松应付设计不太友好的一些Http接口

使用WebApiClient,编程人员不再需要手动实现路径拼接,参数拼接,请求体组装和响应映射为模型这些繁琐的过程.
<!--more-->

以下为WebApiClient应用到项目中的一般流程

##### 声明http接口的Interface

```cs
[JsonReturn]
public interface IlotRemotePush : IDisposable
{
    /// <summary>
    /// 创建远程推送账号
    /// </summmary>
    /// <param name="auth">授权</param>
    /// <returns></returns>
    [HttpPost("/CreateAccount")]
    ITask<ApiResult<PushAccount>> CreateAccountAsync(lotBasicAuth auth);

     /// <summary>
    /// 获取推送服务信息
    /// </summmary>
    /// <param name="id">pushId</param>
    /// <returns></returns>
    [HttpGet("/GetSevice?id={id}")]
    ITask<ApiResult<MqttService>> GetPushServiceAsync(string id);
}

/// <summary>
/// Api结果接口
/// </summmary>
public interface IApiResult
{
    /// <summary>
    /// 错误码
    /// </summmary>
    ErrorCode Code { get; set; }

    /// <summary>
    /// 相关提示信息
    /// </summmary>
    string Msg { get; set; }
}

/// <summary>
/// 表示Api结果
/// </summmary>
public class ApiResult<T> : IApiReult
{
    /// <summary>
    /// 错误码
    /// </summmary>
    public ErrorCode Code { get; set; }

    /// <summary>
    /// 相关提示信息
    /// </summmary>
    public string Msg { get; set; }

    /// <summary>
    /// 业务数据
    /// </summmary>
    public T Data { get; set; }
}
```

##### 调用http接口

WebApiClient不需要开发者实现接口,使用HttpApiClient.Create方法可以动态创建接口的实现类的实例,调用实例的方法,就完成一个Api的请求

```cs
using (var iotApi = HttpApiClient.Create<IlotRemotePush>())
{
    var auth = new lotBasicAuth(config.AppId, config.AppToken);
    var createResult = await iotApi.CreateAccountAsync(auth);

    if(createResult.Code != ErrorCode.NoError)
    {
        return null;
    }

    config.PushId = createResult.Data.Id;
    config.PushToken = createResult.Data.Token;
    await db.SaveChangesAsync();

    return config;
}
```

##### 异常定义与异常处理

在以上接口中,接口返回的都是ApiResult

```cs
/// <summary>
/// 表示lot异常
/// </summmary>
public class lotException : Exception
{
    /// <summary>
    /// 错误码
    /// </summmary>
    public ErrorCode ErrorCode{ get; private set; }

    /// <summary>
    /// lot异常
    /// </summmary>
    /// <param name="apiResult">api结果值</param>
    public lotException(IApiResult apiResult) : base(apiResult.Msg)
    {
        this.ErrorCode = apiResult.Code;
    }
}
```

还应该在Interface上扩展JsonResult,用于将ApiResult的ErrorCode转换为lotExcetion,并抛出

```cs
/// <summary>
/// 表示lotJson结果
/// </summmary>
public class lotJsonResultAttribute : JsonReturnAttribute
{
    protected override async Task<object> GetTaskResult(ApiActionContext context)
    {
        var apiResult = await base.GetTaskResult(context) as IApiResult;
        if(apiResult != null && apiResult.Code != ErrorCode.NoError)
        {
            throw new lotException(apiResult);
        }
        return apiResult;
    }
}
```

然后将新的lotJsonResultAttribute在Interface上替换JsonReturnAttribute

```cs
[lotJsonResult]public interface IlotRemotePush : IDisposable
{
    ...
}
```

最后,调用http接口的时候,可以使用Handle()扩展方法处理异常

```cs
using(var iotApi = HttpApiClient.Create<IlotRemotePush>())
{
    var auth = new lotBasicAuth(config.AppId, config.AppToken);
    var createResult = await iotApi.CreateAccountAsync(auth).Handle()
    .WhenCatch<lotException>(ex => {
        // process exception
        return default(ApiResult<PushAccount>);
    })
    .WhenCatch<lotException>(ex =>
    {
        // process exception
        return default(ApiResult<PushAccount>);
    });

    if(createResult == null)
    {
        return null;
    }

    config.PushId = createResult.Data.Id;
    config.PushToken = createResult.Data.Token;
    await db.SaveChangesAsync();

    return config;
}
```
