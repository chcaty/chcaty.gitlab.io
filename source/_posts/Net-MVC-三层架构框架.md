---
title: .Net MVC 三层架构框架
date: 2018-03-10 01:23:10
categories: .Net
tags:
 - .Net
 - MVC
---
asp.net+ef mvc三层框架搭建过程如下

##### 先创建Model层
略
<!--more-->

##### 创建数据访问接口层IUserInfoDal
在该接口中定义了常见的方法CRUD以及分页方法
```cs
public interface IUserInfoDal
{
    IQueryable<UserInfo> LoadEntities(System.Linq.Expressions.Expression<Func<UserInfo, bool>> whereLambda);
    IQueryable<UserInfo> LoadPageEntities<s>(int pageIndex, int pageSize, out int totalCount, System.Linq.Expressions.Expression<Func<UserInfo, bool>> whereLambda, System.Linq.Expressions.Expression<Func<UserInfo, s>> orderbyLambda, bool isAsc);
    bool DeleteEntity(UserInfo entity);
    bool EditEntity(UserInfo entity);
    UserInfo AddEntity(UserInfo entity);
}
```

##### 每个接口中都需要CURD以及分页方法的定义,而且这些方法的定义基本上是一致的,所以封装.封装到IBaseDal
```cs
public interface IBaseDal<T>where T:class,new()//注意该泛型的使用
{
    IQueryable<T> LoadEntities(System.Linq.Expressions.Expression<Func<T, bool>> whereLambda);
    IQueryable<T> LoadPageEntities<s>(int pageIndex, int pageSize, out int totalCount, System.Linq.Expressions.Expression<Func<T, bool>> whereLambda, System.Linq.Expressions.Expression<Func<T, s>> orderbyLambda, bool isAsc);
    bool DeleteEntity(T entity);
    bool EditEntity(T entity);
    T AddEntity(T entity);
}
```

##### 让IUserInfoDal继承IBaseDal
```cs
public interface IUserInfoDal:IBaseDal<UserInfo>
{
    //定义自己特有的方法。
}
```

##### 让具体的数据操作类UserInfoDal去实现IUserInfoDal接口中的方法
```cs
public class UserInfoDal :IUserInfoDal
{
    OAEntities Db = new OAEntities();
    /// <summary>
    /// 查询过滤
    /// </summary>
    /// <param name="whereLambda"></param>
    /// <returns></returns>
    public IQueryable<UserInfo> LoadEntities(System.Linq.Expressions.Expression<Func<UserInfo, bool>> whereLambda)
    {
        return Db.UserInfo.Where<UserInfo>(whereLambda);//
    }
    /// <summary>
    /// 分页
    /// </summary>
    /// <typeparam name="s"></typeparam>
    /// <param name="pageIndex"></param>
    /// <param name="pageSize"></param>
    /// <param name="totalCount"></param>
    /// <param name="whereLambda"></param>
    /// <param name="orderbyLambda"></param>
    /// <param name="isAsc"></param>
    /// <returns></returns>
    public IQueryable<UserInfo> LoadPageEntities<s>(int pageIndex, int pageSize, out int totalCount, System.Linq.Expressions.Expression<Func<UserInfo, bool>> whereLambda, System.Linq.Expressions.Expression<Func<UserInfo, s>> orderbyLambda, bool isAsc)
    {
        var temp = Db.UserInfo.Where<UserInfo>(whereLambda);
        totalCount = temp.Count();
        if (isAsc)//升序
        {
            temp = temp.OrderBy<UserInfo, s>(orderbyLambda).Skip<UserInfo>((pageIndex - 1) * pageSize).Take<UserInfo>(pageSize);
        }
        else
        {
            temp = temp.OrderByDescending<UserInfo, s>(orderbyLambda).Skip<UserInfo>((pageIndex - 1) * pageSize).Take<UserInfo>(pageSize);
        }
        return temp;
    }

    /// <summary>
    /// 删除
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    public bool DeleteEntity(UserInfo entity)
    {
        Db.Entry<UserInfo>(entity).State = System.Data.EntityState.Deleted;
        return Db.SaveChanges() > 0;
    }

    /// <summary>
    /// 更新
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    public bool EditEntity(UserInfo entity)
    {
        Db.Entry<UserInfo>(entity).State = System.Data.EntityState.Modified;
        return Db.SaveChanges() > 0;
    }

    /// <summary>
    /// 添加数据
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    public UserInfo AddEntity(UserInfo entity)
    {
        Db.Set <UserInfo>().Add(entity);
        Db.SaveChanges();
        return entity;
    }
}
```  

##### 由于每个数据操作类都要实现自己的接口（每一个接口都继承了IBaseDal）,所以每个数据操作类中都要重复实现CURD以及分页的方法，所以把具体的实现封装到了BaseDal中。
```cs
public class BaseDal<T>where T:class,new()
{
    OAEntities Db = new OAEntities();
    /// <summary>
    /// 查询过滤
    /// </summary>
    /// <param name="whereLambda"></param>
    /// <returns></returns>
    public IQueryable<T> LoadEntities(System.Linq.Expressions.Expression<Func<T, bool>> whereLambda)
    {
        return Db.Set <T>().Where<T>(whereLambda);//
    }
        
    /// <summary>
    /// 分页
    /// </summary>
    /// <typeparam name="s"></typeparam>
    /// <param name="pageIndex"></param>
    /// <param name="pageSize"></param>
    /// <param name="totalCount"></param>
    /// <param name="whereLambda"></param>
    /// <param name="orderbyLambda"></param>
    /// <param name="isAsc"></param>
    /// <returns></returns>
    public IQueryable<T> LoadPageEntities<s>(int pageIndex, int pageSize, out int totalCount, System.Linq.Expressions.Expression<Func<T, bool>> whereLambda, System.Linq.Expressions.Expression<Func<T, s>> orderbyLambda, bool isAsc)
    {
        var temp = Db.Set<T>().Where<T>(whereLambda);
        totalCount = temp.Count();
        if (isAsc)//升序
        {
            temp = temp.OrderBy<T, s>(orderbyLambda).Skip<T>((pageIndex - 1) * pageSize).Take<T>(pageSize);
        }
        else
        {
            temp = temp.OrderByDescending<T, s>(orderbyLambda).Skip<T>((pageIndex - 1) * pageSize).Take<T>(pageSize);
        }
        return temp;
    }

    /// <summary>
    /// 删除
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    public bool DeleteEntity(T entity)
    {
        Db.Entry<T>(entity).State = System.Data.EntityState.Deleted;
        return Db.SaveChanges() > 0;
    }

    /// <summary>
    /// 更新
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    public bool EditEntity(T entity)
    {
        Db.Entry<T>(entity).State = System.Data.EntityState.Modified;
        return Db.SaveChanges() > 0;
    }

    /// <summary>
    /// 添加数据
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    public T AddEntity(T entity)
    {
        Db.Set <T>().Add(entity);
        Db.SaveChanges();
        return entity;
    }
}
```

##### 让UserInfoDal继承BaseDal.
```cs
public class UserInfoDal : BaseDal<UserInfo>,IUserInfoDal
{
    //对应的独特方法
} 
```

##### 创建DBSession(数据会话层：就是一个工厂类，负责完成所有数据操作类实例的创建，然后业务层通过数据会话层来获取要操作数据类的实例.所以数据会话层将业务层与数据层解耦. 在数据会话层中提供一个方法：完成所有数据的保存.)
```cs
private IUserInfoDal _UserInfoDal;
public IUserInfoDal UserInfoDal
{
    get
    {
        if (_UserInfoDal == null)
         {
            _UserInfoDal = new UserInfoDal();
        }
        return _UserInfoDal;
    }
    set
    {
        _UserInfoDal = value;
    }
}
```

##### 在数据会话层中提供一个方法：完成所有数据的保存
```cs
/// <summary>
/// 一个业务中经常涉及到对多张操作，我们希望连接一次数据库，完成对张表数据的操作。提高性能。 工作单元模式。
/// </summary>
/// <returns></returns>
public bool SaveChanges()
{
    return Db.SaveChanges() > 0;
}
```

##### 将数据层中的所有的保存数据的SaveChanges注释掉
略

##### 在数据层中用到了EF的实例，数据会话层中也用到了，所以在一个请求中只能创建一个EF实例（线程内唯一对象）
```cs
/// <summary>
/// 负责创建EF数据操作上下文实例，必须保证线程内唯一.
/// </summary>
public class DBContextFactory
{
    public static DbContext CreateDbContext()
    {
        DbContext dbContext = (DbContext)CallContext.GetData("dbContext");
        if (dbContext == null)
        {
            dbContext = new OAEntities();
            CallContext.SetData("dbContext", dbContext);
        }
        return dbContext;
    }
}
```

##### 在DBSession和BaseDal中调用上面的方法（CreateDbContext）完成EF实例的创建
```cs
// DBSession获取EF实例
public DbContext Db
{
    get
    {
        return DBContextFactory.CreateDbContext(); 
    }
}
	   
// BaseDal中获取EF的实例
DbContext Db = DAL.DBContextFactory.CreateDbContext();
```

##### 抽象工厂封装数据操作类实例创建，然后DBSession调用抽象工厂
```cs
/// <summary>
/// 通过反射的形式创建类的实例
/// </summary>
public class AbstractFactory
{
    private static readonly string AssemblyPath = ConfigurationManager.AppSettings["AssemblyPath"];
    private static readonly string NameSpace = ConfigurationManager.AppSettings["NameSpace"];
    public static IUserInfoDal CreateUserInfoDal()
    {
        string fullClassName = NameSpace + ".UserInfoDal";
        return CreateInstance(fullClassName) as IUserInfoDal;
    }
    private static object CreateInstance(string className)
    {
        var assembly= Assembly.Load(AssemblyPath);
        return assembly.CreateInstance(className);
    }
}
```	

##### 然后修改DBSession
```cs
private IUserInfoDal _UserInfoDal;
public IUserInfoDal UserInfoDal
{
    get 
    {
        if (_UserInfoDal == null)
        {
            //_UserInfoDal = new UserInfoDal();
            _UserInfoDal = AbstractFactory.CreateUserInfoDal();//通过抽象工厂封装了类的实例的创建
        }
        return _UserInfoDal;
    }
    set
    {
        _UserInfoDal = value;
    }
}
```

##### 定义DBSession的接口
```cs
/// <summary>
/// 业务层调用的是数据会话层的接口。
/// </summary>
public interface IDBSession
{
    DbContext Db { get; }
    IUserInfoDal UserInfoDal { get; set; }
    bool SaveChanges();
}
```

##### 然后让DBSession实现该接口
略

##### 定义具体的业务基类
```cs
//在业务基类中完成DBSession的调用，然后将业务层中公共的方法定义在基类中，但是这些方法不知道通过DBSession来获取哪个数据操作类的实例。所以将该业务基类定义成抽象类，加上一个抽象方法，加上一个IBaseDal属性，并且让基类的构造方法调用抽象方法目的是在表现层new具体的业务子类，父类的构造方法被调用，这些执行抽象方法，但是执行的的是子类中具体的实现。业务子类知道通过DBSession获取哪个数据操作类的实例。
public abstract class BaseService<T> where T:class,new()
{
    public IDBSession CurrentDBSession
    {
        get
        {
            return new DBSession();//暂时
        }
    }
    public IDAL.IBaseDal<T> CurrentDal { get; set; }
    public abstract void SetCurrentDal();
    public BaseService()
    {
        SetCurrentDal();//子类一定要实现抽象方法。
    }
    public IQueryable<T> LoadEntities(System.Linq.Expressions.Expression<Func<T, bool>> whereLambda)
    {
        return CurrentDal.LoadEntities(whereLambda);
    }
}
```

##### 定义业务层的接口
略

##### 将数据库链接字符串拷贝到web.config文件中
略