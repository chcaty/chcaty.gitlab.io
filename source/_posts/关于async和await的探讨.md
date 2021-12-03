---
title: 关于async和await的探讨
date: 2021-12-03 11:43:58
categories: 笔记
tags: 
 - 随笔
 - C#
---
### 缘起

最近在看《深入解析C#（第4版）》这本书，看到了第五章，这一章节是关于异步。之前对异步这个概念只能算是一知半解，了解了它的概念和用法，但是对它的实际场景和为了解决什么问题而诞生的是不太清楚的。于是乎，就和小伙伴之间有了一场讨论。
<!--more-->

### 概念

一般来说对方法的调用都是同步执行的。例如在线程执行体内，即线程的调用函数中，方法的调用就是同步执行的。如果方法需要很长的时间来完成，比方说从Internet加载数据的方法，调用者线程将被阻塞直到方法调用完成。这时候为了避免调用者线程被阻塞，这时候就需要用到异步编程了。异步编程可以解决线程因为等待独占式任务而导致的阻塞问题。

### 探索

探索过程中，参考了[《微软官方文档》](https://docs.microsoft.com/zh-cn/dotnet/csharp/programming-guide/concepts/async/)，[《I/O Threads Explained》](https://enterprisecraftsmanship.com/posts/io-threads-explained/)。

#### 例子说明

官方以一个做早餐的例子来解释了什么叫同步，并行和异步。

假设做一个早餐需要完成7个步骤：

1. 倒一杯咖啡。
2. 加热平底锅，然后煎两个鸡蛋。
3. 煎三片培根。
4. 烤两片面包。
5. 在烤面包上加黄油和果酱。
6. 倒一杯橙汁。

__同步执行，是指只有完成上一个任务，才会开始下一个任务；同时将阻塞当前线程执行其他操作，直至任务全部完成。__

代码例子如下：

```cs
// 鉴于我用的是vs2022,可能控制台程序的代码在旧版本的vs上无法直接运行，需要补充对应的main函数
var cup = PourCoffee();
Console.WriteLine("coffee is ready");

var eggs = FryEggs(2);
Console.WriteLine("eggs are ready");

var bacon = FryBacon(3);
Console.WriteLine("bacon is ready");

var toast = ToastBread(2);
ApplyButter(toast);
ApplyJam(toast);
Console.WriteLine("toast is ready");

var oj = PourOJ();
Console.WriteLine("oj is ready");
Console.WriteLine("Breakfast is ready!");

static Juice PourOJ()
{
    Console.WriteLine("Pouring orange juice");
    return new Juice();
}

static void ApplyJam(Toast toast) => 
    Console.WriteLine("Putting jam on the toast");

static void ApplyButter(Toast toast) =>
    Console.WriteLine("Putting butter on the toast");

static Toast ToastBread(int slices)
{
    for (int slice = 0; slice < slices; slice++)
    {
        Console.WriteLine("Putting a slice of bread in the toaster");
    }
    Console.WriteLine("Start toasting...");
    Task.Delay(3000).Wait();
    Console.WriteLine("Remove toast from toaster");
    return new Toast();
}

static Bacon FryBacon(int slices)
{
    Console.WriteLine($"putting {slices} slices of bacon in the pan");
    Console.WriteLine("cooking first side of bacon...");
    Task.Delay(3000).Wait();
    for (int slice = 0; slice < slices; slice++)
    {
        Console.WriteLine("flipping a slice of bacon");
    }
    Console.WriteLine("cooking the second side of bacon...");
    Task.Delay(3000).Wait();
    Console.WriteLine("Put bacon on plate");
    return new Bacon();
}

static Egg FryEggs(int howMany)
{
    Console.WriteLine("Warming the egg pan...");
    Task.Delay(3000).Wait();
    Console.WriteLine($"cracking {howMany} eggs");
    Console.WriteLine("cooking the eggs ...");
    Task.Delay(3000).Wait();
    Console.WriteLine("Put eggs on plate");
    return new Egg();
}

static Coffee PourCoffee()
{
    Console.WriteLine("Pouring coffee");
    return new Coffee();
}

public class Juice { }

public class Bacon { }

public class Egg { }

public class Coffee { }

public class Toast { }
```

同步执行的总耗时是每个任务耗时的总和。此外，因为是同步执行的原因，在开始制作一份早餐的时候，如果此时又有一份制作早餐的请求过来，是不会开始制作的。如果是客户端程序，使用同步执行耗时时间长的操作，会导致UI线程被阻塞，导致UI线程无法响应用户操作，直至操作完成后，UI线程才相应用户的操作。

__异步执行，是指在遇到await的时候，才需要等待异步操作完成，然后往下执行；但是不会阻塞当前线程执行其他操作。__

代码如下

```cs
var cup = PourCoffee();
Console.WriteLine("coffee is ready");

var eggs = await FryEggsAsync(2);
Console.WriteLine("eggs are ready");

var bacon = await FryBaconAsync(3);
Console.WriteLine("bacon is ready");

var toast = await ToastBreadAsync(2);
ApplyButter(toast);
ApplyJam(toast);
Console.WriteLine("toast is ready");

var oj = PourOJ();
Console.WriteLine("oj is ready");
Console.WriteLine("Breakfast is ready!");

static async Task<Toast> ToastBreadAsync(int slices)
{
    for (int slice = 0; slice < slices; slice++)
    {
        Console.WriteLine("Putting a slice of bread in the toaster");
    }
    Console.WriteLine("Start toasting...");
    Task.Delay(3000).Wait();
    Console.WriteLine("Remove toast from toaster");
    return await Task.FromResult(new Toast());
}

static Task<Bacon> FryBaconAsync(int slices)
{
    Console.WriteLine($"putting {slices} slices of bacon in the pan");
    Console.WriteLine("cooking first side of bacon...");
    Task.Delay(3000).Wait();
    for (int slice = 0; slice < slices; slice++)
    {
        Console.WriteLine("flipping a slice of bacon");
    }
    Console.WriteLine("cooking the second side of bacon...");
    Task.Delay(3000).Wait();
    Console.WriteLine("Put bacon on plate");
    return Task.FromResult(new Bacon());
}

static Task<Egg> FryEggsAsync(int howMany)
{
    Console.WriteLine("Warming the egg pan...");
    Task.Delay(3000).Wait();
    Console.WriteLine($"cracking {howMany} eggs");
    Console.WriteLine("cooking the eggs ...");
    Task.Delay(3000).Wait();
    Console.WriteLine("Put eggs on plate");
    return Task.FromResult(new Egg());
}
```
