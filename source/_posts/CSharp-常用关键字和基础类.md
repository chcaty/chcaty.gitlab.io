---
title: 'CSharp-常用关键字和基础类'
date: 2019-03-30 23:41:06
categories: C#
tags:
 - C#
 - 基础
---
#### abstract关键字-抽象类
abstract 关键字可以和类，属性，方法，索引器以及事件一起使用。在类声明中使用abstract关键字以指示某个类只能是其他类的基类
<!--more-->
##### 特性
* 抽象类不能实例化
* 抽象类可以包含抽象方法和抽象访问器
* 抽象类不能被继承
* 从抽象类派生的非抽象类必须包括继承的所有抽象方法和抽象访问器的实现

#### base关键字-从派生类中访问基类的成员
base关键字用于从派生类中访问基类的成员
##### 使用范围
* 调用基类上已被其他方法重写的方法
* 指定创建派生类实例时应调用的基类基类构造函数

#### Console类-控制台中的输入流，输出流和错误流
Console类表示控制台应用程序的标准输入流。输出流和错误流，无法继承此类
##### 属性
| 属性 | 描述 |
| :------: | :------: |
| ForeGroundColor | 获取或设置控制台的前景色 |
| BackgroundColor | 获取或设置控制台的背景色 |
| BufferHeight | 获取或设置缓冲区高度 |
| BufferWidth | 获取或设置缓冲区宽度 |
| CapsLock | 获取一个值，该值指示CapsLock键盘切换键是打开的还是关闭的 |
| NumberLock | 获取一个值，该值指示NumLock键盘切换键是打开的还是关闭的 |
| KeyAvailable | 获取一个值，该值指示按键操作在输入流是否可用 |
| CursorTop | 获取或设置光标在缓冲区中的行位置 |
| CursorLeft | 获取或设置光标在缓冲区中的列位置 |
| CursorSize | 获取或设置光标在字符单元格中的高度 |
| CursorVisible | 获取或设置光标是否可见 |
| In | 获取标准输入流 |
| Out | 获取标准输出流 |
| Error | 获取标准错误输出流 |
| InputEncoding | 获取或设置控制台用于读取输入的编码 |
| OutEncoding | 获取或设置控制台用于写入输出的编码 |
| LargestWindowHeight | 根据当前字体和屏幕分辨率获取控制台窗口可能有的最大行数 |
| LargestWindowWidth | 根据当前字体和屏幕分辨率获取控制台窗口可能有的最大列数 |
| Title | 获取或设置要显示在控制台标题栏中的标题 |
| TreatControlCAsInput | 获取或设置一个值，该值指示是将修改键【Control】和控制台键【C】的组合（Ctrl+C）视为普通输入，还是视为由操作系统处理的中断 |
| WindowHeight | 获取或设置控制台窗口区域的高度 |
| WindowWidth | 获取或设置控制台窗口区域的宽度 |
| WindowLeft | 获取或设置控制台窗口区域的最左边相对于屏幕缓冲区的位置 |
| WindowTop | 获取或设置控制台窗口区域的最顶部相对于屏幕缓冲区的位置 |
##### 方法
| 方法 | 描述 |
| :------: | :------: |
| Beep | 通过控制台扬声器播放提示音 |
| Clear | 清除控制台缓冲区和夏国英的控制台窗口的显示信息 |
| MoveBufferArea | 将屏幕缓冲区的制定源区域复制到指定的目标区域 |
| OpenStandarError | 获取标准错误流 |
| OpenStandarInput | 获取标准输入流 |
| OpenStandarOutput | 获取标注输出流 |
| Read | 从标准输入流读取下一个字符 |
| ReadKey | 获取用户按下的下一个字符或功能键 |
| ReadLine | 从标准输入流读取下一行字符 |
| ReadColor | 将控制台的前景色和背景色设置为默认值 |
| SetBufferSize | 将屏幕缓冲区的高度和宽度设置为指定值 |
| SetCursorPosition | 设置光标位置 |
| SetError | 将Error属性设置为指定TextWriter对象 |
| SetIn | 将In属性设置为指定TextWriter对象 |
| SetOut | 将Out属性设置为指定TextWriter对象 |
| SetWindowPosition | 设置控制台窗口相对于屏幕缓冲区的位置 |
| SetWindowSize | 将控制台窗口的高度和宽度设置为指定值 |
| Write | 将指定值的文本表示形式写入标准输出流 |
| WriteLine | 将指定的数据（后跟当前行终止符）表示形式写入标准输出流 |

#### Convert类-类型转换
Convert类用于将一个基本数据类型转换为另一个基本数据类型
##### 方法
| 方法 | 描述 |
| :------: | :------: |
| FromBase64CharArray | 将Unicode字符数组的子集转换成等效成等效的8位无符号整数数组，参数指定输入数组的子集及要转换的元素数 |
| FromBase64String | 将指定的String转换成等效成等效的8位无符号整数数组 |
| GetHashCode | 用作特定类型的哈希函数 |
| ToBase64CharArray | 将8位无符号整数数组的子集转换为用Base64数字编码的Unicode字符数组的等价子集 |
| ToBase64String | 将8位无符号整数数组的值转换为与其等效的String表示形式 |
| ToBoolean | 将指定的值转换为等效的布尔值 |
| ToByte | 将指定的值转换为8位无符号整数 |
| ToChar | 将指定的值转换为Unicode字符 |
| ToDateTime | 将指定的值转换为DateTime |
| ToDecimal | 将指定的值转换为Decimal数字 |
| ToDouble | 将指定的值转换为双精度浮点数 |
| ToInt16 | 将指定的值转换为16位有符号整数 |
| ToInt32 | 将指定的值转换为32位有符号整数 |
| ToInt64 | 将指定的值转换为64位有符号整数 |
| ToSByte | 将指定的值转换为8位有符号整数 |
| ToSingle | 将指定的值转换为单精度浮点数 |
| ToString | 将指定的值转换为与其等效的String表示形式 |
| ToUInt16 | 将指定的值转换为16位有符号整数 |
| ToUInt32 | 将指定的值转换为32位有符号整数 |
| ToUInt64 | 将指定的值转换为64位有符号整数 |

#### Dispose方法-释放资源
Dispose方法用于执行与释放或重置非托管资源相关的应用程序定义的任务


