---
title: 'CSharp-在Winform中使用Sqlite'
date: 2018-12-11 22:48:20
categories: C# 
tags: 
 - Sqlite
 - C#
---
近期了解了一下Sqlite数据库,便想把之前写的一个爬虫项目的数据库里添加Sqlite支持,一开始想着用EF去完成的,后面尝试过后,发现EF用起来并不是那么方便,就改成用Sqlite的ORM框架,这里采用的是sqlite-net-pcl,nuget查找sqlite-net-pcl并选择即可.
<!--more-->
##### 定义实体类
```cs
public class Book
{
    [PrimaryKey, AutoIncrement]
    public int BookId { get; set; }
    public string BookName { get; set; }
    public string BookLink { get; set; }
    public string DownloadLink { get; set; }
}
```
##### 定义数据库连接
```cs
public class BookSqliteDb : SQLiteConnection
{
    //定义属性，便于外部访问数据表
    public TableQuery<Book> Books { get { return this.Table<Book>(); } }

    public BookSqliteDb(string dbPath) : base(dbPath)
    {
        //创建数据表
        CreateTable<Book>();
    }
}
```
##### 调用
```cs
//定义Sqlite文件路径
private string dbPath = $"{Environment.CurrentDirectory}\\Kindle.db";

//增加
List<Book> books = new List<Book>()
{
    new Book() { BookId = "1", BookName = "将夜", BookLink = "www.baidu.com", DownloadLink = "www.baidu.com" }
};
using (var Kindledb = new BookSqliteDb(dbPath))
{
    int count = Kindledb.InsertAll(books);
}

//修改
using (var Kindledb = new BookSqliteDb(dbPath))
{
    var book = Kindledb.Books.FirstOrDefault(x => x.BookName == "将夜");
    if (book != null)
    {
        book.BookLink = "";
        int count = Kindledb.Update(book);
    }
}

//删除
using (var Kindledb = new BookSqliteDb(dbPath))
{
    int count = Kindledb.Books.Delete(x => x.BookName == "将夜");
}

//查询
using (var Kindledb = new BookSqliteDb(dbPath))
{
    var books = Kindledb.Books.Where(x => x.BookName == "将夜").OrderByDescending(x => x.BookId).ToList();
    string str = $"{DateTime.Now}, 查到{books.Count}条记录";
}
```