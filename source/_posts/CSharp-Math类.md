---
title: 'CSharp-Math类'
date: 2019-04-02 22:27:45
categories: C# 
tags: 
 - 基础
 - C#
---
### Math类
#### Abs方法
用于返回指定数字的绝对值
```csharp
int a = -957;
int b  = Math.Abs(a);
```
<!--more-->
#### Acos方法
用于返回余弦值为指定数字的角度
```cs
double d = 0.5;
double m = Math.Acos(d);
```
#### Asin方法
用于返回正弦值的指定数字的角度
```cs
double d = 0.75;
double m  = Math.Asin(d);
```
#### Atan方法
用于返回正切值的指定数字的角度
```cs
double d = 0.75;
double m  = Math.Atan(d);
```
#### Pow方法
用于返回指定数字的指定次幂
```cs
double d = Match.Pow(2,3);//表示2的3次幂
```
#### Round方法
用于将值舍入到最接近的整数或指定的小数位数
```cs
//将小数值舍入最接近的整数
double d = Math.Round(2.44);//decimal/double
//将小数值舍入到指定精度
d = Math.Round(2.44,2);//decimal/double,int
//将小数值舍入最接近的整数
d = Math.Round(2.44,MidpointRounding.ToEven);//ToEven 舍入最接近的偶数;AwayFromZero 舍入绝对值较小的值
d = Math.Round(2.44,2,MidpointRounding.ToEven);
```