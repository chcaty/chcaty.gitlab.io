---
title: .Net Core-从零开始搭建框架(一)
date: 2019-02-21 23:27:08
categories: .Net Core
tags:
 - .Net Core
 - Swagger
 - 框架
 - Dapper
---
之前一直想学习一下用Vs Code开发,趁着最近有做一个小项目的想法,顺路学习一下
<!--more-->
#### Vs Code 技巧
##### 推荐的Vs Code插件
1. vscode-solution-explorer //解决方案
2. C#
3. C# Extensions
4. C# XML Documentation Comments //三行注释

##### 常用的命令
1. F1 或 Ctrl+Shift+P: 打开命令面板
2. Ctrl+` 打开命令行
3. Shift+Alt+F 代码格式化
4. Ctrl+B 侧边栏显/隐
5. Ctrl+Shift+E 显示资源管理器
6. Ctrl_Tab 切换文件

##### Vs Code 运行生成XML注释文件
先在对应的项目csproj文件里节点PropertyGroup内添加代码：
``` cs
<GenerateDocumentationFile>true</GenerateDocumentationFile>
<NoWarn>$(NoWarn);1591<Warn>
```

#### 创建项目和集成Swagger
先创建一个空白的解决方案,再往里面添加对应的项目,先添加一个ASP.NET CORE WEBAPI项目,名称为Caty.Core.Api.通过vscode-solution-explorer插件,这一步将十分简单,就像在vs中一样.

##### 引入swagger插件
在终端控制台输入命令:dotnet add YourProjectName.csproj package Swashbuckle.AspNetCore

##### 要增加的引用
1. using System.IO;
2. using Swashbuckle.AspNetCore.Swagger;
3. using System.Reflection;

##### 添加配置和Swagger中间件
1. 打开Startup.cs类，编辑ConfigureServices类
```cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc();

    #region Swagger
    services.AddSwaggerGen(c =>{
        c.SwaggerDoc("v1", new Info{
            Version = "v1.0.0",
            Title = "Core Api",
            Description = "基础框架",
            TermsOfService = "None",
            Contact =new Swashbuckle.AspNetCore.Swagger.Contact{ Name = "Caty", Email = "1120873075@qq.com", Url = "https://chcaty.github.io/" }
        });
        //添加读取注释服务(需在生成时输出xml注释文件)
        var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";  
        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile); 
        c.IncludeXmlComments(xmlPath,true);//true表示显示控制器注释

        //添加header验证信息
        var security  = new Dictionary<string,IEnumerable<string>>{ {"Admin",new string[] {} },};
        c.AddSecurityRequirement(security);
        c.AddSecurityDefinition("Admin",new ApiKeyScheme
        {
            Description =  "JWT授权 参数结构: \"Authorization: Admin {token}\"",
            Name = "Authorization",//默认的参数名
            In = "header",//存放信息的位置(请求头中)
            Type ="apiKey"
        });
    }) ;
    #endregion
}
```

2. 编辑Configure类
```cs
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    else
    {
        app.UseHsts();
    }

    app.UseHttpsRedirection();
    app.UseMvc();

    #region Swagger 
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json","Api Help V1");
    });
    #endregion
}
```

#### 在框架中引入Dapper
在解决方案中添加Business,Service,Entity,Common 四个类库
##### Entity类库创建User实体类
```cs
using System;
namespace Caty.Core.Entity
{
    public class User
    {
        /// <summary>
        /// 用户Id
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// 密码
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// 性别（0女，1男）
        /// </summary>
        public bool Gender { get; set; }

        /// <summary>
        /// 出生年月日
        /// </summary>
        public DateTime Birthday { get; set; }

        /// <summary>
        /// 创建人
        /// </summary>
        public int CreateUserId { get; set; }

        /// <summary>
        /// 创建日期
        /// </summary>
        public DateTime CreateDate { get; set; }

        /// <summary>
        /// 更新人
        /// </summary>
        public int UpdateUserId { get; set; }

        /// <summary>
        /// 更新日期
        /// </summary>
        public DateTime UpdateDate { get; set; }

        /// <summary>
        /// 删除标志
        /// </summary>
        public int IsDeleted { get; set; }
    }
}
```

##### 在Common中设置连接字符串和DbConnection
```cs
using System;
using System.Data;
using System.Data.SqlClient;

namespace Caty.Core.Common
{
    public class DataBaseConfig
    {
        #region SqlServer连接配置
        private static string DefaultSqlConnectionString =  @"Data Source=.;Initial Catalog=Light;User ID=sa;Password=sa;";
        public static IDbConnection GetSqlConnection(string sqlConnectionString = null)
        {
            if(string.IsNullOrWhiteSpace(sqlConnectionString))
            {
                sqlConnectionString = DefaultSqlConnectionString;
            }
            IDbConnection conn = new SqlConnection(sqlConnectionString);
            conn.Open();
            return conn;
        }
        #endregion
    }
}
```

##### 使用泛型针对每一个表定义基本的CRUD接口,然后IUserRepository继承它
定义
```cs
using System;
using System.Collections.Generic;

namespace Caty.Core.Interface
{
    public interface IBaseService<T> where T:class
    {
        /// <summary>
        /// 添加一个实体
        /// </summary>
        /// <param name="entity">实体类型</param>
        /// <param name="connectionString">连接字符串</param>
        /// <returns></returns>
        bool CreateEntity(T entity,string connectionString = null);

        /// <summary>
        /// 根据主键Id获得一个实体
        /// </summary>
        /// <param name="id">主键Id</param>
        /// <param name="connectionString">连接字符串</param>
        /// <returns></returns>
        T RetriveOneEntityById(int id,string connectionString = null);

        /// <summary>
        /// 获得全部实体
        /// </summary>
        /// <param name="connectionString">连接字符串</param>
        /// <returns></returns>
        IEnumerable<T> RetriveAllEntity(string connectionString = null);

        /// <summary>
        /// 修改一个实体
        /// </summary>
        /// <param name="entity">要修改的实体</param>
        /// <param name="connectionString">连接字符串</param>
        /// <returns></returns>
        bool UpdateEntity(T entity,string connectionString = null);

        /// <summary>
        /// 根据主键Id删除一个实体
        /// </summary>
        /// <param name="id"></param>
        /// <param name="connectionString"></param>
        /// <returns></returns>
        bool DeleteEntityById(int id,string connectionString = null);
    }
}
```
继承
```cs
using System;
using Caty.Core.Entity;

namespace Caty.Core.Interface 
{
    public partial  interface IUserService :IBaseService<User>
    {
        
    }
}
```

##### 实现IUserRepository定义的接口
```cs
using System;
using System.Collections.Generic;
using System.Data;
using Caty.Core.Common;
using Caty.Core.Entity;
using Caty.Core.Interface;
using Dapper;

namespace Caty.Core.Implement
{
    /// <summary>
    /// 用户仓储
    /// </summary>
    public class UserService : IUserService
    {
        /// <summary>
        /// 创建一个用户
        /// </summary>
        /// <param name="entity">用户</param>
        /// <param name="connectionString">链接字符串</param>
        /// <returns></returns>
        public bool CreateEntity(User entity, string connectionString = null)
        {
            using (IDbConnection conn = DataBaseConfig.GetSqlConnection(connectionString))
            {
                string insertSql = @"INSERT INTO [dbo].[User]
                                             ([UserName]
                                             ,[Password]
                                             ,[Gender]
                                             ,[Birthday]
                                             ,[CreateUserId]
                                             ,[CreateDate]
                                             ,[UpdateUserId]
                                             ,[UpdateDate]
                                             ,[IsDeleted])
                                       VALUES
                                             (@UserName
                                             ,@Password
                                             ,@Gender
                                             ,@Birthday
                                             ,@CreateUserId
                                             ,@CreateDate
                                             ,@UpdateUserId
                                             ,@UpdateDate
                                             ,@IsDeleted)";
                return conn.Execute(insertSql, entity) > 0;
            }
        }

        /// <summary>
        /// 根据主键Id删除一个用户
        /// </summary>
        /// <param name="id">主键Id</param>
        /// <param name="connectionString">链接字符串</param>
        /// <returns></returns>
        public bool DeleteEntityById(int id, string connectionString = null)
        {
            using (IDbConnection conn = DataBaseConfig.GetSqlConnection(connectionString))
            {
                string deleteSql = @"DELETE FROM [dbo].[User]
                                              WHERE Id = @Id";
                return conn.Execute(deleteSql, new { Id = id }) > 0;
            }
        }

        /// <summary>
        /// 获取所有用户
        /// </summary>
        /// <param name="connectionString">链接字符串</param>
        /// <returns></returns>
        public IEnumerable<User> RetriveAllEntity(string connectionString = null)
        {
            using (IDbConnection conn = DataBaseConfig.GetSqlConnection(connectionString))
            {
                string querySql = @"SELECT [Id]
                                            ,[UserName]
                                            ,[Password]
                                            ,[Gender]
                                            ,[Birthday]
                                            ,[CreateUserId]
                                            ,[CreateDate]
                                            ,[UpdateUserId]
                                            ,[UpdateDate]
                                            ,[IsDeleted]
                                        FROM [dbo].[User]";
                return conn.Query<User>(querySql);
            }
        }

        /// <summary>
        /// 根据主键Id获取一个用户
        /// </summary>
        /// <param name="id">主键Id</param>
        /// <param name="connectionString">链接字符串</param>
        /// <returns></returns>
        public User RetriveOneEntityById(int id, string connectionString = null)
        {
            using (IDbConnection conn = DataBaseConfig.GetSqlConnection(connectionString))
            {
                string querySql = @"SELECT [Id]
                                           ,[UserName]
                                            ,[Password]
                                            ,[Gender]
                                            ,[Birthday]
                                            ,[CreateUserId]
                                            ,[CreateDate]
                                            ,[UpdateUserId]
                                           ,[UpdateDate]
                                           ,[IsDeleted]
                                       FROM [dbo].[User]
                                     WHERE Id = @Id";
                return conn.QueryFirstOrDefault<User>(querySql, new { Id = id });
            }
        }
        /// <summary>
        /// 修改一个用户
        /// </summary>
        /// <param name="entity">要修改的用户</param>
        /// <param name="connectionString">链接字符串</param>
        /// <returns></returns>
        public bool UpdateEntity(User entity, string connectionString = null)
        {
            using (IDbConnection conn = DataBaseConfig.GetSqlConnection(connectionString))
            {
                string updateSql = @"UPDATE [dbo].[User]
                                    SET [UserName] = @UserName
                                    ,[Password] = @Password
                                    ,[Gender] = @Gender
                                    ,[Birthday] = @Birthday
                                    ,[UpdateUserId] = @UpdateUserId
                                    ,[UpdateDate] = @UpdateDate
                                    ,[IsDeleted] = @IsDeleted
                                    WHERE Id = @Id";
                return conn.Execute(updateSql, entity) > 0;
            }
        }
    }
}
```
未完待续....