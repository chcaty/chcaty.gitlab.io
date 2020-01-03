---
title: CSharp-字符串处理
date: 2019-04-03 22:59:11
categories: C# 
tags: 
 - 基础
 - C#
---
### 字符串处理
#### AddDays方法
用于将指定的天数加到指定实例的值上
```cs
//DateTime结构的AddDays方法
DateTime dt = DateTine.Now;
DateTime result = dt.AddDays(30);
//Calender类的AddDays方法
Calendar cal = CultureInfo.InvariantCulture.Calendar;
DataTime dtresult = cal.AddDays(dt, 10);
```
<!--more-->
#### Compare方法
用于全面比较两个字符串对象
* Compare方法各个参数说明
    | 参数 | 描述 |
    | :------: | :------: |
    | strA和strB | 待比较的两个字符串 |
    | ignorCase | 指定是否忽略大小写 |
    | indexA和indexB | 需要比较两个字符串中的子串时,indexA和indexB为strA和strB中子字符串的起始位置 |
    | length | 待比较字符串的最大长度 |
    | culture | 字符串的区域信息 |
* Compare返回值说明
    | 参数条件 | 返回值 |
    | :------: | :------: |
    | strA大于strB | 负整数 |
    | strA小于strB | 正整数 |
    | strA等于strB | 0 |
* 示例
    ```cs
    int i = String.Compare("A","B");
    ```
#### CompareTo方法
用于将当前字符串对象与另一个字符串对象做比较
```cs
String StrA = "Caty"
int result = StrA.CompareTo("chchaty");
```
#### DateDiff方法
用于获取日期时间的间隔数
* 参数说明
    | 参数 | 描述 |
    | :------: | :------: |
    | Interval | DateInterval枚举值或String表达式,表示要用做Date1和Date2之差的单位的时间间隔 |
    | Date1 | 要用于计算的第1个日期/时间 |
    | Date2 | 要用于计算的第2个日期/时间 |
    | DayOfWeek | 用于指定一周的第一天,默认星期天 |
    | WeekOfYear | 用于指定一年的第一周,默认一月一号 |
    | 返回值 | 返回一个Long值,用于指定两个Date值之间的时间间隔数 |
* 示例
    ```cs
    DateTime dt = DateTine.Now;
    DateTime result = dt.AddDays(30);
    long dat = DateAndTime.DateDiff("s", dt, result, FirstDayOfWeek.Sunday, FirstWeekOfYear.FirstFourDays);
    ```
#### Equals方法
用于确定两个String对象是否具有相同的值
 * StringComparison枚举值说明
    | 枚举值 | 描述 |
    | :------: | :------: |
    | CurrentCulture | 使用区域敏感排序规则和当前区域比较字符串 |
    | CurrentCultureIgnoreCase | 使用区域敏感排序规则和当前区域比较字符串,忽略大小写 |
    | InvariantCulture | 使用区域敏感排序规则和固定区域比较字符串 |
    | InvariantCultureIgnoreCase | 使用区域敏感排序规则和固定区域比较字符串,忽略大小写 |
    | Ordinal | 使用序号排序规则比较字符串 |
    | OrdinalIgnoreCase | 使用序号排序规则比较字符串,忽略大小写 |
 * 示例
    ```cs
    bool result = string.Equals("hello","HELLO",StringComparison.OrdinalIgnoreCase);
    string a = "Caty"
    bool result = a.Equals("caty");
    ```
#### Format方法
将指定的String中的格式项替换为指定的Object实例的值的文本等效项
```cs
string str = string.Format("{0}","Caty");
object[] obj = new object[] { "C#", ".Net"};
string str = string.Format(Culture.CurrentCulture, "$123456", obj);
```
#### GetDayOfWeek方法
用于返回指定DateTime中的日期是星期几
```cs
DateTime dt = new DateTime(2011,4,1,new GregorianCalendar());
Calendar cal = CultureInfo.InvariantCulture.Calendar;
string str = cal.GetDayOfWeek(dt);
```
#### GetMonth方法
用于返回指定日期中的月份
```cs
DateTime dt = new DateTime(2011,4,1,new GregorianCalendar());
Calendar cal = CultureInfo.InvariantCulture.Calendar;
int i = cal.GetMonth(dt);
```
#### GetYear方法
用于返回指定日期中的年份
```cs
DateTime dt = new DateTime(2011,4,1,new GregorianCalendar());
Calendar cal = CultureInfo.InvariantCulture.Calendar;
int i = cal.GetYear(dt);
```
#### GetMonthsInYear方法
用于返回指定年份中的月数
```cs
DateTime dt = new DateTime(2011,4,1,new GregorianCalendar());
Calendar cal = CultureInfo.InvariantCulture.Calendar;
int i = cal.GetMonthsInYear(cal.GetYear(dt));
```
#### GetText方法
用于检索文本数据
 * TextDataFormat的枚举值说明
    | 枚举值 | 描述 |
    | :------: | :------: |
    | Text | 指定标准的ANSI文本格式 |
    | UnicodeText | 指定标准的Windows Unicode文本格式 |
    | Rtf | 指定有RTF数据组成的文本 |
    | Html | 指定有HTML数据组成的文本 |
    | CommaSeparatedValue | 指定以逗号分隔值的格式 |
 * 示例
    ```cs
    string str = Clipboard.GetText();
    ```
#### IndexOf方法
用于确定指定字符串在字符串中的索引
```cs
string str = "caty"
int a = str.IndexOf('c');
int b = str.IndexOf("at",1,2);//从第二个字符开始搜索,,搜索两个字符数
```
#### IsLeapYear方法
用于判断年份是否为闰年
```cs
int resullt = DateTime.IsLeapYear(2014);
```
#### IsMatch方法
用于验证输入字符是否与正则表达式相匹配
```cs
string str = "caty";
bool result = Regex.IsMatch(str,@"^.{8,}$");
```
#### IsUpper方法
用于判断指定字符串中指定位置的字符是否大写
```cs
bool result = char.IsUpper("Caty",0);
```
#### Join方法
用于在指定String数组的每个元素之间串联指定的分隔符String,从而产生单个串联的字符串
```cs
string [] arr = new string[5] { "1", "2", "3", "4"," 5" };
string result = String.Join(",",arr);
```
#### LastIndexOf方法
用于确定指定字符在字符串中最后一次出现的索引位置
```cs
string str = "ChCaty";
int result = str.LastIndexOf("C");
```
