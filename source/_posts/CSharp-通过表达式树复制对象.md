---
title: CSharp-复制对象的方式
date: 2018-06-09 22:38:24
categories: C# 
tags: 
 - 复制对象
 - C#
---
在代码中经常会遇到需要把对象复制一遍，或者把属性名相同的值复制一遍。
<!--more-->

##### 解决方法

以People为例

```cs
public class People
{
    public string IdCard { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }
}
```

1. 手动赋值

    ```cs
    People p = new People() {IdCrad = "445221XXXXXXXX", Name="caty", Age=21 };
    People h = new People() {IdCrad = p.IdCard, Name = p.Name, Age = p.Age };
    ```

2. 反射

    ```cs
    private static TOut TransReflection<TIn, TOut>(TIn tIn)
    {
        TOut tOut = Activator.CreateInstance<TOut>();
        var tInType = tIn.GetType();
        foreach (var itemOut in tOut.GetType().GetProperties())
        {
            var itemIn = tInType.GetProperty(itemOut.Name); ;
            if (itemIn != null)
            {
                itemOut.SetValue(tOut, itemIn.GetValue(tIn));
            }
        }
        return tOut;
    }

    People pp = TransReflection<People, People>(p);
    ```

3. 序列化
    需引入Newtonsoft. Json 包

    ```cs
    People ss= JsonConvert.DeserializeObject<People>(JsonConvert.SerializeObject(s));
    ```

4. 表达式树

    ```cs
    public static class TransExpression<TIn, TOut>
    {
        private static readonly Func<TIn, TOut> cache = GetFunc();
        private static Func<TIn, TOut> GetFunc()
        {
            ParameterExpression parameterExpression = Expression.Parameter(typeof(TIn), "p");
            List<MemberBinding> memberBindingList = new List<MemberBinding>();
            foreach (var item in typeof(TOut).GetProperties())
            {
    　　　　　　　if (!item.CanWrite)
    　　　　　　　　    continue;
                MemberExpression property = Expression.Property(parameterExpression, typeof(TIn).GetProperty(item.Name));
                MemberBinding memberBinding = Expression.Bind(item, property);
                memberBindingList.Add(memberBinding);
            }

            MemberInitExpression memberInitExpression = Expression.MemberInit(Expression.New(typeof(TOut)), memberBindingList.ToArray());
            Expression<Func<TIn, TOut>> lambda = Expression.Lambda<Func<TIn, TOut>>(memberInitExpression, new ParameterExpression[] { parameterExpression });
            return lambda.Compile();
        }

        public static TOut Trans(TIn tIn)
        {
            return cache(tIn);
        }
    }

    People pp = TransExpression<People,People>,Trans(p);
    ```
