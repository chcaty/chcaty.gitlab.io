---
title: Asp.Net Core WebSocket
date: 2018-03-20 21:26:28
categories: .Net Core
tags:
 - .Net Core
 - WebSocket
---
##### WebSocket是什么
WebSocket 是一种在单个TCP连接上进行全双工通讯的协议,是建立在TCP上,且独立的协议.在WebSocket API中,浏览器和服务器只需要完成一次握手,两者之间就可以进行持久性的连接,并进行双向数据传输.
为了建立WebSocket连接,浏览器通过Http1.1协议的101StatusCode进行握手
<!--more-->
##### 在Asp.Net Core中使用WebSocket
```cs
// Configure function
/// Summary
//这里主要是监听WebSocket的请求,然后Invoke Echo 方法进行相关操作.比如,它接收到浏览器请求发来WebSocket的Close命令了.那么在Echo方法直接进行相关的操作
/// Summary
app.Use(async (context, next) => 
{
    if(context.Request.Path == "/ws")
    {
        if(context.WebSockets.IsWebSocketRequest)
        {
            WebSocket webSocket = await context.WebSockets.AcceptAsync();
            await Echo(context, WebSocket);
        }
        else
        {
            context.Response.StatusCode = 400;
        }
    }
});

// Echo function
private async Task Echo(HttpContext context, WebSocket webSocket)
{
    var buffer = new byte[1024 * 4];

    WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
    while(!result.CloseStatus.HasValue)
    {
        await webSocket.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), result.MessageType, result.EndOfMessage, CancellationToken.None);

        result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
    }
    await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationTaken.None);
}

// 修改Echo方法中Send方法的buffer修改,设定想要的回馈
var abuffer = Encoding.ASCII.GetBytes("Hola, This is robert from cnblogs");
await webSocket.SendAsync(new ArraySegment<byte>(abuffer, 0, abuffer.Length), result.MessageType, result.EndOfMessage, CancellationToken.None);
result = await webSocket.ReceiveAsync(new ArraySegment<byte>(abuffer), CancellationToken.None);
```
