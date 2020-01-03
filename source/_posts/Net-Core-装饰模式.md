---
title: .Net Core 装饰模式
date: 2018-04-05 23:14:57
categories: .Net Core
tags:
 - .Net Core
 - 设计模式
---
##### 装饰模式的定义
动态的对某个对象进行扩展(附加额外的职责),装饰器是除了继承之外的另外一种为对象扩展功能的方法
<!--more-->

##### .Net Core实现装饰模式的代码
###### Beverage.cs
```cs
namespace DecoratorPattern.Core
{
    public abstract class Beverage
    {
        public virtual string Description{ get; private set; } = "Unknown Beverage";
        public abstract double Cost();
    }
}
```

###### CondimentDecorator.cs
```cs
namespace DecoratorPattern.Core
{
    public abstract class CondimentDecorator : Beverage
    {
        public abstract override string Description{ get; }
    }
}
```

###### Espresso.cs
```cs
using DecoratorPattern.Core;
namespace DecoratorPattern.Coffee
{
    public class Espresso : Beverage
    {
        public Espresso()
        {
            Description = "Espresso";
        }
        public override double Cost()
        {
            return 1.99;
        }
    }
}
```

###### HouseBlend.cs
```cs
using DecoratorPattern.Core;
namespace DecoratorPattern.Coffee
{
    public class HouseBlend : Beverage
    {
        public HouseBlend()
        {
            Description = "HouseBlend";
        }
        public override double Cost()
        {
            return 0.89;
        }
    }
}
```

###### Mocha.cs
```cs
using DecoratorPattern.Core;
namespace DecoratorPattern.Condiments
{
    public class Mocha : CodimentDecorator
    {
        private readonly Beverage beverage;

        public Mocha(Beverage beverage) => this.beverage = beverage;

        public override string Description => $"{beverage.Description},Mocha";

        public override doublr Cost()
        {
            return 0.20 + beverage.Cost();
        }
    }
}
```

###### Program.cs
```cs
using System;
using DecoratorPattern.Core;
using DecoratorPattern.Coffee;

namespace DecoratorPattern
{
    class Program
    {
        static void Main(string[] args)
        {
            var beverage = new Espresso();
            Console.WriteLine($"{beverage.Description}${beverage.Cost()}");

            Beverage beverage2 = new HouseBlend();
            beverage2 = new Mocha(beverage2);
            Console.WriteLine($"{beverage2.Description}${beverage2.Cost()}");
        }
    }
}
```
