---
title: CSharp-利用委托解决跨线程操作控件产生的问题
date: 2018-03-14 22:47:19
categories: C# 
tags: 
 - 委托
 - winform
 - C#
---
```cs
private delegate void AddVirus(string name);  
//声明一个委托。当然AddVirus是什么都可以，自己取。括号内的参数也根据实际情况自己决定  
void SearchVirus(string path)  
{  
    if (VirusList.InvokeRequired)//判断VirusList这个控件是不是该线程创建的，如果为true则不是  
    {  
    AddVirus add = new AddVirus(SearchVirus);//实例化委托  
    VirusList.Invoke(add, path);//重新调用  
    }  
    else  
    {  
    VirusList.Items.Add(filename);//如果VirusList是该线程创建的，则执行添加操作  
    }  
}  
```
