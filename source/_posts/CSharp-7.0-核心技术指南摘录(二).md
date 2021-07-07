---
title: 'C# 7.0 核心技术指南摘录(二)'
date: 2019-08-16 22:05:55
categories: C#
tags:
 - C#
 - 摘录
---
### C# 6.0 新特性

1. null 条件运算符
    可以避免在调用方法或访问类型的成员之前显式地编写用于null判断的语句.在以下示例中,result将会为null而不会抛出 NullReferenceException.

    ```cs
    StringBuilder sb = null;
    string result = sb?.ToString();
    ```
    <!--more-->
2. 表达式体函数
    可以以 Lambda 表达式的形式书写仅仅包含一个表达式的方法、属性、运算符以及索引器,使得代码更加简短.

    ```cs
    public int TimesTwo(int x) => x*2;
    public string SomeProperty => "Property value";
    ```

3. 属性初始化器
    可以对自动属性进行初始赋值.

    ```cs
    public DataTime TimeCreated { get; set; } = DateTime.Now;
    public DateTime TimeEnd { get; } = DateTime.Now;
    ```

4. 索引初始化器
    可以一次性初始化具有索引器的任何类型.

    ```cs
    var dict = new Dictionary<int,string>()
    {
        [3] = "three",
        [10] = "ten"
    };
    ```

5. 字符串插值
    用更加简单的方式替代了string.Format

    ```cs
    string s = $"It is {DateTime.Now.DayOfWeek} today";
    ```

6. 异常过滤器
    可以在 catch 块上再添加一个条件

    ```cs
    string html;
    try
    {
        html = new WebClient().DownloadString("http://asef");
    }
    catch(WebException ex) when (ex.Status == WedExceptionStatus.Timeout)
    {
        ...
    }
    ```

7. using static
    using static 指令可以引入一个类型的所有静态成员,这样就可以不用书写;类型而直接使用这些成员

    ```cs
    using static System.Console;

    WriteLine("Hello world");
    ```

8. nameof
    nameof 运算符返回变量、类型或者其他符号的名称

    ```cs
    int capacity = 123;
    string x = nameof(capacity);
    string y = nameof(Uri.Host);
    ```

9. 可以在 catch 和 finally 块中使用 await.

### C# 5.0 新特性

C# 5.0 最大的新特性就是通过两个关键字, async 和 await 支持异步功能.异步功能支持异步延续,从而简化响应式和线程安全的富客户端应用程序的编写.它还有利于编写高并发和高效的 I/O 密集型应用程序,而不需要为每一个操作绑定一个线程资源

#### C# 4.0 新特性

1. 动态绑定
    将绑定过程(解析类型与成员的过程)从编译时推迟到运行时.这种方法适用于一些需要避免使用复杂反射代码的场合.动态绑定还适合于实现动态语言以及 COM 组件的互操作

2. 可选参数和命名参数
    可选参数允许函数指定参数的默认值,这样调用者就可以省略一些参数,而命名参数则允许调用者按名字而非按位置指定参数

3. 用泛型接口和委托实现类型变化
    类型变化规则在 C# 4.0 进行了一定程度的放宽,因此泛型接口和泛型委托类型参数可以标记为协变或逆变,从而支持更加自然的类型转换.

4. 改进 COM 互操作性
    参数可以通过引用传递,并无须使用 ref 关键字(特别适用于与可选参数一同使用)
    包含 COM 互操作类型的程序集可以链接而无须引用.链接的互操作类型支持类型相等转换,无须使用主互操作程序集,并且解决了版本控制和部署的难题
    链接的互操作类型中的函数若返回 COM 变体类型,则会映射为 dynamic 而不是 object ,因此无须进行强制类型转换.

### C# 3.0 新特性

1. LINQ
    LINQ 令 C# 程序可以直接编写查询并以静态方式检查其正确性,它可以查询本地集合(如列表或XML文档),也可以查询远程数据源(如数据库).

2. 隐式类型局部变量
    隐式类型局部变量允许在声明语句中省略变量类型,然后由编辑器推断其类型.这样可以简化代码并支持匿名类型.匿名类型是一些即时创建的类,它们常用于生成 LINQ 查询的最终输出结果.数组也可以隐式类型话.

3. 对象初始化器
    允许在调用构造器之后以内联的方式设置属性,从而简化对象的构造过程.对象初始化器不仅支持命名类型也支持匿名类型.

4. Lambda 表达式
    由编译器即时创建的微型函数,适用于创建"流畅的" LINQ 查询

5. 扩展方法
    可以在不修改类型定义的情况下使用新的方法扩展先用类型,使静态方法变得像实例方法一样.LINQ表达式的查询符就是使用扩展方法实现的.

6. 查询表达式
    提供了编写 LINQ 查询的更高级语法,大大简化了具有多个序列或范围变量的 LINQ 查询的编写过程

7. 表达式树
    是赋值给一种特殊类型 Expression`<TDelegate>` 的 Lambda 表达式的 DOM 模型.表达式树使 LINQ 查询能够远程执行,因为它们可以在运行时进行转换和翻译

8. 自动化属性
    自动化属性对在 get/set 中对私有字段直接读写的属性进行了简化,并将字段的读写逻辑交给编译器自动生成

9. 分部方法
    分部方法可以令自动生成的分部类自定义需要手动实现的钩子函数,而该函数可以在没有使用的情况下"消失"
