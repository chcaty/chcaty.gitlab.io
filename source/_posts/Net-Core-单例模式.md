---
title: .Net Core 单例模式
date: 2018-06-11 19:49:03
categories : .Net Core
tags: 
 - .Net Core
 - 设计模式
---
##### 单例模式的定义
单体模式保证一个类只有一个实例, 并提供一个全局访问该实例的方法
<!--more-->

##### .Net Core实现单例模式的代码
###### ChocolateBoiler.cs
```cs
namespace SingletonPattern
{
    public class ChocolateBoiler
    {
        public bool Empty { get; private set; }
        public bool Boiled { get; private set; }

        private static ChocolateBoiler _uniqueInstance;

        private ChocolateBoiler()
        {
            Empty = true;
            Boiled = false;
        }

        public static ChocolateBoiler GetInstance()
        {
            return _uniqueInstance ?? (_uniqueInstance = new ChocolateBoiler());
        }

        public void Fill()
        {
            if (Empty)
            {
                Empty = false;
                Boiled = false;
            }
        }

        public void Drain()
        {
            if (!Empty && Boiled)
            {
                Empty = true;
            }
        }

        public void Boil()
        {
            if (!Empty && !Boiled)
            {
                Boiled = true;
            }
        }
    }
}
```

###### SynchronizedChocolateBoiler.cs
```cs
using System.Runtime.CompilerServices;
namespace SingletonPattern
{
    public class SynchronizedChocolateBoiler
    {
        public bool Empty { get; private set; }
        public bool Boiled { get; private set; }

        private static SynchronizedChocolateBoiler _uniqueInstance;

        private SynchronizedChocolateBoiler()
        {
            Empty = true;
            Boiled = false;
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public static SynchronizedChocolateBoiler GetInstance()
        {
            return _uniqueInstance ?? (_uniqueInstance = new SynchronizedChocolateBoiler());
        }

        public void Fill()
        {
            if (Empty)
            {
                Empty = false;
                Boiled = false;
            }
        }

        public void Drain()
        {
            if (!Empty && Boiled)
            {
                Empty = true;
            }
        }

        public void Boil()
        {
            if (!Empty && !Boiled)
            {
                Boiled = true;
            }
        }
    }
}

```

###### DoubleCheckChocolateBoiler.cs
```cs
namespace SingletonPattern
{
    public class DoubleCheckChocolateBoiler
    {
        public bool Empty { get; private set; }
        public bool Boiled { get; private set; }

        private static volatile DoubleCheckChocolateBoiler _uniqueInstance;
        private static readonly object LockHelper = new object();

        private DoubleCheckChocolateBoiler()
        {
            Empty = true;
            Boiled = false;
        }

        public static DoubleCheckChocolateBoiler GetInstance()
        {
            if (_uniqueInstance == null)
            {
                lock (LockHelper)
                {
                    if (_uniqueInstance == null)
                    {
                        _uniqueInstance = new DoubleCheckChocolateBoiler();
                    }
                }
            }
            return _uniqueInstance;
        }

        public void Fill()
        {
            if (Empty)
            {
                Empty = false;
                Boiled = false;
            }
        }

        public void Drain()
        {
            if (!Empty && Boiled)
            {
                Empty = true;
            }
        }

        public void Boil()
        {
            if (!Empty && !Boiled)
            {
                Boiled = true;
            }
        }
    }
}
```