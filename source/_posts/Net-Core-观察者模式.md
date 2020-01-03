---
title: .Net Core 观察者模式
date: 2018-04-05 22:27:26
categories : .Net Core
tags: 
 - .Net Core
 - 设计模式
---
##### 观察者模式的定义
一个目标物件管理所有相依于它的观察者物件,并且在它本身的状态改变时主动发出通知
<!--more-->

##### .Net Core实现观察者模式的代码
###### Person.cs
```cs
using System;
namespace ObserverPattern
{
    public class Person
    {
        public event EventHandle<FallsIllEventArgs> FallsIll;

        public void OnFallsIll()
        {
            FallsIll?.Invoke(this, new FallsIllEventArgs("China Beijing"));
        }
    }
}
```

###### FallsIllEventArgs.cs
```cs
using System;
namespace ObserverPattern
{
    public readonly string Address;

    public FallsIllEventArgs(string address)
    {
        this.Address = address;
    }
}
```

##### Program.cs
```cs
using System;
namespace ObserverPattern
{
    class Program
    {
        static void Main(string[] args)
        {
            var person = new Person();
            person.FallsIll += OnFallsIll;
            person.OnFallsIll();
            person.FallsIll -= OnFallsIll;
        }

        private static void OnFallsIll(object sender, FallsIllEventArgs eventArgs)
        {
            Console.WriteLine($'A doctor has been called to(eventArgs.Address)');
        }
    }
}
```