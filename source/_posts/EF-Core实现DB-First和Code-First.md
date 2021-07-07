---
title: EF Core实现DB First和Code First
date: 2018-06-10 21:38:41
categories: .Net Core
tags: 
 - .Net Core
 - EF Core
---

##### 安装 Entity Framework Core

```cs
// MsSql
Install-Package Microsoft.EntityFrameworkCore.SqlServer
// 柚子的MySql
Install-Package Pomelo.EntityFrameworkCore.MySql
// 官方的MySql
Install-Package MySql.Data.EntityFrameworkCore
// 程序包管理器控制台
Install-Package Microsoft.EntityFrameworkCore.Tools
// 安装设计包
Install-Package Microsoft.EntityFrameworkCore.Design
// 数据库提供程序设计包(EF Core 2.0不再需要)
// MsSql
Install-Package Microsoft.EntityFrameworkCore.SqlServer.Design
// MySql
Install-Package Pomelo.EntityFrameworkCore.MySql.Design
```

<!--more-->

##### DB First -- 从现有数据库创建模型

```cs
// MsSql
Scaffold-DbContext -Connection "Server=localhost;User Id=root;Password=123456;Database=vanfj" -Provider "Microsoft.EntityFrameworkCore.SqlServer" -OutputDir "Models"
// MySql
Scaffold-DbContext -Connection "Server=localhost;User Id=root;Password=123456;Database=vanfj" -Provider "Pomelo.EntityFrameworkCore.MySql" -OutputDir "Models"
// 将Connection中的连接字符串替换为自己的数据库连接，将OutputDir中的Models替换为自己要生成的文件目录名
```

##### CodeFirst -- 从模型生成到数据库

###### 创建上下文

IRSContext.cs

```cs
public class IRSContext:DbContext
{
    public IRSContext(DbContextOptions options) : base(options) { }

    public DbSet<Role> Roles { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().ToTable("User");
        modelBuilder.Entity<Role>().ToTable("Role");
    }
}
```

User.cs

```cs
public class User
{
    public int UserId { get; set; }
    public string UserCode { get; set; }
    public string UserPwd { get; set; }
    public string UserName { get; set; }
}
```

Role.cs

```cs
public class Role
{
    public int RoleId { get; set; }
    public string RoleName { get; set; }
    public string RoleDecs { get; set; }
}
```

####### 注入上下文

Startup.cs

```cs
public void ConfigureServices(IServiceCollection services)
{
    //AddDbContext注入方式 
    var connection = Configuration.GetConnectionString("SqlServer");
    services.AddDbContext<IRSContext>(options => options.UseSqlServer(connection, b => b.UseRowNumberForPaging()));
    services.AddScoped<DbContext, IRSContext>();
    services.AddMvc();

    //AddDbContextPool注入方式
    services.AddDbContextPool<IRSContext>(options => options.UseSqlServer(Configuration.GetConnectionString("SqlServer")));
    services.AddMvc().AddJsonOptions(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
}
```

###### appsettings.json连接字符串

```cs
{
    "ConnectionStrings": 
    {
        "SqlServer": "Data Source=.;Initial Catalog=IRSDb;User Id=sa;Password=123;"
    },
}
```

##### 执行NuGet命令, 创建数据库

```cs
// 第一次执行初始化
Add-Migration InitialCreate
// 添加一个迁移数据库 迁移的名称 目录（及其子命名空间）路径是相对于项目目录。 默认值为"Migrations"。
Add-Migration -Name <String> -OutputDir <String>
// 删除上次的迁移数据库 不检查以查看迁移是否已应用到数据库。
Remove-Migration -Force
// 目标迁移。 如果为"0"，将恢复所有迁移。 默认到最后一个迁移。
Update-Database 
Update-Database LastGoodMigration //还原迁移
// 删除数据库 显示的数据库会被丢弃，但没有删除它
Drop-Database -WhatIf
// 获取有关 DbContext 类型的信息
Get-DbContext 
// 从数据库更新DbContext和实体的类型
Scaffold-DbContext 
-Connection <String> // 数据库的连接字符串。
-Provider <String> // 要使用的提供程序。 （例如 Microsoft.EntityFrameworkCore.SqlServer)
-OutputDir <String > // 要将文件放入的目录。 路径是相对于项目目录。
--Context <String > // 若要生成的 dbcontext 名称。
-Schemas <String[]> // 要生成实体类型的表架构。
-Tables <String[]> // 要生成实体类型的表。
-DataAnnotations // 使用属性来配置该模型 （如果可能）。 如果省略，则使用仅 fluent API。
-UseDatabaseNames // 使用直接从数据库表和列名称。
-Force // 覆盖现有文件。

// 从迁移中生成的 SQL 脚本
Script-Migration
-From <String> // 开始迁移。 默认值为 0 （初始数据库）
-To <String> // 结束的迁移。 默认到最后一个迁移
-Idempotent // 生成可以在任何迁移的数据库使用的脚本
-Output <String> // 要将结果写入的文件
```
