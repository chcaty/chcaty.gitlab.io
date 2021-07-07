---
title: .Net Core 简单工厂和工厂方法模式
date: 2018-04-14 21:35:44
categories : .Net Core
tags: 
 - .Net Core
 - 设计模式
---

##### 简单工厂的定义

简单工厂负责创建对象的细节工作, 通过传入的类型参数, 建立并返回不同类型的对象.
<!--more-->

##### .Net Core实现简单工厂

Pizza.cs

```cs
using System;
using System.Collections.Generic;

namespace SimpleFactory.Pizzas
{
    public abstract class Pizza
    {
        public string Name { get; protectes set; }
        public string Dough { get; protectes set; }
        public string Sauce { get; protectes set; }
        protected List<string> Toppingd = new List<string>();

        public void Prepare()
        {
            Console.WriteLine($"Preparing:{Name}");
            Console.WriteLine($"Tossing:{Dough}");
            Console.WriteLine($"Adding sauce:{Sauce}");
            Console.WriteLine($"Adding toppings");
            Toppings.ForEach(x => Console.WriteLine($"{x}"));
        }

        public void Bake()
        {
            Console.WriteLine("Bake for 25 minutes");
        }

        public void Cut()
        {
            Console.WriteLine("Cutting the pizza into diagnol slices");
        }

        public void Box()
        {
            Console.WriteLine("Placing pizza in official PizzaStore box......");
        }
    }
}
```

CheesePizza.cs

```cs
namespace SimpleFactory.Pizzas
{
    public class CheesePizza: Pizza
    {
        public CheesePizza()
        {
            Name = "Cheese Pizza";
            Dough = "Think Dough";
            Sauce = "Salad";
            Toppings.Add("Grated ReggianoCheese");
        }
    }
} 
```

ClamPizza.ca

```cs
namespace SimpleFactory.Pizzas
{
    public class ClamPizza: Pizza
    {
        public ClamPizza()
        {
            Name = "Clam Pizza";
            Dough = "Soft Dough";
            Sauce = "Tomato sauce";
            Toppings.Add("Shrimp meat");
        }
    }
} 
```

SimplePizzaFactory

```cs
using SimpleFactory.Pizzas;

namespace SimpleFactory
{
    public class SimplePizzaFactory
    {
        public Pizza CreatePizza(string type)
        {
            Pizza pizza = null;
            switch(type)
            {
                case "cheese":
                    pizza = new CheesePizza();
                    break;
                case "clam":
                    pizza = new ClamPizza();
                    break;
            }
            return pizza;
        }
    }
}
```

PizzaStore.cs

```cs
using SimpleFactory.Pizzas;

namespace SimpleFactory
{
    public class PizzaStore
    {
        private readonly SimplePizzaFactory _factory;

        public PizzaStore(SimplePizzaFactory factory)
        {
            _factory = factory;
        }

        public Pizza OrderPizza(string type)
        {
            var pizza = _factory.CreatePizza(type);
            pizza.Prepare();
            pizza.Bake();
            pizza.Cut();
            pizza.Box();
            return pizza;
        }
    }
}
```

Program.cs

```cs
using System;
namespace SimpleFactory
{
    class Program
    {
        static void Main(string[] args)
        {
            var pizzaStore = new PizzaStore(new SimplePizzaFactory());
            var cheesePizza = pizzaStore.OrderPizza("cheese");
            var clamPizza = pizzaStore.OrderPizza("clam");
            Consloe.ReadKey();
        }
    }
}
```

##### 工厂方法的定义

工厂方法把对象创建的动作交给了子类, 并让它决定创建哪些对象.

##### .Net Core实现工厂方法

ChicagoCheesePizza.cs

```cs
namespace FactoryMethodPattern.Pizzas
{
    public class ChicagoCheesePizza: Pizza
    {
        public ChicagoCheesePizza()
        {
            Name = "Chicago Cheese Pizza";
            Dough = "Think Dough";
            Sauce = "Salad";
            Toppings.Add("Grated ReggianoCheese");
        }
    }
} 
```

ChicagoClamPizza.cs

```cs
namespace FactoryMethodPattern.Pizzas
{
    public class ChicagoClamPizza: Pizza
    {
        public ChicagoClamPizza()
        {
            Name = "Chicago Clam Pizza";
            Dough = "Soft Dough";
            Sauce = "Tomato sauce";
            Toppings.Add("Shrimp meat");
        }
    }
} 
```

PizzaStore.cs

```cs
using FactoryMethodPattern.Pizzas;

namespace FactoryMethodPattern
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

ChicagoPizzaStore.cs

```cs
using FactoryMethodPattern.Pizzas;

namespace FactoryMethodPattern
{
    public class ChicagoPizzaStore:PizzaStore
    {
        protected override Pizza CreatePizza(string type)
        {
            Pizza pizza = null;
            switch(type)
            {
                case "cheese":
                    pizza = new ChicagoCheesePizza();
                    break;
                case "clam":
                    pizza = new ChicagoClamPizza();
                    break;
            }
            return pizza;
        }
    }
}
```

Program.cs

```cs
using System;
namespace FactoryMethodPattern
{
    class Program
    {
        static void Main(string[] args)
        {
            var chicagoStore = new ChicagoPizzaStore();
            var cheesePizza = chicagoStore.OrderPizza("cheese");
            var clamPizza = chicagoStore.OrderPizza("clam");
            Consloe.ReadKey();
        }
    }
}
```
