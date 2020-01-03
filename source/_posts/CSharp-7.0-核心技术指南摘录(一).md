---
title: 'C# 7.0 核心技术指南摘录(一)'
date: 2019-08-15 22:56:12
categories: C#
tags:
 - C#
 - 摘录
---
### C# 7.0 新特性

1. 数字字面量的改进
    C# 7 中,数字字面量可以使用下划线来改善可读性,它们称为数字分隔符而被编译器忽略.

    ```cs
        int Max = 1_000_000;
    ```
    <!--more-->

2. 输出变量及参数忽略
    C# 7 中,调用含有out参数的方法将更加容易.首先,可以非常自然地声明输出变量.

    ```cs
    bool successful = int.TryParse("123",out int result);
    Console.WriteLine(result);
    ```

    当调用含有多个out参数的方法时,可以使用下划线字符忽略你并不关心的参数.

    ```cs
    SomBigMethod(out _, out _, out int x, out _, out _);
    Console.WriteLine(x);
    ```

3. 模式
    is 运算符也可以自然地引入变量了,称为模式变量.

    ```cs
    void Foo(object o)
    {
        if(x is string s)
        {
            Console.WriteLine(s.Lenght);
        }
    }
    ```

    switch 语句同样支持模式,因此我们不仅可以选择常量还可以选择类型;可以使用 when 子句来指定一个判断条件;或是直接选择 null;

    ```cs
    switch(x)
    {
        case int i:
            Console.WriteLine("It's an int!");
            break;
        case string s:
            Console.WriteLine(s.Length);
            break;
        case bool b when b == true:
            Console.WriteLine("True");
            break;
        case null:
            Console.WriteLine("Nothing");
            break;
    }
    ```

4. 局部方法
    局部方法是声明在其他函数内部的方法

    ```cs
    void WriteCubs()
    {
        Console.WriteLine(Cube(3));
        Console.WriteLine(Cube(4));
        Console.WriteLine(Cube(5));

        int Cube(int value) => value * value * value;
    }
    ```

    局部方法仅仅在其包含函数内可见,它们可以像 Lambda 表达式那样捕获局部变量.

5. 更多的表达式体成员
    C# 6 引入了以 "胖箭头" 语法表示的表达式体的方法、只读属性、运算符以及索引器.而 C# 7 更将其扩展到了构造函数、读/写属性和终结器中.

    ```cs
    public class Person
    {
        string name;
        public Person(string name) => Name = name;
        public string Name
        {
            get => name;
            set => name = value ?? "";
        }

        ~Person() => Console.WriteLine("finalize");
    }
    ```

6. 解构器
    C# 7 引入了解构器模式,构造器一般接受一系列值(作为参数)并将其赋值给字段,而解构器则正相反,它将字段反向赋值给变量.以下示例为Person类书写了一个解构器(不包含异常处理)

    ```cs
    public void Deconstruct(out string firstName, out string lastName)
    {
        int spacePos = name.IndexOf(' ');
        firstName = name.Substring(0,spacePos);
        lastName = name.Substring(spacePos + 1);
    }
    ```

    解构器以特定的语法进行调用

    ```cs
    var joe = new Person("Joe Bolgs");
    var (first, last) = joe;
    Console.WriteLine(first);
    Console.WriteLine(last);
    ```

7. 元组
    也许对于 C# 7 来说最值得一提的改进当属显式的元组(tuple)支持
    元组提供了一种存储一系列相关值的简单方式

    ```cs
    var bob = ("Bob", 23);
    Console.WriteLine(bob.Item1);
    Console.WriteLine(bob.Item2);
    ```

    C# 的新元组实质上时使用System.ValueTuple<...> 泛型结构的语法糖.多亏了编译器的"魔力",我们还可以对元组的元素进行命名

    ```cs
    var tuple = (Name:"Bob" , Age:23);
    Console.WriteLine(tuple.Name);
    Console.WriteLine(tuple.Age);
    ```

    有了元组,函数也不必通过一系列 out 参数来返回多个值了

    ```cs
    static (int row, int column) GetFilePosition() => (3,10);

    static void Main()
    {
        var pos = GetFilePosition();
        Console.WriteLine(pos.row);
        Console.WriteLine(pos.column);
    }
    ```

    元组隐式地支持解构模式,因此很容易解构为若干独立的变量.因此,上述 Main 方法中的 GetFilePosition 返回的元组将存储于两个局部变量 row 和 column 中

    ```cs
    static void Main()
    {
        (row, column) = GetFilePosition();
        Console.WriteLine(row);
        Console.WriteLine(column);
    }
    ```

8. throw 表达式
    在 C# 7 之前,throw 一直是一个语句.现在,它也可以作为表达式出现在表达式体函数中

    ```cs
    public string Foo() => throw new NotImplementedException();
    ```

    throw 表达式也可以出现在三无判断运算符中

    ```cs
    string Capitalize(string value) => value == null ? throw new ArgumentException("value") : value == "" ? "" : char.ToUpper(value[0]) + value.Substring(1);
    ```
