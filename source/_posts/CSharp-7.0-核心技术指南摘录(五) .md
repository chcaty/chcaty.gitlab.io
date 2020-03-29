---
title: CSharp 7.0 核心技术指南摘录(五)
date: 2019-09-01 23:14:58
categories: C#
tags:
 - C#
 - 摘录
---
### 字符分类静态方法

静态方法 | 包含的方法 | 包含的 Unicode 分类
:- | :- | :-
IsLetter | A-Z,a-z和其他字母字符 | UpperCaseLetter, LowerCaseLetter, TitleCseLetter, ModifierLetter, OtherLetter
IsUpper | 大写字母| UpperCaseLetter
IsLower | 小写字母| LowerCaseLetter
IsDigit | 0-9和其他字母表中的数字| DecimalDigitNumber
IsLetterOrDigit | 字母和数字| (IsLetter, IsDigit)
IsNumber | 所有数字以及 Unicode 分数和罗马数字符号| DecimalDigitNumber, LetterNumber, OtherNumber
IsSeparator | 空格与所有 Unicode 分隔符| LineSeparator, ParagraphSeparator
IsEhiteSpace | 所有的分隔符,以及 \n, \r, \t, \f和 \v| LineSeparator, ParagraphSeparator
IsPunctuation | 西方和其他字母表中的标点符号| DashPunctuation, ConnectorPunctuation, InitialQuotePunctuation, FinalQuotePunctuation
IsSymbol | 大部分其他的可打印符号| MathSymbol, ModifierSymbol, OtherSymbol
IsControl | 值小于 0x20 的不可打印的控制字符.例如 \r, \n, \t, \0 和 0x7F 与 0x9A 之间字符| (无)

<!--more-->

### 数值转换总结

任务 | 函数 | 示例
:- | :- | :-
解析十进制数字 | Parse, TryParse | double i = double.Parse("3.5");
解析二进制,八进制,十六进制数字 | Convert.To('数字') | int i= Convert.ToInt32("1E", 16);
按十六进制格式化 | ToString('数字') | string hex = 45.ToString("X");
无损数值转换 | 隐式转换 | int i = 32; double d = i;
截断式数值转换 | 显式转换 | double d = 23.5; int i = (int)d;
舍入式数值转换 | Convert.To()数字 | double d = 23.5; int i = Convert.ToInt32(d);

### 静态 Math 类的方法

类别 | 方法
:- | :-
舍入 | Round, Truncate, Floor, Ceiling
最大值/最小值 | Max, Min
绝对值和符号 | Abs, Sign
平方根 | Sqrt
幂运算 | Pow, Exp
对数运算 |Log, Log10
三角函数 | Sin, Cos, Tan, Sinh, Cosh, Tanh, Asin, Acos, Atan

### 线程

* 调用Thread的Join方法可以等待线程结束，Thread.Sleep方法将当前线程的执行暂停指定的时间;在等待线程Sleep或者Join的过程中,线程是阻塞(blocked)的.
* Thread.Sleep(0)将会导致线程立即放弃自己的时间片,自觉地将CPU交于其他的线程.Thread.Yield()执行相同的操作,但是它仅仅会将资源交给同一个处理器上运行的线程.
* Sleep(0)和Yield在高级性能调优方面非常有用.同时它还是一种很好的诊断工具.可用于帮助开发者发现与线程安全相关的问题;如果在代码的任意位置插入Thread.Yield()导致程序失败,则代码一定是存在缺陷的.
* 一般情况下,显式创建的线程称为前台线程.只要有一个前台线程还在运行,应用程序就仍然保持运行状态.而后台线程则不然.当所有前台线程结束时,应用程序就会停止,且所有运行的后台线程也会随之终止.可以使用线程的IsBackground属性来查询或修改线程的前后台状态.
* 如果想要在工作线程上更新UI,就必须将请求发送给UI线程,这种技术叫封迭.实现这个操作的底层方式有:
    1. 在WPF中,调用元素上的Dispatcher对象的BeginInoke或Invoke方法.
    2. 在UWP应用中.可以调用Dispatcher对象的RunAsync或Invoke方法.
    3. 在Windows Forms应用中,调用控件的BeginInvoke或Invoke方法.
