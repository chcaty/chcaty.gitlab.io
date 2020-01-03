---
title: .Net Linq
date: 2019-07-16 21:47:47
categories: .Net
tags:
 - .Net
 - Linq
---
#### Linq简介

Linq,语言集成查询,它允许使用C#或VB代码以查询数据库相同的方式来操作不同的数据源.
<!--more-->
##### Linq体系结构

* Linq to Objects 对内存中集合的操作

* Linq to DataSets 对数据集Datatable的操作

* Linq to Sql 对Sql Server数据源的操作

* Line to Entities 对Entity Framework的一部分并取代Linq to Sql作为在数据库上使用Linq的标准机制

* Linq to Xml 对Xml数据源的操作

##### Linq的语法

Linq查询表达式以from子句开头,以select子句结束.在两个子句之间,可以使用where,orderby等查询操作符.

```cs
int[] arr = new int[] { 1, 4, 2, 6, 7, 9, 5, 1, 2, 4 };
var query = from r in arr where r < 6 orderby r select r
var query2 = arr.Where(r => r < 6).OrderBy(r => r);
Console.WriteLine($"query个数:{query.Count()},query2个数:{query2.Count()}");
foreach(var item in query)
{
    Console.WriteLine(item);
}
oreach (var item in query2)
{
    Console.WriteLine(item);
}
```

Linq的语法分为Lanbda语法和Query语法.

#### Linq to Objects

##### 标准查询操作符

1. 筛选操作符(Where,OfType&lt;TResult>)

   * Where 根据表达式函数过滤元素

    ```cs
    int[] arr = new int[] { 1, 4, 2, 6, 7, 9, 5, 1, 2, 4 };
    var query = from r in arr where r < 6 orderby r select r
    var query2 = arr.Where(r => r < 6).OrderBy(r => r);
    ```

   * OfType&lt;TResult> 类型筛选

    ```cs
    object[] data = { "One", 2, 3, "Four", "Five", 6 };
    var typeFilter = data.OfType<int>();
    ```

2. 投射操作符(Select,SelectMany)

   * Select是把要遍历的集合IEnumerable逐一遍历，**每次返回一个T**，合并之后直接返回一个IEnumerable.

   * SelectMany则把原有的集合IEnumerable每个元素遍历一遍，**每次返回一个IEnumerable**，把这些IEnumerable的“T”合并之后整体返回一个IEnumerable

   * 例子

    ```cs
    private static void Main(string[] args)
    {
        List<List<int>> numbers = new List<List<int>>()
        {
            new List<int>{1,2,3},
            new List<int>{4,5,6},
            new List<int>{7,8,9}
        };
        var tokens = numbers.Select(s => s);
        var tokens1 = numbers.SelectMany(s => s);
        foreach (List<int> line in tokens)
        {
            foreach (int token in line)
            {
                Console.WriteLine($"Select:{token.ToString()}");
            }
        }
        foreach (int token in tokens1)
        {
            Console.WriteLine($"Select Many:{token.ToString()}");
        }
        Console.ReadLine();
    }
    ```

3. 排序操作符(OrderBy,ThenBy,OrderByDescending,ThenByDescending,Reverse)

   * OrderBy,OrderByDescending 升序排序,降序排序(连续调用,以最后一个为准排序)

   * ThenBy,ThenByDescending 是在使用OrderBy或OrderByDescending之后,再次对结果进行二次排序

    ```cs
    private static void Main(string[] args)
    {
        List<User> users = new List<User>()
        {
            new User(){UserId=1,UserCode="a0001",UserName="admin"},
            new User(){UserId=2,UserCode="b0001",UserName="super"},
            new User(){UserId=3,UserCode="a0002",UserName="user"},
            new User(){UserId=4,UserCode="b0002",UserName="admin"},
            new User(){UserId=4,UserCode="b0002",UserName="user"},
        };
        var tokens = users.Select(s => s).OrderBy(s => s.UserId).OrderBy(r => r.UserName);
        foreach (var user in tokens)
        {
            Console.WriteLine($"UserId:{user.UserId},UserName:{user.UserName}");
        }
        Console.WriteLine("ThenBy");
        tokens = users.Select(s => s).OrderBy(s => s.UserId).ThenBy(r => r.UserName);
        foreach (var user in tokens)
        {
            Console.WriteLine($"UserId:{user.UserId},UserName:{user.UserName}");
        }
        Console.ReadLine();
    }
    ```

   * Revise 反转集合中的元素顺序

    ```cs
    private static void Main(string[] args)
    {
        List<User> users = new List<User>()
        {
            new User(){UserId=1,UserCode="a0001",UserName="admin"},
            new User(){UserId=2,UserCode="b0001",UserName="super"},
            new User(){UserId=3,UserCode="a0002",UserName="user"},
            new User(){UserId=4,UserCode="b0002",UserName="admin"},
            new User(){UserId=4,UserCode="b0002",UserName="user"},
        };
        var tokens = users.OrderBy(s => s.UserName).Reverse();
        foreach (var user in tokens)
        {
            Console.WriteLine($"UserId:{user.UserId},UserName:{user.UserName}");
        }
        Console.ReadLine();
    }
    ```

4. 连接操作符(Join,GroupJoin)

   * Join 根据特定的条件合并两个数据源

   * GroupJoin 基于键相等对两个序列的元素进行关联并对结果进行分组.

    ```cs
    private static void Main(string[] args)
    {
        List<User> users = new List<User>()
        {
            new User(){UserId=1,UserCode="a0001",UserName="admin",RoleId =1},
            new User(){UserId=2,UserCode="b0001",UserName="super",RoleId=2},
            new User(){UserId=3,UserCode="a0002",UserName="user",RoleId=3},
            new User(){UserId=4,UserCode="b0002",UserName="admin"},
            new User(){UserId=5,UserCode="b0002",UserName="user",RoleId=1},
        };
        List<Role> roles = new List<Role>()
        {
            new Role(){RoleId = 1,RoleName="管理员"},
            new Role(){RoleId = 2,RoleName="普通用户"},
            new Role(){RoleId=3,RoleName="被封禁用户"}
        };
        var lists = users.Join(roles, u => u.RoleId, r => r.RoleId, (u, r) => new { u, r }).Select(o => o).ToList();
        Console.WriteLine("Join");
        foreach (var user in lists)
        {
            Console.WriteLine($"UserId:{user.u.UserId},UserName:{user.u.UserName},RoleId:{user.r.RoleId},RoleName:{user.r.RoleName}");
        }
        var tokens = users.GroupJoin(roles,u=>u.RoleId,r=>r.RoleId, (u,r) => new { u, r }).Select(o=>o).ToList();
        Console.WriteLine("GroupJoin");
        foreach (var user in tokens)
        {
            if (user.r.Count() >0)
            {
                Console.WriteLine($"UserId:{user.u.UserId},UserName:{user.u.UserName},RoleId:{user.r.FirstOrDefault().RoleId},RoleName:{user.r.FirstOrDefault().RoleName}");
            }
            else
            {
                Console.WriteLine($"UserId:{user.u.UserId},UserName:{user.u.UserName},RoleId:NULL,RoleName:NULL");
            }
        }
        Console.ReadLine();
    }
    ```

5. 组合操作符(GroupBy,ToLookup)

   * GroupBy 根据关键字值对查询结果进行分组

   * ToLookup 通过创建一对多的字典来组合元素

    ```cs
    private static void Main(string[] args)
    {
        List<User> users = new List<User>()
        {
            new User(){UserId=1,UserCode="a0001",UserName="admin",RoleId=1},
            new User(){UserId=2,UserCode="b0001",UserName="super",RoleId=2},
            new User(){UserId=3,UserCode="a0002",UserName="user",RoleId=3},
            new User(){UserId=4,UserCode="b0002",UserName="admin",RoleId=2},
            new User(){UserId=5,UserCode="b0002",UserName="user",RoleId=1},
        };
        List<Role> roles = new List<Role>()
        {
            new Role(){RoleId = 1,RoleName="管理员"},
            new Role(){RoleId = 2,RoleName="普通用户"},
            new Role(){RoleId=3,RoleName="被封禁用户"}
        };
        var lists = users.GroupBy(u => new { u.RoleId, u.UserName }).ToList();
        Console.WriteLine("GroupBy");
        foreach (var user in lists)
        {
            Console.WriteLine($"UserName:{user.Key.UserName},RoleId:{user.Key.RoleId},Count:{user.Count()}");
        }
        var tolookup = users.ToLookup(u => u.UserName, u => u.UserId);
        Console.WriteLine("ToLookup");
        if(tolookup.Contains("admin"))
        {
            foreach(var item in tolookup["admin"])
            {
                Console.WriteLine(item);
            }
        }
        Console.ReadLine();
    }
    ```

6. 限定操作符(Any,All,Contains)

   * Any 是否包含满足条件的元素

   * All 是否所有元素都满足条件

   * Contains 某一元素是否包含在集合中

    ```cs
    bool any = users.Any(u => u.UserId == 1);
    bool all = users.All(u => u.UserId != 0);
    User user = new User() { UserId = 1, UserCode = "a0001", UserName = "admin", RoleId = 1 };
    users.Add(user);
    bool contain = users.Contains(user);
    Console.WriteLine($"any:{any},all:{all},contain:{contain}");
    ```

7. 分区操作符(Take,Skip,TakeWhile,SkipWhile)

   * Take 从集合中提取指定数量的元素

   * Skip 从集合中跳过指定数量的元素

   * TakeWhile 提取第一个条件为真时的元素

   * SkipWhere 跳过集合中第一个满足条件的元素,返回剩余的所有元素

    ```cs
    var take = users.Take(2).ToList();
    var skip = users.Skip(2).ToList();
    var takewhile = users.TakeWhile(u => u.UserName == "admin").ToList();
    var skipwhile = users.SkipWhile(u => u.UserName == "admin").ToList();
    foreach(var t in take)
    {
        Console.WriteLine($"take UserId:{t.UserId},UserCode:{t.UserCode},UserName:{t.UserName}");
    }
    foreach (var t in skip)
    {
        Console.WriteLine($"skip UserId:{t.UserId},UserCode:{t.UserCode},UserName:{t.UserName}");
    }
    foreach (var t in takewhile)
    {
        Console.WriteLine($"takewhile UserId:{t.UserId},UserCode:{t.UserCode},UserName:{t.UserName}");
    }
    foreach (var t in skipwhile)
    {
        Console.WriteLine($"skipwhile UserId:{t.UserId},UserCode:{t.UserCode},UserName:{t.UserName}");
    }
    Console.ReadLine();
     ```

8. Set操作符(Distinct,Union,Intersect,Except,Zip)

   * Distinct 从集合中删除重复元素

   * Union,Intersect,Except 并集,交集,差集

   * Zip 把两个集合相应的项目合并起来,从到大较小的集合的末尾时停止.

    ```cs
    var distinct = users.Select(u=>u.UserName).Distinct().ToList();
    foreach (var t in distinct)
    {
        Console.WriteLine($"Distinct UserName:{t}");
    }
    var startwitha = users.Where(u => u.UserCode.StartsWith('a')).ToList();
    var endwithr = users.Where(u => u.UserName.EndsWith('r')).ToList();
    var union = startwitha.Union(endwithr);
    foreach(var u in union)
    {
        Console.WriteLine($"Union UserId={u.UserId},UserCode={u.UserCode},UserName={u.UserName}");
    }
    var intersect = startwitha.Intersect(endwithr);
    foreach(var i in intersect)
    {
        Console.WriteLine($"Intersect UserId={i.UserId},UserCode={i.UserCode},UserName={i.UserName}");
    }
    var except = startwitha.Except(endwithr);
    foreach(var e in except)
    {
        Console.WriteLine($"Except UserId={e.UserId},UserCode={e.UserCode},UserName={e.UserName}");
    }
    var zip = startwitha.Zip(endwithr, (first, second) => first.UserName + "+" + second.UserName);
    foreach(var z in zip)
    {
        Console.WriteLine($"Zip ={z}");
    }
    ```

9. 元素操作符(First,FirstOrDefault,Last,LastOrDefault,ElementAt,ElementAtOrDefault,Single,SingleOrDefault)

   * First 返回第一个满足条件的元素,若不存在,则引发异常

   * FirstOrDefault 返回第一个满足条件的元素,若不存在,则返回默认值

   * Last 返回最后一个满足条件的元素,若不存在,则引发异常

   * LastOrDefault 返回最后一个满足条件的元素,若不存在,则返回默认值

   * ElementAt 返回指定索引位置的元素,若不存在,则引发异常

   * ElementAtOrDefault 返回指定索引位置的元素,若不存在,则返回默认值

   * Single 只返回一个满足条件的元素,若不存在或多个元素都满足条件,则引发异常

   * SingleOrDefault 只返回一个满足条件的元素,若不存在,则返回默认值,若多个元素都满足条件,则引发异常

    ```cs
    var first = users.Where(u => u.UserName == "admin").First();
    Console.WriteLine($"First UserId:{first.UserId},UserCode:{first.UserCode},UserName:{first.UserName}");
    var firstordefault = users.Where(u => u.UserId == 6).FirstOrDefault();
    if (firstordefault != null)
    {
        Console.WriteLine($"FirstOrDefault UserId:{firstordefault.UserId},UserCode:{firstordefault.UserCode},UserName:{firstordefault.UserName}");
    }
    var last = users.Where(u => u.UserName == "admin").Last();
    Console.WriteLine($"Last UserId:{last.UserId},UserCode:{last.UserCode},UserName:{last.UserName}");
    var lastordefault = users.Where(u => u.UserName == "admin").LastOrDefault();
    Console.WriteLine($"LastOrDefault UserId:{lastordefault.UserId},UserCode:{lastordefault.UserCode},UserName:{lastordefault.UserName}");
    var elementat = users.Where(u => true).ElementAt(1);
    Console.WriteLine($"ElementAt UserId:{elementat.UserId},UserCode:{elementat.UserCode},UserName:{elementat.UserName}");
    var elementatordefault = users.Where(u => true).ElementAtOrDefault(3);
    Console.WriteLine($"ElementAtOrDefault UserId:{elementatordefault.UserId},UserCode:{elementatordefault.UserCode},UserName:{elementatordefault.UserName}");
    var single = users.Where(u => u.UserId == 1).Single();
    Console.WriteLine($"Single UserId:{single.UserId},UserCode:{single.UserCode},UserName:{single.UserName}");
    var singleordefault = users.Where(u => u.UserName == "admin").SingleOrDefault();
    if (singleordefault != null)
    {
        Console.WriteLine("SingleOrDefault UserId:{singleordefault.UserId},UserCode:{singleordefault.UserCode},UserName:{singleordefault.UserName}");
    }
    Console.ReadLine();
     ```

10. 聚合操作符(Count,Sum,Min,Max,Average,Aggregate)

    * Count 返回集合中的项数

    * Sum 计算所有值的总和

    * Min,Max,Average 最小值,最大值,平均值

    * Aggregate 对序列进行累加

    ```cs
    var count = users.Count();
    Console.WriteLine($"Count:{count}");
    var sum = users.Sum(u => u.UserId);
    Console.WriteLine($"Sum:{sum}");
    var min = users.Min(u => u.UserId);
    Console.WriteLine($"Min:{min}");
    var max = users.Max(u => u.UserCode);
    Console.WriteLine($"Max:{max}");
    var average = users.Average(u => u.UserId);
    Console.WriteLine($"Average:{average}");
    var nums = Enumerable.Range(2, 4);
    var aggregate = nums.Aggregate(1, (a, b) => a * b);
    Console.WriteLine($"Aggregate:{aggregate}");
    ```

11. 转换操作符(ToArray,AsEnumerable,ToList,ToDictionary,Cast&lt;TResult>)

    使用类型转换符会立刻立即执行结果,将查询结果放在数组/列表和字典中.

     ```cs
     User[] array = users.Where(u => u.UserName == "admin").ToArray();
     List<User> list = users.Where(u => u.UserName == "user").ToList();
     Dictionary<string, User> dic = users.Where(u => u.UserId == 1).ToDictionary(u => u.UserCode);
     IEnumerable<User> enumerable = users.Where(u => true).AsEnumerable();
     User user = users.Where(u => u.UserId == 1).Cast<User>().Single();
     ```

12. 生成操作符(Empty,Range,Repeat)

    * Empty 生成空集合
    * Range 生成一系列数字的集合
    * Repeat 返回始终重复一个值的集合

    ```cs
    var empty = Enumerable.Empty<int>();
    Console.WriteLine($"Count:{empty.Count()}");
    var range = Enumerable.Range(1, 100);
    foreach(var r in range)
    {
        Console.WriteLine($"Range:{r}");
    }
    var repeat = Enumerable.Repeat(5, 10);
    foreach (var r in repeat)
    {
        Console.WriteLine($"Repeat:{r}");
    }
    ```
