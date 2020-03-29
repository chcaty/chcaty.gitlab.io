---
title: WPF基础学习(一)
date: 2020-03-29 11:19:45
categories: .Net
tags:
 - .Net
 - WPF
---
> 作者：Peter Luo 出处：https://www.cnblogs.com/Peter-Luo/

### 属性验证

在定义任何类型的属性时,都需要面对错误设置属性的可能性.
<!--more-->

WPF提供了两种方法来阻止非法值

* ValidateValueCallback:该回调函数可接受或拒绝新值.通常,该回调函数用于捕获违反属性约束的明显错误.可作为DependencyProperty.Register()方法的一个参数提供该回调函数.
* CoerceValueCallback:该回调函数可将新值修改为更能被接受的值.该回调函数通常用于处理为相同对象设置的依赖项属性值相互冲突的问题.这些值本身可能是合法的,但当同时应用时它们是不相容的.为了使用这个回调函数,当创建FrameworkPropertyMetadata对象时(然后该对象将被传递到DependencyProperty.Register()方法),作为构造函数的一个参数提供该回调函数.

#### 验证回调

验证通常应被添加到属性过程的设置部分.提供的回调函数必须指向一个接受对象参数并返回Boolean值得方法.返回true以接受对象是合法的,返回false拒绝对象.

对于验证回调函数有一个限制:它们必须是静态方法而且无权访问正在被验证的对象.所有能够获得的信息只有刚刚应用的数值.尽管这样更便于重用属性,但可能无法创建考虑其他属性的验证例程.

#### 强制回调

可以通过CoerceValueCallback回调函数处理相互关联的属性.例如,ScrollBar控件提供了Maximum、Minimum和Value属性,这些属性都继承自RangeBase类.保持对这些属性进行调整的一种方法是使用属性强制.

### 路由事件

事件路由允许源自某个元素的事件由另一个元素引发.例如,使用事件路由,来自工具栏按钮的单击事件可在被代码处理之前上传到工具栏,然后上传到包含工具栏的窗口.

#### 定义、注册和封装事件

WPF事件模型和WPF属性模型非常类似.与依赖项属性一样,路由事件由只读的静态字段表示,在静态构造函数中注册,并通过标准的.NET事件定义进行封装.

```cs
public abstract class ButtonBase:ContentControl,...
{
    public static readonly RoutedEvent ClickEvent;
    static ButtonBase()
    {
        ButtonBase.ClickEvent=EventManager.RegisterRoutedEvent("Click",RoutingStrategy.Bubble,typeof(RoutedEventHandler),typeof(ButtonBase));
        ...
    }

    public event RoutedEventHandler Click
    {
        add
        {
            base.AddHandler(ButtonBase.ClickEvent,value);
        }
        remove
        {
            base.RemoveHandler(ButtonBase.ClickEvent,value);
        }
    }
    ...
}
```

路由事件是使用EvenetManager.RegisterRoutedEvent()方法注册的.当注册事件时,需要制定事件的名称、路由类型、定义事件处理程序语法的委托以及拥有事件的类.

事件封装器可使用AddHandler()和RemoveHandler()方法添加和删除已注册的调用程序,这两个方法都在FrameworkElement基类中定义,并被每个WPF元素继承.

#### 共享路由事件

与依赖项属性一样,可在类之间共享路由事件的定义.通过Routed-Event.AddOwner()方法重用事件.

#### 引发路由事件

RaiseEvent()方法负责为每个已经通过AddHandler()方法注册的调用程序引发事件.因为AddHandler()方法是公有的,所有调用程序可访问该方法——他们能够通过直接调用AddHandler()方法注册他们自己,也可以使用事件封装器.无论使用哪种方法,当调用RaiseEvent()方法时都会通知他们.

所有WPF事件都为事件签名使用熟悉的.NET约定.每个事件处理程序的第一个参数(sender参数）都提供引发该事件的对象的引用.第二个参数是EventArgs对象,该对象与其他所有可能很重要的附加细节绑定在一起.

在WPF中,如果事件不需要传递任何额外细节,可使用RoutedEventArgs类,该类包含了有关如何传递事件的一些细节.如果事件确实需要传递额外的信息,那么需要使用更特殊的继承自RoutedEventArgs的对象.因为每个WPF事件参数都继承自RoutedEventArgs类,所以每个WPF事件处理程序都可访问与事件路由相关的信息.

#### 处理路由事件

可以使用多种方法关联事件处理程序

* 为XAML标记添加事件特性.事件特性按照想要处理的事件命名,它的值就是事件处理程序方法的名称.

    ```cs
    <Image Source="a.jpg" Stretch="None" Name="img" MouseUp="img_MouseUp" />
    ```

* 使用代码连接事件

    ```cs
    img.MouseUp+=new MouseButtonEventHandler(img_MouseUp);
    // img.MouseUp+=img_MouseUp;
    ```

* 自行通过调用UIElement.AddHandler()方法直接连接事件

    ```cs
    img.AddHandler(Image.MouseUpEvent,new MouseButtonEventHandler(img_MouseUp));
    ```

断开事件处理程序

* 使用-=运算符

    ```cs
    img.MouseUp -=img_MouseUp;
    ```

* 使用UIElement.RemoveHandler()

    ```cs
    img.RemoveHandler(UIElment.MouseUpEvent,new MouseButtonEventHandler(img_MouseUp));
    ```
