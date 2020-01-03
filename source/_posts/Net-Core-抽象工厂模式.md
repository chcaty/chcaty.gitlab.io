---
title: .Net Core 抽象工厂模式
date: 2018-04-16 20:03:13
categories : .Net Core
tags: 
 - .Net Core
 - 设计模式
---
##### 抽象工厂的定义
抽象工厂提供了一个接口,这个接口可以创建一族相关或依赖的对象而无需指明它们具体的类.
<!--more-->

##### 工厂方法和抽象工厂的比较
工厂方法是通过继承来实现创建对象工作的,而抽象工厂则是通过组合的方法.
工厂方法是让子类来创建对象,客户只需要知道抽象类,子类做具体的实现,解耦.
抽象工厂提供了一个可以创建一族产品的抽象类,这个类的实现类/子类决定产品是如何产出的,也是解耦.
抽象工厂的优点是:可以创建一族相关的产品.缺点是它的接口比较大,如果添加了产品需要改接口.
而工厂方法只负责生产一个产品.
抽象工厂也经常使用工厂方法来实现具体的工厂.
而工厂方法也经常使用抽象的创造者,它来使用子类创建出的具体产品.

##### .Net Core实现抽象工厂
###### IGredient.cs
```cs
namespace AbtractFactoryPattern.Abstractions
{
    public interface IGredient
    {
        string Name { get; }
    }
}
```

###### ICheese.cs
```cs
namespace AbtractFactoryPattern.Abstractions
{
    public interface ICheese : IGredient
    {
        
    }
}
```

###### IClams.cs
```cs
namespace AbtractFactoryPattern.Abstractions
{
    public interface IClams : IGredient
    {
        
    }
}
```

###### IDough.cs
```cs
namespace AbtractFactoryPattern.Abstractions
{
    public interface IDough : IGredient
    {
        
    }
}
```

###### ISauce.cs
```cs
namespace AbtractFactoryPattern.Abstractions
{
    public interface ISauce : IGredient
    {
        
    }
}
```

###### IPizzalngredientFactory.cs
```cs
namespace AbtractFactoryPattern.Abstractions
{
    public interface IPizzalngredientFactory
    {
        IDough CreateDough();
        ICheese CreateCheese();
        IClams CreateClams();
        ISauce CreateSauce();
    }
}
```

###### PizzaStore.cs
```cs
namespace AbtractFactoryPattern.Abstractions
{
    public abstract class PizzaStore
    {
        public Pizza OrderPizza(string type)
        {
            var pizza = CreatePizza(type);
            pizza.Prepare();
            pizza.Bake();
            pizza.Cut();
            pizza.Box();
            return pizza;
        }

        protected abstract Pizza CreatePizza(string type);
    }
}
```

###### Pizza.cs
```cs
namespace AbtractFactoryPattern.Abstractions
{
    public abstract class Pizza
    {
        public string Name { get; set; }
        public IDough Dough { get; protected set; }
        public ISauce Sauce { get; protected set; }
        public ICheese Cheese { get; protected set; }
        public IClams Clams { get; protected set; }

        public abstract void Propare();

        
    }
}
```