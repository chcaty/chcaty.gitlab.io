---
title: .Net Log4net封装
date: 2018-03-06 12:26:10
categories: .Net
tags: 
 - .Net
 - Log4net
---
log4net是.Net下一个非常优秀的开源日志记录组件。log4net记录日志的功能非常强大。它可以将日志分不同的等级，以不同的格式，输出到不同的媒介。
封装如下
<!--more-->

#### ILoger.cs

```cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Caty.Album.Utilities.Log
{
    public interface ILoger
    {
        void Write(string msg);
        void Write(string msg, LogMessageType type);
        void Write(string message, LogMessageType messageType, Type type);
        void Write(string message, LogMessageType messageType, Exception ex);

        void Write(string message, LogMessageType messageType, Exception ex, Type type);

        void Write<T>(T entity, LogMessageType messageType);
        void Write<T>(T entity, LogMessageType messageType, Exception ex, Type type);

        void Assert(bool condition, string message);
        void Assert(bool condition, string message, Type type);
    }
}
```

#### Log4netLoger.cs

```cs
using log4net;
using log4net.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Caty.Album.Utilities.Log
{ 
    public class Log4netLoger : ILoger
    {
        private static ILog loger = null;
        public Log4netLoger()
        {
            ILoggerRepository repository = LogManager.CreateRepository("AlbumRepository");
            try
            {
                if (loger == null)
                {
                    try
                    {
                        //string logerName = System.Configuration.ConfigurationManager.AppSettings["NiMisLog"];
                        loger = LogManager.GetLogger(repository.Name,"Album");
                    }
                    catch
                    {
                        loger = LogManager.GetLogger(repository.Name, "Album");
                    }
                }
            }
            catch
            {
                loger = LogManager.GetLogger(repository.Name, "Album");
            }
        }

        /// <summary>
        /// 写入日志
        /// </summary>
        /// <param name="message">日志信息</param>
        public void Write(string message)
        {
            DoLog(message, LogMessageType.Info, null, Type.GetType("System.Object"));
        }

        /// <summary>
        /// 写入日志
        /// </summary>
        /// <param name="message">日志信息</param>
        /// <param name="messageType">日志类型</param>
        public void Write(string message, LogMessageType messageType)
        {
            DoLog(message, messageType, null, Type.GetType("System.Object"));
        }

        /// <summary>
        /// 写入日志
        /// </summary>
        /// <param name="message">日志信息</param>
        /// <param name="messageType">日志类型</param>
        /// <param name="type"></param>
        public void Write(string message, LogMessageType messageType, Type type)
        {
            DoLog(message, messageType, null, type);
        }

        /// <summary>
        /// 写入日志
        /// </summary>
        /// <param name="message">日志信息</param>
        /// <param name="messageType">日志类型</param>
        /// <param name="ex">错误</param>
        public void Write(string message, LogMessageType messageType, Exception ex)
        {
            DoLog(message, messageType, ex, Type.GetType("System.Object"));
        }

        /// <summary>
        /// 写入日志
        /// </summary>
        /// <param name="message">日志信息</param>
        /// <param name="messageType">日志类型</param>
        /// <param name="ex">错误</param>
        /// <param name="type"></param>
        public void Write(string message, LogMessageType messageType, Exception ex, Type type)
        {
            DoLog(message, messageType, ex, type);
        }

        public void Write<T>(T entity, LogMessageType messageType)
        {
            Write(entity, messageType, null, null);
        }

        /// <summary>
        /// 将日志写入数据库中，主要是操作日志
        /// </summary>
        /// <param name="entity">数据表</param>
        /// <param name="messageType"></param>
        /// <param name="ex"></param>
        /// <param name="type"></param>
        public void Write<T>(T entity, LogMessageType messageType, Exception ex, Type type)
        {
            //if (dt == null || dt.Rows.Count < 1)
            //    return;
            //int rowCount = dt.Rows.Count;
            //int columnCount = dt.Columns.Count;
            //string message = string.Empty;
            //StringBuilder build = new StringBuilder();
            //DataRow dr = null;

            //build.Append("\r\n");
            //for (int j = 0; j < columnCount; j++)
            //{
            //    string Field = dt.Columns[j].ColumnName;
            //    build.Append(Field + "\t");
            //}
            //build.Append("\r\n");

            //for (int i = 0; i < rowCount; i++)
            //{
            //    dr = dt.Rows[i]; for (int j = 0; j < columnCount; j++)
            //    {
            //        string Value = dt.Rows[i][j].ToString();
            //        build.Append(Value + "\t");
            //    }
            //    build.Append("\r\n");
            //}
            //message = build.ToString();

            //if (type == null)
            //{
            //    type = Type.GetType("System.Object");
            //}
            //DoLog(message, messageType, ex, Type.GetType("System.Object"));
        }

        /// <summary>
        /// 断言
        /// </summary>
        /// <param name="condition">条件</param>
        /// <param name="message">日志信息</param>
        public void Assert(bool condition, string message)
        {
            Assert(condition, message, Type.GetType("System.Object"));
        }

        /// <summary>
        /// 断言
        /// </summary>
        /// <param name="condition">条件</param>
        /// <param name="message">日志信息</param>
        /// <param name="type">日志类型</param>
        public void Assert(bool condition, string message, Type type)
        {
            if (condition == false)
                Write(message, LogMessageType.Info);
        }

        /// <summary>
        /// 保存日志
        /// </summary>
        /// <param name="message">日志信息</param>
        /// <param name="messageType">日志类型</param>
        /// <param name="ex">错误</param>
        /// <param name="type">日志类型</param>
        private void DoLog(string message, LogMessageType messageType, Exception ex, Type type)
        {
            switch (messageType)
            {
                case LogMessageType.Debug:
                    loger.Debug(message, ex);
                    break;
                case LogMessageType.Info:
                    loger.Info(message, ex);
                    break;
                case LogMessageType.Warn:
                    loger.Warn(message, ex);
                    break;
                case LogMessageType.Error:
                    loger.Error(message, ex);
                    break;
                case LogMessageType.Fatal:
                    loger.Fatal(message, ex);
                    break;
            }
        }
    }
}
```

#### Loger.cs

```cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Caty.Album.Utilities.Log
{
    /// <summary>
    /// 日志器
    /// </summary>
    public static class Loger
    {
        private static ILoger loger;
        public static ILoger Instance
        {
            get
            {
                if (loger == null)
                {
                    try
                    {
                        loger = new Log4netLoger();
                    }
                    catch (Exception)
                    {
                        throw new Exception("Log4Net配置文件丢失或配置Log4Net出现错误。");
                    }
                }
                return loger;
            }
        }
    }
}

```

#### LogMessageType.cs

```cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Caty.Album.Utilities.Log
{
    /// <summary>
    /// 日志类型
    /// </summary>
    public enum LogMessageType
    {
        /// <summary>
        /// 调试
        /// </summary>
        Debug,
        /// <summary>
        /// 信息
        /// </summary>
        Info,
        /// <summary>
        /// 警告
        /// </summary>
        Warn,
        /// <summary>
        /// 错误
        /// </summary>
        Error,
        /// <summary>
        /// 致命错误
        /// </summary>
        Fatal
    }
}
```
