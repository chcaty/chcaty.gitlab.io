---
title: CSharp 7.0 核心技术指南摘录(四)
date: 2019-08-26 23:14:58
categories: C#
tags:
 - C#
 - 摘录
 - 异常类型
 - 重载运算符
---
### 常用的异常类型

以下所列出的异常类型在 CLR 和 .NET Framework 中广泛使用,可以在程序中抛出这些异常或将其作为基类型来派生自定义的异常类型

* System.ArgumentException

    当使用不恰当的函数参数调用函数时抛出.这通常表明应用程序有缺陷

* System.ArgumentNullException

    ArgumentException 的子类.它在函数的参数(意外的)为null时抛出

* System.ArgumentOutOfRangeException

    ArgumentException 的子类.当(通常是数字)参数太大或者太小的时候抛出.例如:当向只能接受正数的函数传递负数时抛出.

* System.InvalidOperationException

    当不论参数值如何,对象的状态无法使方法成功执行的时候抛出.例如:读取未打开的文件或在列表对象已修改的情况下用枚举器访问其下一个元素.

* System.NotSupportedException

    该异常抛出表示不支持特定的功能.例如:在一个 IsReadOnly 为 true 的集合上调用 Add 方法.

* System.NotImplementedException

    表示特定的函数还没有实现

* System.ObjectDisposedException

    当函数调用的对象已被销毁时抛出

* NullReferenceException

    当一个对象的值为null而访问其成员时抛出
<!--more-->

### 运算符函数

运算符是通过声明运算符函数进行重载的.运算符函数具有以下规则

* 函数名为 operator 关键字跟上运算符符号

* 运算符函数必须是 static 和 public 的

* 运算符函数的参数即操作数

* 运算符函数的返回类型表示表达式的结果

* 运算符函数电费操作数中至少有一个类型和声明运算符函数的类型是一致的

在以下例子中,我们用名为 Note 的结构体表示音符,并重载其 + 运算符

```cs
public struct Note
{
    int value;
    public Note (int semitonesFromA)
    {
        value = semitonesFromA;
    }
    public static Note operator + (Note x, int semitones)
    {
        return new Note(x.value + semitones);
    }
    // public static Note operator + (Note x, int semitones) => new Note (x.value + semitones);
}
```

这个重载令 Note 可以和 int 相加

```cs
Note B = new Note(2);
Note CSharp = B + 2;
```

重载运算符会自动支持相应的复合赋值运算符.在上例中,因为我们重载了 + 号,所以自然就可以使用 += 了

```cs
CSharp += 2;
```

### 重载等号和比较运算符

通常在我们使用结构体(或类,但不常见)时需要重载等号和比较运算符.重载等号和比较运算符有一些特殊的规则和要求,总结如下:

* 成对重载: C# 编译器要求逻辑上成对的运算符必须同时定义.这些运算符包括(==,!=),(<,>)和(<=,>=)

* Equals 和 GetHashCode: 在大多数情况下,如果重载了(==)和(!=)运算符,则通常也需要重载 object 中定义的 Equals 和 GetHashCode 方法.使之具有合理的行为.如果没有按要求重载,则 C# 编译器会发出警告

* IComparable 和 IComparable< T >: 如果重载了(<,>) 和 (<=,>=) 运算符,那么还应当实现 IComparable 和 IComparable< T > 接口

### 自定义隐式和自定义显式

隐式和显式转换也是可以重载的运算符.这些转换经过重载后,一般能使强相关的类型(例如数字)之间的转换变得更加简明自然.

如果要在弱相关的类型之间进行转换,则更适合采用以下方式

* 编写一个以转换类型为参数的构造器

* 编写(静态的)ToXXX 和 FromXXX 方法进行类型转换

在以下例子中,我们定义了 Note 类型和 double 之类的转换规则

```cs
public static implicit operator double (Note x) => 440 * Math.Pow(2, (double) x.value / 12);

public static explicit operator Note(double x) => new Note((int) (0.5 + 12 * Math.Log(x/440) / Math.Log(2)));

Note n = (Note) 554.37;
double x = n;
```

> PS: as 和 is 运算符会忽略自定义转换

### 重载 true 和 false

true 和 false 运算符只会在那些本身有布尔语义但无法转换为 bool 的类型中重载.例如,一个类型实现了三个状态逻辑,通过重载 true 和 false 运算符,这个类型就可以无缝地和以下条件语句以及运算符一起使用了: if, do, while, for, &&, || 和 ?:.System.Data.SqlTypes.SqlBoolean 结构体就提供了这个功能.

```cs
SqlBoolean a = SqlBoolean.Null;
if(a)
{
    Console.WriteLine("True");
} 
else if (!a)
{
    Console.WriteLine("False");
}
else
{
    Console.WriteLine("Null");
}
// 输出为Null
```

下面代码重新实现了 SqlBoolean 中关于 true 和 false运算符的一部分代码

```cs
public struct SqlBoolean
{
    public static bool operator true (SqlBoolean x) => x.m_value == True.m_value;
    public static bool operator false (SqlBoolean x) => x.m_value == False.m_value;

    public static SqlBoolean operator ! (SqlBoolean x)
    {
        if(x.m_value == Null.m_value) return Null;
        if(x.m_value == False.m_value) return True;
        return False;
    }

    public static readonly SqlBoolean Null = new SqlBoolean(0);
    public static readonly SqlBoolean False = new SqlBoolean(1);
    public static readonly SqlBoolean True = new SqlBoolean(2);

    private SqlBoolean (byte value)
    {
        m_value = value;
    }
    private byte m_value;
}
```
