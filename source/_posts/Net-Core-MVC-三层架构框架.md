---
title: .Net Core MVC 三层架构框架
date: 2018-03-06 23:41:49
categories: .Net Core
tags:
 - .Net Core
 - MVC
---
Asp.Net Core 出来也很长时间,研究了一段时间,并基于Asp.Net Core + EF Core搭建了一个MVC的三层结构,其中用到了依赖注入和控制反转
<!--more-->
#### BLL层
##### IBaseService.cs
```cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Caty.Album.BLL.Interface
{
    public interface IBaseService<T> where T:class,new()
    {
        IQueryable<T> LoadEntities(System.Linq.Expressions.Expression<Func<T, bool>> whereLambda);
        IQueryable<T> LoadPageEntities<s>(int pageIndex, int pageSize, out int totalCount, System.Linq.Expressions.Expression<Func<T, bool>> whereLambda, System.Linq.Expressions.Expression<Func<T, s>> orderbyLambda, bool isAsc);
        bool DeleteEntity(T entity);
        bool EditEntity(T entity);
        T AddEntity(T entity);
    }
}
```

##### IService.cs
```cs
using Caty.Album.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace Caty.Album.BLL.Interface
{
    public partial interface IFaceService : IBaseService<Face>
    {

    }
    public partial interface IPeopleService : IBaseService<People>
    {

    }
}
```

##### BaseService.cs
```cs
using Caty.Album.Dal.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Caty.Album.BLL.Implements
{
    public class BaseService<T> where T : class, new()
    {
        private IBaseDal<T> _baseDal;
        public BaseService(IBaseDal<T> baseDal)
        {
            _baseDal = baseDal;
        }
        //查询
        public IQueryable<T> LoadEntities(System.Linq.Expressions.Expression<Func<T, bool>> whereLambda)
        {
            return _baseDal.LoadEntities(whereLambda);
        }
        //分页岔村
        public IQueryable<T> LoadPageEntities<s>(int pageIndex, int pageSize, out int totalCount, System.Linq.Expressions.Expression<Func<T, bool>> whereLambda, System.Linq.Expressions.Expression<Func<T, s>> orderbyLambda, bool isAsc)
        {
            return _baseDal.LoadPageEntities<s>(pageIndex, pageSize, out totalCount, whereLambda, orderbyLambda, isAsc);
        }
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool DeleteEntity(T entity)
        {
            _baseDal.DeleteEntity(entity);
            return _baseDal.SaveChanges();
        }
        /// <summary>
        /// 更新
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool EditEntity(T entity)
        {
            _baseDal.EditEntity(entity);
            return _baseDal.SaveChanges();
        }
        /// <summary>
        /// 添加数据
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public T AddEntity(T entity)
        {
            _baseDal.AddEntity(entity);
            _baseDal.SaveChanges();
            return entity;
        }
    }
}
```

##### Service.cs
```cs
using Caty.Album.BLL.Interface;
using Caty.Album.Dal.Interface;
using Caty.Album.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace Caty.Album.BLL.Implements
{
    public partial class FaceService:BaseService<Face>,IFaceService
    {
        private IFaceDal _faceDal;
        public FaceService(IFaceDal faceDal):base(faceDal)
        {
            _faceDal = faceDal;
        }
    }

    public partial class PeopleService:BaseService<People>,IPeopleService
    {
        private IPeopleDal _peopleDal;
        public PeopleService(IPeopleDal peopleDal) : base(peopleDal)
        {
            _peopleDal = peopleDal;
        }
    }
}
```

#### Dal层
##### IBaseDal.cs
```cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Caty.Album.Dal.Interface
{
    public interface IBaseDal<T> where T:class, new()
    {
        IQueryable<T> LoadEntities(System.Linq.Expressions.Expression<Func<T, bool>> whereLambda);
        IQueryable<T> LoadPageEntities<s>(int pageIndex, int pageSize, out int totalCount, System.Linq.Expressions.Expression<Func<T, bool>> whereLambda, System.Linq.Expressions.Expression<Func<T, s>> orderbyLambda, bool isAsc);
        bool DeleteEntity(T entity);
        bool EditEntity(T entity);
        T AddEntity(T entity);
        bool SaveChanges();
    }
}
```

##### IDal.cs
```cs
using Caty.Album.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Caty.Album.Dal.Interface
{
    public partial interface IUserDal : IBaseDal<User>
    {
        
    }
    public partial interface IRoleDal : IBaseDal<Role>
    {

    }
}
```

##### BaseDal.cs
```cs
using Caty.Album.Dal.Interface;
using Caty.Album.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Caty.Album.Dal.Implements
{
    public class BaseDal<T> : IBaseDal<T> where T : class, new()
    {
        protected readonly AlbumContext Db;
        public BaseDal(AlbumContext dbContext)
        {
            Db = dbContext;
        }
        /// <summary>
        /// 添加数据
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public T AddEntity(T entity)
        {
            Db.Set<T>().Add(entity);
            // Db.SaveChanges();
            return entity;
        }
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool DeleteEntity(T entity)
        {
            Db.Entry<T>(entity).State = EntityState.Deleted;
            return true;
            // return Db.SaveChanges() > 0;
        }
        /// <summary>
        /// 更新
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool EditEntity(T entity)
        {
            Db.Entry<T>(entity).State = EntityState.Modified;
            return true;
            // return Db.SaveChanges() > 0;
        }
        /// <summary>
        /// 查询过滤
        /// </summary>
        /// <param name="whereLambda"></param>
        /// <returns></returns>
        public IQueryable<T> LoadEntities(System.Linq.Expressions.Expression<Func<T, bool>> whereLambda)
        {
            return Db.Set<T>().Where<T>(whereLambda);
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
            if (isAsc) //升序
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
        /// 一个业务中经常设计多张表操作,一次连接数据库完成所有数据的保存,提高性能,工作单元模式
        /// </summary>
        /// <returns></returns>
        public bool SaveChanges()
        {
            return Db.SaveChanges() > 0;
        }
    }
}
```

##### Dal.cs
```cs
using Caty.Album.Dal.Interface;
using Caty.Album.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Caty.Album.Dal.Implements
{
    public partial class UserDal : BaseDal<User>, IUserDal
    {
        public UserDal(AlbumContext dbContext) : base(dbContext)
        {

        }
    }
    public partial class RoleDal : BaseDal<Role>, IRoleDal
    {
        public RoleDal(AlbumContext dbContext) : base(dbContext)
        {

        }
    }
}
```

#### Model层
##### AlbumContext.cs
```cs
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Caty.Album.Model
{
    public class AlbumContext:DbContext
    {
        public AlbumContext() : base() { }
        public AlbumContext(DbContextOptions options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Right> Rights { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<UserRight> UserRights { get; set; }
        public DbSet<RoleRight> RoleRights { get; set; }
        public DbSet<Face> Faces { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<People> Peoples { get; set; }
        public DbSet<PeopleGroup> PeopleGroups { get; set; }
    }
}
```

#### 依赖注入
修改Stratup.cs下的ConfigureServices方法的代码
##### Startup.cs
```cs
 public void ConfigureServices(IServiceCollection services)
    {
        //添加ef的依赖  
        var connection = "server=.;uid=sa;pwd=123;database=AlbumDb";
        services.AddDbContext<AlbumContext>(options => options.UseSqlServer(connection));
        services.AddScoped<DbContext, AlbumContext>();
        services.AddMvc();

        #region 依赖注入
        services.AddScoped<IFaceDal, FaceDal>();
        services.AddScoped<IPeopleDal, PeopleDal>();
        services.AddScoped<IGroupDal, GroupDal>();
        services.AddScoped<IPeopleGroupDal, PeopleGroupDal>();
        services.AddScoped<IFaceService, FaceService>();
        services.AddScoped<IPeopleService, PeopleService>();
        services.AddScoped<IGroupService, GroupService>();
        services.AddScoped<IPeopleGroupService, PeopleGroupService>();
        #endregion
    }
```