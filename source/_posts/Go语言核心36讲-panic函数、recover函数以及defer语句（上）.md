---
title: Go语言核心36讲-panic函数、recover函数以及defer语句（上）
date: 2021-11-25 23:43:58
categories: 笔记
tags: 
 - 笔记
 - go
 - Go语言核心36讲
---

Go 语言的另外一种错误处理方式，不过，严格来说，它处理的不是错误，而是一场，并且时一种在我们意料之外的程序异常。
<!--more-->

### 前导知识：运行时恐慌 panic

这种程序异常被叫做 panic，我把它翻译为运行时恐慌。其中的“恐慌”二字是由 panic 直译过来的，而之所以前面又加上了“运行时”三个字，是因为这种异常只会在程序运行的时候被抛出来。

我们举个具体的例子来看看。

比如说，一个 Go 程序里有一个切片，它的长度是 5，也就是说该切片中的元素值的索引分别为0、1、2、3、4，但是，我在程序里却想通过索引5访问其中的元素值，显而易见，这样的访问是不正确的。

```go
package main

func main() {
  s1 := []int{0, 1, 2, 3, 4}
  e5 := s1[5]
  _ = e5
}
```

Go 程序，确切地说是程序内嵌的 Go 语言运行时系统，会在执行到这行代码的时候抛出一个“index out of range”的 panic，用以提示你索引越界了。

当然了，这不仅仅是个提示。当 panic 被抛出之后，如果我们没有在程序里添加任何保护措施的话，程序（或者说代表它的那个进程）就会在打印出 panic 的详细情况（以下简称 panic 详情）之后，终止运行。

现在，就让我们来看一下这样的 panic 详情中都有什么。

```go
panic: runtime error: index out of range

goroutine 1 [running]:
main.main()
 /Users/haolin/GeekTime/Golang_Puzzlers/src/puzzlers/article19/q0/demo47.go:5 +0x3d
exit status 2
```

这份详情的第一行是“panic: runtime error: index out of range”。其中的“runtime error”的含义是，这是一个runtime代码包中抛出的 panic。在这个 panic 中，包含了一个runtime.Error接口类型的值。runtime.Error接口内嵌了error接口，并做了一点点扩展，runtime包中有不少它的实现类型。

实际上，此详情中的“panic：”右边的内容，正是这个 panic 包含的runtime.Error类型值的字符串表示形式。

此外，panic 详情中，一般还会包含与它的引发原因有关的 goroutine 的代码执行信息。正如前述详情中的“goroutine 1 [running]”，它表示有一个 ID 为1的 goroutine 在此 panic 被引发的时候正在运行。

注意，这里的 ID 其实并不重要，因为它只是 Go 语言运行时系统内部给予的一个 goroutine 编号，我们在程序中是无法获取和更改的。

我们再看下一行，“main.main()”表明了这个 goroutine 包装的go函数就是命令源码文件中的那个main函数，也就是说这里的 goroutine 正是主 goroutine。再下面的一行，指出的就是这个 goroutine 中的哪一行代码在此 panic 被引发时正在执行。

这包含了此行代码在其所属的源码文件中的行数，以及这个源码文件的绝对路径。这一行最后的+0x3d代表的是：此行代码相对于其所属函数的入口程序计数偏移量。不过，一般情况下它的用处并不大。

最后，“exit status 2”表明我的这个程序是以退出状态码2结束运行的。在大多数操作系统中，只要退出状态码不是0，都意味着程序运行的非正常结束。在 Go 语言中，因 panic 导致程序结束运行的退出状态码一般都会是2。

综上所述，我们从上边的这个 panic 详情可以看出，作为此 panic 的引发根源的代码处于代码文件中的第 5 行，同时被包含在main包（也就是命令源码文件所在的代码包）的main函数中。

### 今天的问题是：从 panic 被引发到程序终止运行的大致过程是什么？

#### 典型回答

我们先说一个大致的过程：某个函数中的某行代码有意或无意地引发了一个 panic。这时，初始的 panic 详情会被建立起来，并且该程序的控制权会立即从此行代码转移至调用其所属函数的那行代码上，也就是调用栈中的上一级。

这也意味着，此行代码所属函数的执行随即终止。紧接着，控制权并不会在此有片刻的停留，它又会立即转移至再上一级的调用代码处。控制权如此一级一级地沿着调用栈的反方向传播至顶端，也就是我们编写的最外层函数那里。

这里的最外层函数指的是go函数，对于主 goroutine 来说就是main函数。但是控制权也不会停留在那里，而是被 Go 语言运行时系统收回。

随后，程序崩溃并终止运行，承载程序这次运行的进程也会随之死亡并消失。与此同时，在这个控制权传播的过程中，panic 详情会被逐渐地积累和完善，并会在程序终止之前被打印出来。

#### 问题解析

panic 可能是我们在无意间（或者说一不小心）引发的，如前文所述的索引越界。这类 panic 是真正的、在我们意料之外的程序异常。不过，除此之外，我们还是可以有意地引发 panic。

Go 语言的内建函数panic是专门用于引发 panic 的。panic函数使程序开发者可以在程序运行期间报告异常。

注意，这与从函数返回错误值的意义是完全不同的。当我们的函数返回一个非nil的错误值时，函数的调用方有权选择不处理，并且不处理的后果往往是不致命的。

这里的“不致命”的意思是，不至于使程序无法提供任何功能（也可以说僵死）或者直接崩溃并终止运行（也就是真死）。

但是，当一个 panic 发生时，如果我们不施加任何保护措施，那么导致的直接后果就是程序崩溃，就像前面描述的那样，这显然是致命的。

代码如下：

```go
package main

import (
  "fmt"
)

func main() {
  fmt.Println("Enter function main.")
  caller1()
  fmt.Println("Exit function main.")
}

func caller1() {
  fmt.Println("Enter function caller1.")
  caller2()
  fmt.Println("Exit function caller1.")
}

func caller2() {
  fmt.Println("Enter function caller2.")
  s1 := []int{0, 1, 2, 3, 4}
  e5 := s1[5]
  _ = e5
  fmt.Println("Exit function caller2.")
}
```

panic 详情会在控制权传播的过程中，被逐渐地积累和完善，并且，控制权会一级一级地沿着调用栈的反方向传播至顶端。

因此，在针对某个 goroutine 的代码执行信息中，调用栈底端的信息会先出现，然后是上一级调用的信息，以此类推，最后才是此调用栈顶端的信息。

比如，main函数调用了caller1函数，而caller1函数又调用了caller2函数，那么caller2函数中代码的执行信息会先出现，然后是caller1函数中代码的执行信息，最后才是main函数的信息。

```go
goroutine 1 [running]:
main.caller2()
 /Users/haolin/GeekTime/Golang_Puzzlers/src/puzzlers/article19/q1/demo48.go:22 +0x91
main.caller1()
 /Users/haolin/GeekTime/Golang_Puzzlers/src/puzzlers/article19/q1/demo48.go:15 +0x66
main.main()
 /Users/haolin/GeekTime/Golang_Puzzlers/src/puzzlers/article19/q1/demo48.go:9 +0x66
exit status 2
```

![从 panic 到程序崩溃](https://static001.geekbang.org/resource/image/60/d7/606ff433a6b58510f215e57792822bd7.png)
