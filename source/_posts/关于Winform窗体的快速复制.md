---
title: 关于Winform窗体的快速复制
date: 2019-03-21 22:55:57
categories: C# 
tags: 
 - 复制
 - C#
---
## 起因
最近接手了一个新项目的开发,里面有很多窗体都是直接从其他项目上复制过来的,或者创建一个以后,可以复制成用于不用的需求,这时候就会涉及到winform窗体的复制了,下面分享自己的经验
<!--more-->
## 项目中不存在同名窗体
直接复制窗体对应的cs、designer.cs、resx的三个文件到对应的目录,在VS中直接添加现有项目,选择cs文件,将窗体添加到项目中,然后修改命名空间就可以了.

## 项目中已存在同名窗体
* 重命名cs、designer.cs、resx三个文件
* 打开窗体代码，修改public partial class XXXX : Form中的XXXX为新窗体类名YYYY。
* 重要：窗体初始化模块中的XXXX也相应修改为YYYY
    ``` cs
    public XXXX()
    {
        InitializeComponent();
    }
    ```
* 异常重要：
    打开窗体设计器代码YYYY.Designer.cs，修改partial class XXXX : Form 中的XXXX为新窗体类名YYYY。
* 更重要而不易找到的问题： 
    修改private void InitializeComponent() 中System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(XXXX))一行中的XXXX为YYYY；