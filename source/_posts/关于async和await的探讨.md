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
MakeBreakfast();

static void MakeBreakfast()
{
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
}

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

![执行耗时](https://pic.chcaty.cn/%E5%90%8C%E6%AD%A5%E6%89%A7%E8%A1%8C.png)

同步执行的总耗时是每个任务耗时的总和。此外，因为是同步执行的原因，在开始制作一份早餐的时候，如果此时又有一份制作早餐的请求过来，是不会开始制作的。如果是客户端程序，使用同步执行耗时时间长的操作，会导致UI线程被阻塞，导致UI线程无法响应用户操作，直至操作完成后，UI线程才相应用户的操作。

__异步执行，是指在遇到await的时候，才需要等待异步操作完成，然后往下执行；但是不会阻塞当前线程执行其他操作。__

代码如下

```cs
await MakeBreakfastAsync();

static async Task MakeBreakfastAsync()
{
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
}

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
![执行耗时](https://pic.chcaty.cn/%E7%AE%80%E5%8D%95%E7%9A%84%E5%BC%82%E6%AD%A5%E6%89%A7%E8%A1%8C.png)

上面代码只是为了避免堵塞当前的线程，并没有真正用上异步执行的某些关键功能，所以在耗时上是相差不远的；但是这时候如果在接受了一份制作早餐的请求，还未完成的时候，又有一份制作早餐的请求过来，是可能会开始制作另一份早餐的。

__改善后的异步执行__

代码如下

```cs
await MakeBreakfastBetterAsync();

static async Task MakeBreakfastBetterAsync()
{
    Coffee cup = PourCoffee();
    Console.WriteLine("Coffee is ready");

    Task<Egg> eggsTask = FryEggsAsync(2);
    Task<Bacon> baconTask = FryBaconAsync(3);
    Task<Toast> toastTask = ToastBreadAsync(2);

    Toast toast = await toastTask;
    ApplyButter(toast);
    ApplyJam(toast);
    Console.WriteLine("Toast is ready");
    Juice oj = PourOJ();
    Console.WriteLine("Oj is ready");

    Egg eggs = await eggsTask;
    Console.WriteLine("Eggs are ready");
    Bacon bacon = await baconTask;
    Console.WriteLine("Bacon is ready");

    Console.WriteLine("Breakfast is ready!");
}
````

异步方法的逻辑没有改变，只是调整了一下代码的执行顺序，一开始就调用了三个异步方法，只是在await语句后置了，而不是上面那段代码一样，执行了就在那里等待任务完成，而是会去进行其他的后续操作，直至后续操作需要用到前面任务执行结果的时候，才去获取对应的执行结果，如果没有执行完成就等待执行完成才继续后续的操作。

>异步执行并不总是需要另一个线程来执行新任务。并行编程是异步执行的一个子集。

__并行编程，调用多个线程，同时去执行任务__

例如：需要制作五份早餐，同步和异步的方法都是需要循环调用相应的MakeBreakfast方法和MakeBreakfastBetterAsync方法五次才能制作完成。而并行编程，也就是多线程，可以一次性创建五个线程，分别制作一份早餐，从而大大缩短了所需要的时间。

代码如下

```cs
DateTime beforeDT = DateTime.Now;
for (int i = 0; i < 5; i++)
{
    MakeBreakfast();
}
DateTime afterDT = DateTime.Now;
TimeSpan ts = afterDT.Subtract(beforeDT);
Console.WriteLine($"同步执行程序耗时: {ts.TotalMilliseconds}ms");

beforeDT = DateTime.Now;
for (int i = 0; i < 5; i++)
{
    await MakeBreakfastBetterAsync();
}
afterDT = DateTime.Now;
ts = afterDT.Subtract(beforeDT);
Console.WriteLine($"异步执行程序耗时: {ts.TotalMilliseconds}ms");

beforeDT = DateTime.Now;
await MakeBreakfastBetterMultiTask();
afterDT = DateTime.Now;
ts = afterDT.Subtract(beforeDT);
Console.WriteLine($"并行编程程序耗时: {ts.TotalMilliseconds}ms");

static async Task MakeBreakfastBetterMultiTask()
{
    Task[] tasks = new Task[5];
    for (int i = 0; i < 5; i++)
    {
        tasks[i] = new Task((parameter) => MakeBreakfastBetterAsync().Wait(), "aaa");
        tasks[i].Start();
    }
    Task.WaitAll(tasks);
}
```

运行耗时结果如下

![同步运行耗时](https://pic.chcaty.cn/%E5%90%8C%E6%AD%A5%E8%BF%90%E8%A1%8C%E8%80%97%E6%97%B6.png)

![异步运行耗时](https://pic.chcaty.cn/%E5%BC%82%E6%AD%A5%E8%BF%90%E8%A1%8C%E8%80%97%E6%97%B6.png)

![并行运行耗时](https://pic.chcaty.cn/%E5%B9%B6%E8%A1%8C%E8%BF%90%E8%A1%8C%E8%80%97%E6%97%B6.png)

相比之下，显然能看出来之间的运行耗时差别还是有点大的。

### 一个通俗的例子

程序就像一个餐馆，线程就像餐馆里面已有的厨师，CPU就是调度厨师的厨师长，假设餐馆开业了，厨师长只带了5个厨师，餐馆接到的订单有8份，同步执行就是5个厨师分别处理5个订单后，这期间，他们会专心的去完成订单的菜，而无视其他的事情，直到完成订单，厨师长才会分配新的订单给他们；异步执行则是5个厨师在处理5个订单的期间，如果厨师长发现他们有人处于空闲状态，就会安排他们去执行剩下3个订单，如果收到等待中的订单可以继续操作时，厨师长会抽调厨师继续完成订单，从而增加了餐馆处理订单的能力。而并行编程则是餐馆开业的时候，告诉了厨师长，需要8个厨师；厨师长就带来了相应数量的厨师来处理订单。

这就是这两天，我对同步，异步和并行之间的感悟。如有不对，敬请指正！
