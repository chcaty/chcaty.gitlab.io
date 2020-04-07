---
title: WPF基础学习(一)
date: 2020-03-28 11:19:45
categories: .Net
tags:
 - .Net
 - WPF
---
> 作者：Peter Luo 出处：https://www.cnblogs.com/Peter-Luo/

### XAML基础

#### WPF应用程序的顶级元素如下

* Windo元素
* Page元素(用于可导航的应用程序)
* Application元素(用于定于应用程序资源和启动设置)

#### 名称空间

* http://schemas.microsoft.com/winfx/2006/xaml/presentation 是WPF核心名称空间.它包含了所有WPF类,包括用来构建用户界面的控件.如果没有使用名称空间前缀,那么它成为整个文档的默认名称空间.换句话说,除非另外指明,每个元素自动位于这个名称空间.

* http://schemas.microsoft.com/winfx/2006/xaml 是XAML名称空间.它包含各种XAML使用特性,这些特性可影响文档的解释方式.该名称空间被映射为前缀x.这意味着可通过在元素名称之前放置名称空间前缀x来使用该名称空间(例如<x:ElementName>).
<!--more-->
#### 代码隐藏类

可通过XAML构造用户界面,但为了使应用程序具有一定的功能,就需要用于连接包含应用程序代码的事件处理程序的方法.XAML通过使用如下所示的Class特性简化了这个问题：

```cs
    <Window x:Class="WpfApplication1.MainWindow">
```

在XAML名称空间的Class特性之前放置了名称空间前缀x,意味着这是XAML语言中更通用的部分.实际上,Class特性告诉XAML解析器用指定的名称生成一个新类.该类继承自由XML元素命名的类.换句话说,该实例创建了一个名为MainWindow的新类,该类继承自Window基类.

### XAML属性

#### 标记扩展

标记扩展使用{标记扩展类 参数}语法,如

```cs
<Button Background="{x:Static SystemColors.ActiveCaptionBrush}"/>
```

所有标记扩展都由继承自System.Windows.MarkupExtension基类地类实现.MarkupExtension基类十分简单,提供了一个简单的ProvideValue()方法类获取所期望的数值.

#### 附加属性

附加属性始终使用包含两个部分的命名格式:定义类型.属性名.

附加属性根本不是真正的属性.它们实际上被转换为方法调用.

#### 特殊字符与空白

特殊字符|实体字符
:-|:-|
<|&lt ;
>|&gt ;
&|&amp ;
"|&quot ;

如果希望在文本中包含一系列空格.在这种情况下,需要为元素使用xml:space="preserve"特性,

xml:space特性是XML标准的一部分,是一个要么包括全部、要么什么都不包括的设置.一旦使用了该设置,元素内的所有空字符串都将被保留.

### 使用其他名称空间中的类型

为使用未在WPF名称空间中定义的类.需要将.NET名称空间映射到XML名称空间.XAML有一种特殊的语法可用于完成这一工作,该语法如下所示:

```cs
　　xmlns:Prefix="clr-namespace:Namespace;assembly=AssemblyName"
```

　　通常,在XAML文档的根元素中,在紧随声明WPF和XAML名称空间的特性之后放置这个名称空间.还需要使用适当的信息填充三个斜体部分,这三部分的含义如下：

* Prefix是希望在XAML标记中用于指示名称空间的XML前缀.例如,XAML语法使用x前缀.
* Namespace是完全限定的.NET名称空间的名称.
* AssemblyName是声明类型的程序集,没有.dll扩张名.这个程序集必须在项目中引用.如果希望使用项目程序集,可以忽略这一部分.

### 加载和编译XAML

可使用三种不同的编码方式来创建WPF应用程序：

* 只使用代码.这是在Visual Studio中为Windows窗体应用程序使用的传统方法.它通过代码语句生成用户界面.
* 使用代码和未经编译的标记(XAML).这种具体方式对于某些特殊情况是很有意义的,例如创建高度动态化的用户界面.这种方式在运行时使用System.Windows.Markup名称空间中的XamlReader类,从XAML文件中加载部分用户界面.
* 使用代码和编译过的标记(BAML).对于WPF而言这是一种更好的方式,也是Visual Studio支持的一种方式.这种方式为每个窗口创建了一个XAML模板,这个XAML模板被编译为BAML,并嵌入到最终的程序集中.编译过的BAML在运行时被提取出来,用于重新生成用户界面

### WPF的布局

"理想的"WPF窗口需要遵循以下几条重要原则：

* 不应显示设定元素(如控件)的尺寸.元素应当可以改变尺寸以适合它们的内容.例如,当添加更多的文本时按钮应当能够扩展.可通过设置最大和最小尺寸来限制可以接受的控件尺寸范围.
* 不应使用屏幕坐标指定元素的位置.元素应当由它们的容器根据它们的尺寸、顺序以及(可选的)其他特定与具体布局容器的信息进行排列.如果需要在元素之间添加空白空间,可使用Margin属性.
* 布局容器的子元素“共享”可用的空间.如果空间允许,布局容器会根据每个元素的内容尽可能为元素设置更合理得尺寸.它们还会向一个或多个子元素分配多余的空间.
* 可嵌套的布局容器.典型的用户界面使用Grid面板作为开始,Grid面板是WPF中功能最强大的容器,Grid面板可包含其他布局容器,包含的这些容器以最小的分组排列元素,比如带有标题的文本框、列表框中的项、工具栏上的图标以及一列按钮等.

Panel的公有属性

名称|说明
:-|:-
Backgroup|该属性用于面板背景着色.如果想要接收鼠标事件,就必须将属性设置为非空值(如果想接收鼠标事件,又不希望显示固定颜色的背景,那么只需要将背景色设置为透明即可)
Children|该属性是在面板中存储的条目集合.这是第一级条目--换句话说,这些条目自身也可以包含更多的条目.
IsItemsHost|该属性是一个布尔值,如果面板用于显示与ItemsControl控件关联的项(例如,TreeView控件中的节点或列表框中的列表项),该属性值为true.在大多数情况下,设置不需要知道列表控件使用后台面板来管理它所包含的条目的布局.但如果希望创建自定义的列表,以不同方式防止子元素(例如,以平布方式显示图像的ListBox控件),该细节就变得很重要.

核心布局面板
名称|说明
:-|:-
StackPanel|在水平或垂直的堆栈中放置元素.这个布局容器通常用于更大、更复杂窗口的一些小区域.
WrapPanel|在一系列可换行的行中放置元素,在水平方向上,WrapPanel面板从左向右放置条目,然后在随后的行中放置元素,在垂直方向上,WrapPanel面板在自上而下的列中放置元素,并使用附件的列放置剩余的条目.
DockPanel|根据容器上的整体边界调整元素
Grid|根据不可见的表格在行和列中排列元素,这是最灵活、最常用的容器之一.
UniformGrid|在不可见但是强制所有单元格具有相同尺寸的表中放置元素,这个布局容器不常用.
Canvas|使用固定坐标绝对定位元素.这个布局与传统Windows窗体应用程序最相似,但没有提供锚定或停靠功能.因此,对于尺寸可变的窗体,该布局容器不是合适的选择.如果选择的话,需要另外做一些工作.

### StackPanel面板进行布局

StackPanel布局属性
名称|说明
:-|:-
HorizontalAlignment|当水平方向上有额外的空间时,该属性决定了子元素在布局容器中如何定位.可选用Center、Left、Right或Stretch等属性值
VerticalAlignment|当垂直方向上有额外的空间时,该属性决定了子元素在布局容器中如何定位.可选用Center、Top、Bottom或Stretch等属性值
Margin|该属性用于在元素的周围添加一定的空间.Margin属性是System.Windows.Thickness结构的一个实例,该结构具有分别用于顶部、底部、左边和右边添加空间的独立组件.
MinWidth和MinHeight|这两个属性用于设置元素的最小尺寸.如果一个元素对于其他布局容器来说太大,该元素将被剪裁以适合容器.
MaxWidth和MaxHeight|这两个属性用于设置元素的最大尺寸.如果有更多可以使用的空间,那么在扩展子元素时依旧不会超出这一限制,即使将HorizontalAlignment和VerticalAlignment属性设置为Stretch也同样如此.
Width和Height|这两个属性用来显式地设置元素的尺寸.这一设置会重写为HorizontalAlignment和VerticalAlignment属性设置的Stretch值.但不能超出MinWidth、MinHeight、MaxWidth和MaxHeight属性设置的范围.

Border控件
Border类非常简单.它只能包含一段嵌套内容(通常是布局面板),并为其添加背景或在其周围添加边框.

Border控件属性
名称|说明
:-|:-
Background|使用Brush对象设置边框中所有内容后面的背景.可使用固定颜色背景,也可使用其他更特殊的背景.
BorderBrush和BorderThickness|使用Brush对象设置位于Border对象边缘的边框的颜色,并设置边框的宽度.为显示边框,必须设置这两个属性
CornerRadius|该属性可使边框具有雅致的圆角.CornerRadius的值越大,圆角效果就越明显.
Padding|该属性在边框和内部的内容之间添加空间.

### WrapPanel和DockPanel面板

WrapPanel面板

WrapPanel面板在可能的空间中,以一次一行或一列的方式布置控件.默认情况下,WrapPanel.Orientation的属性设置为Horizontal;控件从左向右进行排列,再在下一行中排列.但可将WrapPenel.Orientation的属性设置为Vertical,从而在多个列中放置元素.

WrapPanel面板是唯一一个不能通过灵活使用Grid面板代替的面板.

DockPanel面板

DockPanel面板是更有趣的布局选项.它沿着一条外边缘来拉伸所包含的控件.理解该面板最简便的方式是,考虑一下位于许多Windows应用程序窗口顶部的工具栏,这些工具栏停靠到窗口顶部.与StackPanel面板类似,被停靠的元素选择它们的布局的一方面.

通过Dock附加属性,可将该属性设置为Left、Right、Top或Bottom.放在DockPanel面板中的每个元素都会自动捕获该属性.

### Grid面板

需要两个步骤来创建基于Grid面板的布局.首先,选择希望使用的行和列的数量.然后,为每个包含的元素指定恰当的行和列,从而在合适的位置放置元素.Grid面板通过使用对象Grid.ColumnDefinitions和Grid.RowDefinitions集合来创建网格和行.

#### 调整行和列

Grid面板支持以下三种设置尺寸的方式：

* 绝对设置尺寸方式.使用设备无关单位准确地设置尺寸.这是最无用的策略,因为这种策略不够灵活,难以适应内容大小和容器大小的改变,而且难以处理本地化.

    ```cs
    <ColumnDefinition Width="100"></ColumnDefinition>
    ````

* 自动设置尺寸方式.每行和每列的尺寸刚好满足需要.这是最有用的尺寸设置方式.

    ```cs
    <ColumnDefinition Width="Auto"></ColumnDefinition>
    ````

* 按比例设置尺寸方式.按比例将空间分割到一组行和列中.这是对所有行和列的标准设置.

    ```cs
    <ColumnDefinition Width="*"></ColumnDefinition>
    ```

#### 布局舍入

将布局容器的UseLayouyRounding属性设置为true,WPF会确保布局容器中的所有内容对齐到最近的像素边界,从而消除了所有模糊问题.

#### 跨越行和列

使用两个附加属性使元素跨越多个单元格,这两个附加属性是RowSpan和ColumnSpan.这两个属性使用元素将会占有的行数和列数进行设置.

#### 分割窗口

在WPF中,分隔条由GridSplitter类表示,它是Grid面板的功能之一.通过为Grid面板添加GridSplitter对象,用户就可以改变行和列的尺寸.

大多数开发人员认为WPF中的GridSplitter类不是最直观的.理解如何使用GridSplitter类,从而得到所期望的效果需要一定的经验.下面列出几条指导原则：

* GridSplitter对象必须放在Grid单元格中.可与已经存在的内容一并放到单元格中,这时需要调整边距设置,并将预留行或列的Height或Width属性的值设置为Auto.
* GridSplitter对象总是改变整行或整列的尺寸(而非改变单个单元格的尺寸).为使GridSplitter对象的外观和行为保持一致,需要拉伸GridSplitter对象使其穿越整行或整列,而不是将其限制在单元格中.为此,可使用前面介绍过的RowSpan或ColumnSpan属性.
* 最初,GridSplitter对象很小不易看见.为了使其更可用,需要哦为其设置最小尺寸.对于竖直分隔条,需要将VerticalAlignment属性设置为Stretch(使分隔条填满区域的整个高度),并将Width设置为固定值.对于水平分隔条,需要设置HorizontalAlignment属性来拉伸,并将Height属性设置为固定值.
* GridSplitter对齐方式还决定了分隔条是水平的(用于改变行的尺寸)还是竖直的(用于改变列的尺寸).对于水平分隔条,需要将VerticalAlignment属性设置为Center(这也是默认值),以指明拖动分隔条改变上面行和下面行的尺寸.对于竖直分隔条,需要将HorizontalAlignment属性设置为Center,以改变分隔条两侧列的尺寸.

#### 共享尺寸组

共享尺寸组的目标是保持用户界面独立部分的一致性.例如,可能希望该表一列的尺寸以适应其内容,并改变另一列的尺寸使其与前面一列改变后的尺寸相匹配.共享尺寸组的真正有点是使独立的Grid控件具有相同的比例.

通过Grid.IsSharedSizeScope="True"启动共享尺寸组,在需要共享ColumnDefinition上设置相同的SharedSizeGroup,即可实现共享.

#### UniformGrid面板

UniformGrid面板不需要(甚至不支持)预先定义的列和行.相反,通过简单地设置Rows和Columns属性来设置其尺寸.每个单元格始终具有相同的大小,因为可用的空间被均分.最后,元素根据定义的顺序被放置到适当的单元格中.UniformGrid面板中没有Row和Column附加属性,也没有空白单元格.

### Canvas面板

Canvas面板只是在指定的位置放置其子元素,并且子元素具有所希望的精确尺寸.

在Canvas面板中定位元素,需要设置Canvas.Left和Canvas.Top附加属性.Canvas.Left属性设置元素左边和Canvas面板左边之间的单位数.Canvas.Top属性设置子元素顶部和Canvas面板顶边之间的单位数.

可使用Width和Height属性明确设置子元素的尺寸.如果没有设置Width和Height属性,元素会获取它所期望的尺寸——换句话说,它将变得足够大以适应其内容.

#### Z顺序

如果Canvas面板中有多个互相重叠的元素,可通过设置Canvas.ZIndex附加属性来控制他们的层叠方式.

添加的所有元素通常都具有相同的ZIndex指——0.如果元素具有相同的ZIndex值,就按他们在Canvas.Children集合中的顺序进行显示,这个顺序依赖于元素在XAML标记中定义的顺序.在标记靠后位置声明的元素会显示在前面声明的元素的上面.

### InkCanvas元素

InkCanvas元素的主要目的用于接收手写笔输入.手写笔是一种在平板PC中使用的类似钢笔的输入设备,然而,InkCanvas元素同时也可使用鼠标进行工作,就像使用手写笔一样.因此,用户可使用鼠标在InkCanvas元素上绘制线条,或者选择以及操作InkCanvas中的元素.

InkCanvas元素实际上包含两个子内容集合.一个是为人熟知的Children集合,它保存任意元素,就像Canvas面板一样.每个子元素可根据Top、Left、Bottom和Right属性进行定位.另一个是Strokes结合,它保存System.Windows.Ink.Stroke对象,该对象表示用户在InkCanvas元素上绘制的图形输入.用户绘制的每条直线或曲线都变成独立的Stroke对象.得益于这两个集合,可使用InkCanvas让用户使用存储在Strokes集合中的笔画(Stroke)为保存在Children集合中的内容添加注释.

根据为InkCanvas.EditingMode属性设置的值,可以采用截然不同的方式使用InkCanvas元素,下表列出了所有选项:

名称|说明
:-|:-
Ink|InkCanvas元素允许用户绘制批注,这是默认模式.当用户用鼠标或手写笔绘图时,会绘制笔画.
GestureOnly|InkCanvas元素不允许用户绘制笔画批注,但会关注预先定义的特定姿势(例如在某个方向拖动手写笔或涂画内容).能识别的姿势的完整列表由System.Windows.Ink.ApplicationGesture枚举给出.
InkAndGesture|InkCanvas元素允许用户绘制笔画批注,也可以识别预先定义的姿势.
EraseByStroke|用单击笔画时,InkCanvas元素会擦除笔画.如果用户使用手写笔,可使用手写笔的底端切换到该模(可使用只读的ActiveEditingMode属性确定当前编辑模式,也可通过改变EditingModeInverted属性来改变手写笔的底端使用的工作模式)
EraseByPoint|当单击笔画时,InkCanvas元素会擦除笔画中呗单击的部分(笔画上的一个点)
Select|InkCanvas面板允许用户选择保存在Childeren集合中的元素.要选择一个元素,用户必须单击该元素或拖动"套索"选择该元素.一旦选择一个元素,就可以移动该元素、改变其尺寸或将其删除
None|InkCanvas元素忽略鼠标和手写笔输入
　　
InkCanvas元素会引发多种事件,当编辑模式改变时会引发ActiveEditingModeChanged事件,在GestureOnly或InkAndGesture模式下删除姿势时会引发Gesture事件,在Select模式下选择元素或改变元素时会引发SelectionChanging事件、SelectionChanged事件、SelectionMoving事件、SelectionMoved事件、SelectionResizing事件和SelectionResized事件.其中,名称以"ing"结尾的事件表示动作将要发生,但可以通过设置EventArgs对象的Cancel属性取消事件.

### 理解依赖项属性

#### 定义依赖项属性

第一步是定义表示属性的对象,它是DependencyProperty类的实例.属性信息应该始终保持可用,甚至可能需要在多个类之间共享这些信息(在WPF元素中这是十分普遍的).因此,必须将DependencyProperty对象为与其相关联的类的静态字段.

```cs
public class FrameworkElement:UIElement
{
    public static readonly DependencyProperty MaraginProperty;
}
```

根据约定,定义依赖项属性的字段的名称是在普遍属性的末尾处加上单词"Property".根据这种命名方式,可从实际属性的名称中区分出依赖项属性的定义.字段的定义使用了readonly关键字,这意味着只能在FrameworkElement类的静态构造函数中对其进行设置.

#### 注册依赖项属性

WPF确保DependencyProperty对象不能被直接实例化,因为DependencyProperty类没有公有的构造函数.相反,只能使用静态的DependencyProperty.Register()方法创建DependencyProperty实例.WPF还确保在创建DependencyProperty对象后不能改变该对象,因为所有DependencyProperty成员都是只读的.它们的值必须作为Register()方法的参数来提供.

```cs
static FrameworkElement()
{
    FrameworkPropertyMetadata metadata = new FrameworkPropertyMetadata(new Thickness(), FrameworkPropertyMetadataOptions.AffectsMeasure);

    MarginProperty = DependencyProperty.Register("Margin", typeof(Thickness), typeof(FrameworkElement), metadata, new ValidateValueCallback(FrameworkElement.IsMarginValid));
}
```

注册依赖项属性需要经历两个步骤:首先创建FrameworkPropertyMetadata对象,该对象指示希望通过依赖项属性使用什么服务(如支持数据库绑定、动画以及日志).接下来通过调用DependencyProperty.Register()静态方法注册属性.在这一步骤中,你负责提供以下几个要素：

* 属性名(在该例中为Margin)
* 属性使用的数据类型(在该例中为Thickness结构)
* 拥有该属性的类型(在该例中为FrameworkElement类)
* 一个具有附加属性设置的FrameworkPropertyMetadata对象,该要素是可选的.
* 一个用于验证属性的回调函数,该要素是可选的.

FrameworkPropertyMetadata类的所有属性

名称|说明
:-|:-
AffectsArrange、AffectsMeasure、AffectsParentArrange和AffectsParentMeasure|如果为true,依赖项属性会影响在布局操作的测量过程和排列过程中如何放置相邻的元素或父元素.例如,Margin依赖项属性将AffectsMeasure属性设置为true,表面如果一个元素的边距发生变化,那么布局容器需要重新执行测量步骤以确定元素新的布局.
AffectsRender|如果为true,依赖项属性会对元素的绘制方式造成一定的影响,要求重新绘制元素.
BindsTwoWayByDefault|如果为true,默认情况下,依赖项属性将使用双向数据绑定而不是单向数据绑定.不过,当创建数据绑定时,可以明确指定所需的绑定行为.
Inherits|如果为true,就通过元素树传播该依赖项属性值,并且可以被嵌套的元素继承.例如,Font属性是可继承的依赖项属性.如果在更高层次的元素中为Font属性设置了值,那么该属性值就会被嵌套的元素继承(除非使用自己的字体设置明确地覆盖继承而来的值).
IsAnimationProhibited|如果为true,就不能将依赖项属性用于动画.
IsNotDataBindale|如果为true,就不能使用绑定表达式设置依赖项属性.
Journal|如果为true,在基于页面的应用程序中,依赖项属性将会被保存到日志(浏览过的页面的历史记录)中.
SubPropertiesDoNotAffectRender|如果为true,并且对象的某个子属性(属性的属性)发生了变化,WPF将不会重新渲染该对象.
DafaultUpdateSourceTrigger|当该属性用于绑定表达式,该属性用于Binding.UpdateSourceTrigger属性设置默认值.UpdateSourceTrigger属性决定了数据绑定值在何时应用自身的变化.当创建绑定时,可以手动设置UpdateSourceTrigger属性.
DefaultValue|该属性用于依赖项属性设置默认值.
CoerceValueCallback|该属性提供了一个回调函数,用于验证依赖项属性之前尝试"纠正"属性值.
PropertyChangedCallback|该属性提供了一个回调函数,当依赖项属性的值变化时调用该回调函数.

#### 添加属性包装器

创建依赖项属性的最后一个步骤就是使用传统的.NET属性封装WPF依赖项属性.但典型的属性过程是检索或设置某个私有字段的值,而WPF属性的属性过程是使用在DependencyObject基类中定义的GetValue()和SetValue()方法.

```cs
public Thickness Margin
{
    get{ return (Thickness)GetValue(MarginProperty); }
    set{ SetValue(MarginProperty, value); }
}
```

删除本地值设置,并像从来没有设置过那样确定属性值.需要使用另外一个继承自DependencyObject类的方法:ClearValue().

```cs
myElement.ClearValue(FrameworkElement.MarginProperty);
```

依赖项属性依赖于多个属性提供者,每个提供者都有各自的优先级.当从属性检索值时,WPF属性系统会通过一系列步骤获取最终值.首先通过考虑以下因素(按优先级从低到高的顺序排列)来决定基本值(base value):

* 默认值(由FrameworkPropertyMetadata对象设置的值).
* 继承而来的值(假设设置了FrameworkPropertyMetadata.Inherits标志,并为包含层次中的某个元素提供了值).
* 来自主题样式的值.
* 来自项目样式的值.
* 本地值(使用代码或XAML直接为对象设置的值).

WPF决定属性值得四步骤过程:

1. 确定基本值.
2. 如果属性是使用表达式设置的,就对表达式进行求值.当前,WPF支持两类表达式:数据绑定和资源.
3. 如果属性是动画的目标,就应用动画.
4. 运动CoerceValueCallback回调函数来修正属性值.

#### 共享的依赖项属性

尽管一些类具有不同的继承层次,但他们回共享同一依赖项属性.例如,TextBlock.FontFamily属性和Control.FontFamily属性指向同一个静态的依赖项属性,该属性实际上是在TextElement类中定义的TextElement.FontFamilyProperty依赖项属性.TextElement类的静态构造函数注册该函数,而TextBlock类和Control类的静态构造函数只是通过调用DependencyProperty.AddOwner()方法重用该属性.

```cs
TextBlock.FontFamilyProperty = TextElement.FontFamilyProperty.AddOwner(typeof(TextBlock));
```

可以使用相同的基础来创建自己的自定义类(假定在所继承的父类中还没有提供属性,否则直接重用即可）.还可以使用重载的AddOwner()方法来提供验证回调函数以及仅应用于依赖项属性用法的新FrameworkPropertyMetadata对象.

#### 附加的依赖项属性

加属性是一种依赖项属性,由WPF属性系统管理.不同之处在于附加属性被应用到的类并非定义附加属性的那个类.例如,Grid类定义了Row和Column附加属性,这两个属性被用于设置Grid面板包含的元素,以指明这些元素应被放到哪个单元格中.

　为了定义附加属性,需要使用RegisterAttached()方法,而不是使用Register()方法.

```cs
FrameworkPropertyMetadata metadata=new FrameworkPropertyMetadata(0,new PropertyChangedCallback(Grid.OnCellAttachedPropertyChanged));
Grid.RowProperty=DependencyProperty.RegisterAttached("Row",typeof(int),typeof(Grid),metadata,new ValidateValueCallback(Grid.IsIntValueNotNegative));
```

当创建附加属性时,不必定义.NET属性封装器.这是因为附加属性可以被用于任何依赖对象.

附加属性需要调用两个静态方法来设置和获取属性值,这两个方法使用了为人熟知的SetValue()和GetValue()方法(继承自DependencyObject类).这两个静态方法应当命名为SetPropertyName()和GetPropertyName().
