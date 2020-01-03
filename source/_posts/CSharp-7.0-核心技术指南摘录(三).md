---
title: CSharp 7.0 核心技术指南摘录(三)
date: 2019-08-19 23:14:58
categories: C#
tags:
 - C#
 - 摘录
 - 解构器
 - 委托
---
### 解构器

一个解构器就像构造器的反过程:构造器使用若干值作为参数,并且将它们赋值给字段;而解构器则相反将字段反向赋值给若干变量
<!--more-->
解构方法的名字必须为Deconstruct,并且拥有一个或多个out参数

```cs
class Rectangle
{
    public readonly float Width, Height;

    public Rectangle(float width, float height)
    {
        Width = width;
        Height = height;
    }

    public void Deconstruct(out float width, out float height)
    {
        width = Width;
        height = Height;
    }
}
```

调用解造器,语法如下

```cs
var rect = new Rectangle(3 , 4);
(float width, float height) = rect;
```

等价于

```cs
float width, height;
rect.Deconstruct(out width, out height);
// rect.Deconstruct(out var width, out var height);
```

解构调用允许隐式类型推断,可简写为

```cs
(var width, var height) = rect;
// var (width, height) = rect;
```

如果解构中的变量已经定义过了,那么可以忽略类型声明

```cs
float width, height;
(width, height) = rect;
```

### 委托

委托是一种知道如何调用方法的对象
委托类型定义了一个委托实例可以调用的方法,具体来说,它定义了方法的返回类型和参数类型.

```cs
delegate int Transformer(int x);
clasee Test
{
    static void Main()
    {
        Transformer t = Square;
        // Transformer t = new Transformer(Square);
        int result = t(3);
        // int result = t.Invoke(3);
        Console.WriteLine(result);
    }
    static int Square(int x) => x * x;
}
```

委托实例字面上是调用者的代理:调用者调用委托,而委托调用目标方法.这种间接调用方式可以将调用者和目标方法解耦.

#### 用委托书写插件方法

委托变量可以在运行时指定一个目标方法,这个特性可用于编写插件方法,下面的例子中有一个名为Transform的公共方法,它对整数数组的每一个元素进行变换.Transfornm方法接受一个委托参数并以此为插件方法执行变换操作

```cs
public delegate int Transformer (int x);

class Util
{
    public static void Transform(int[] values, Transformer t)
    {
        for(int i = 0; i < values.Lenght; i++)
        {
            values[i] = t(values[i]);
        }
    }
}

class Test
{
    static void Main()
    {
        int[] values = {1, 2, 3};
        Util.Transform(values, Square);
        foreach( int i in values)
        {
            Console.WriteLine(i+" ");
        }
    }

    static int Square(int x) => x * x;
}
```

#### 多播委托

所有的委托实例都拥有多播能力,这意味着一个委托实例可以引用一个目标方法,也可以引用一组目标方法.委托可以使用 + 和 += 联结多个委托实例, - 和 -= 会从左侧委托操作数上将右侧委托数删除.
委托是不可变的,因此调用 += 和 -= 的实质是创建一个新的委托实例,并把它赋值给已有变量.
若方法的执行时间很长,且该方法定时调用一个委托像调用者报告进程的执行情况.例如,在以下代码中,HardWord 方法通过调用 ProgressReporter 委托参数报告执行进度

```cs
public delegate void PeogressReporter (int percentComplete);

public class Util
{
    public static void HardWork (ProgressReporter p)
    {
        for(int i = 0; i < 10; i++)
        {
            p(i * 10);
            System.Threading.Thread.Sleep(100);
        }
    }
}
```

为了监视进度,在Main方法中创建了一个多播委托实例p,这样就可以通过两个独立的方法监视执行进度

```cs
class Test
{
    static void Main()
    {
        ProgressReporter p = WriteProgressToConsole;
        p += WriteProgressToFile;
        Util.HardWork(p);
    }

    static void WriteProgressToConsole(int percentComplete) => Console.WriteLine(percentComplete);

    static void WriteProgressToFile(int percentComplete) => System.IO.File.WriteAllText("process.txt", percentComplete.ToString());
}
```

#### 实例目标方法和静态目标方法

将一个实例方法赋值给委托对象时,后者不但要维护方法的引用,还需要维护方法所属的实例的引用.System.Delegate 类的 Target 属性代表这个实例(如果委托引用的是一个静态方法,则该属性值为null).

```cs
public delegate void ProgressReporter (int percentComplete);

class T
{
    static void Main()
    {
        X x = new X();
        ProgressReporter p = x.InstanceProgress;
        p(99);
        Console.WriteLine(p.Target = x);
        Console.WriteLine(p.Method);
    }
}

class X
{
    public void InstanceProgress(int percentComplete) => Console.WriteLine(percentComplete);
}
```

#### 泛型委托类型

委托类型可以包含泛型类型参数.

```cs
public class Util
{
    public static void Transform<T> (T[] values, Transformer<T> t)
    {
        for(int i = 0; i < values.Lenght; i++)
        {
            values[i] = t(values[i]);
        }
    }
}

class Test
{
    static void Main()
    {
        int[] values = {1, 2, 3};
        Util.Transform(values, Square);
        foreach(int i in values)
        {
            Console.WriteLine(i + " ");
        }
    }

    static int Square(int x) => x * x;
}
```

#### Func 和 Action 委托

有了泛型委托,我们就可以定义出一些非常通用的小型委托类型,它们可以具有任意的返回类型和(合理的)任意数目的参数.它们就是定义在 System 命名空间下的 Func 和 Action 委托

```cs
delegate TResult Func <out TResult> ();
delegate TResult Func <in T, out TResult> (T arg);
delegate TResult Func <in T1, in T2, out TResult> (T1 arg1, T2 arg2);
....

delegate void Action ();
delegate void Action <in T> (T arg);
delegate void Action <in T1, in T2> (T1 arg1, T2 arg2);
...

```

#### 委托和接口

能用委托解决的问题,都可以用接口解决

```cs
public interface ITransformer
{
    int Transform (int x);
}

public class Util
{
    public static void TransformAll (int[] values, ITransformer t)
    {
        for(int i = 0; i < values.Lenght; i++)
        {
            values[i] = t.Transform(values[i]);
        }
    }
}

class Squarer : ITransformer
{
    public int Transform (int x) => x * x;
}

static void Main()
{
    int[] values = { 1, 2, 3};
    Util.TransforAll(values, new Squarer());
    foreach(int i in values)
    {
        Console.WriteLine(i + " ");
    }
}
```

如果以下一个或多个条件成立,委托可能是比接口更好的选择

* 接口内仅定义了一个方法
* 需要多播能力
* 订阅者需要多次实现接口

#### 委托的兼容性

##### 类型的兼容性

即使签名相似,委托类型也互不兼容

```cs
delegate void D1();
delegate void D2();

D1 d1 = Method;
D2 d2 = d1;     //Compile-time error
```

但是允许下面的写法

```cs
D2 d2 = new D2 (d1);
```

如果委托实例指向相同的目标方法,则认为它们是相等的
如果多播委托按照相同的顺序引用相同的方法,则认为它们是相等的

##### 参数的兼容性

当调用方法时,可以给方法的参数提供更加特定的变量类型,这是正常的多态行为.基于同样的原因,委托也可以有比它目标方法参数类型更加具体的参数类型,这称为逆变.

```cs
delegate void StringAction (string s);

class Test
{
    static void Main()
    {
        StringAction sa = new StringAction(ActOnObject);
        sa("hello");
    }

    static void ActOnObject (object o) => Console.WriteLine(o);
}
```

##### 返回类型的兼容性

调用方法时可能得到比请求类型更加特定的返回值类型,这也是正常的多态行为.基于同样的原因,委托的目标方法可能返回比委托声明的返回值类型更加特定的返回值类型,这称为协变.

```cs
delegate object ObjectRetriever();

class Test
{
    static void Main()
    {
        ObjectRetriever o = new ObjectRetriver (RetrieveString);
        object result = o();
        Console.WriteLine(result);
    }

    static string RetrieveString() => "hello";
}
```

##### 泛型委托类型的参数协变

如果我们要定义一个泛型委托类型,那么最好参考如下的准则

* 将只用于返回值类型的类型参数标记为协变(out)
* 将只用于参数的任意类型标记为逆变(in)

这样可以依照类型的继承关系自然地进行类型转换.

```cs
delegate TResult Func<out TResult>();
Func<string> x = ...;
Func<object> y = x;

delegate void Action<in T> (T arg);
Action<object> x = ...;
Action<string> y = x;
```
