---
title: Wcf创建Http和Webservice接口
date: 2018-03-09 23:37:05
categories: .Net
tags: 
 - WCF
 - .Net
---
不需要部署在iis上，直接打开exe程序即可开启接口。
同时支持创建一个支持http请求和Webservice接口的wcf服务
<!--more-->

##### Http请求
设置了兼容性，不用继承接口，在一个类里可以完成url和参数的设置
###### HttpInterface.cs
```cs
    /// <summary>
    /// http://127.0.0.1:8880
    /// </summary>
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    [ServiceContract]
    public class HttpInterface
    { 
        /// <summary>
        /// 测试接口
        /// 调用示例 http://127.0.0.1:8880/wcfapp/TestHttp?test1=测试
        /// </summary>
        /// <param name="idCardNo"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "*",
        UriTemplate = "wcfapp/testhttp?test1={test1}",
        RequestFormat = WebMessageFormat.Json,
        ResponseFormat = WebMessageFormat.Xml,
        BodyStyle = WebMessageBodyStyle.Bare)]
        public string TestHttp (string test1)
        {
            return string.Format("HTTP返回测试内容 = {0}",test1);
        } 
    }
```

##### WebService
调用接口时注意，方法名= 类名
###### WSInterface.cs
```cs
    /// <summary>
    /// http://127.0.0.1:8881/wstest?wsdl
    /// </summary>
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    [ServiceContract]
    public class WSInterface
    { 

        [OperationContract]
        public string TestWS(string test1)
        {
            return string.Format("Webservice返回测试内容 = {0}", test1);
        }
    }
```

##### 使用
###### Program.cs
```cs
class Program
    {
        static void Main(string[] args)
        {
            try
            {
                Console.Title = "同时支持http和Webservice交互的服务";  

                //可以突出重点输出内容
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("WCF服务正在初始化.....");
                Console.ForegroundColor = ConsoleColor.Gray;
       

                #region 支持Post和Get
                Console.WriteLine("======================================");
                String HttpUrl = "http://127.0.0.1:8880";
                Uri address = new Uri(HttpUrl);
                WebServiceHost http_host = new WebServiceHost(typeof(HttpInterface), address);  //绑定处理的类
                http_host.Description.Behaviors.Add(new ServiceMetadataBehavior() { HttpGetEnabled = true });
                http_host.Open();
                Console.WriteLine("Http请求URL--->" + HttpUrl);
                #endregion

                #region 支持Webservice
                String WsUrl = "http://127.0.0.1:8881/wstest";
                address = new Uri(WsUrl);
                ServiceHost webservice_host = new ServiceHost(typeof(WSInterface), address); //绑定处理的类
                webservice_host.Description.Behaviors.Add(new ServiceMetadataBehavior() { HttpGetEnabled = true });

                //=======设置最大连接数
                ServiceThrottlingBehavior behavior = new ServiceThrottlingBehavior();
                behavior.MaxConcurrentCalls = 2147483647;
                behavior.MaxConcurrentInstances = 2147483647;
                behavior.MaxConcurrentSessions = 2147483647;
                webservice_host.Description.Behaviors.Add(behavior);
                Console.WriteLine("Webservice请求URL--->" + WsUrl);
                webservice_host.Open(); 
                #endregion 

                Console.WriteLine("WCF服务启动成功!");

                while (true)
                {
                    Console.ReadKey(false);
                }

            }
            catch (Exception qq)
            {
                Console.WriteLine(qq.Message);
                Console.WriteLine("WCF服务启动失败!");
                Console.Read();
            }
        }
    }
```

