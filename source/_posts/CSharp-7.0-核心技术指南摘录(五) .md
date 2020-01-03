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
