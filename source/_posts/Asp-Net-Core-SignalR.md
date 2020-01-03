---
title: Asp.Net Core SignalR
date: 2019-07-29 21:55:26
categories: .Net Core
tags:
 - .Net Core
 - SignalR
---
SignalR 是一套能让Asp.Net Core 轻松实现与Client即时互动的套件.
<!--more-->

#### 引用

在nuget中安装 Microsoft.AspNetCore.SignalR.Core

#### 注册SignalR服务

在Startup.CofigureServices 加入SignalR的服务,同时在Startup.Configure将SignalR加到管道中.

*Startup.cs*

```cs
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace SignalRChat.Hubs
{
    public class ChatHub:Hub
    {
        private string Now => DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        public override async Task OnConnectedAsync()
        {
            await Clients.All.SendAsync("ReceiveMessage", "系统",$"[{Now}]{Context.ConnectionId} 加入");
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Clients.All.SendAsync("ReceiveMessage", "系统", $"[{Now}]{Context.ConnectionId} 离开");
        }

        public async Task SendMessage(string user,string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
```

#### SignalR Client

##### 添加 SignalR 客户端库

* 在“解决方案资源管理器”中，右键单击项目，然后选择“添加” > “客户端库”

* 在“添加客户端库”对话框中，对于“提供程序”，选择“unpkg”

* 对于“库”，输入 `@aspnet/signalr@1`，然后选择不是预览版的最新版本

* 选择“选择特定文件”，展开“dist/browser”文件夹，然后选择“signalr.js”和“signalr.min.js”

* 将“目标位置”设置为 wwwroot/lib/signalr/，然后选择“安装”

*chat.js*

```cs
"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.start().then(function(){
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});
```

*Index.cshtml*

```cs
@page
<div class="container">
    <div class="row">&nbsp;</div>
    <div class="row">
        <div class="col-6">&nbsp;</div>
        <div class="col-6">
            用户...<input type="text" id="userInput" />
            <br />
            消息...<input type="text" id="messageInput" />
            <input type="button" id="sendButton" value="发送信息" />
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <hr />
        </div>
    </div>
    <div class="row">
        <div class="col-6">&nbsp;</div>
        <div class="col-6">
            <ul id="messagesList"></ul>
        </div>
    </div>
</div>

<script src="~/lib/signalr/dist/browser/signalr.js"></script>
<script src="~/js/chat.js"></script>
```
