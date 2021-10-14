---
title: 左耳听风-故障处理的最佳实践
date: 2021-10-13 23:43:58
categories: 笔记
tags: 
 - 笔记
---

### 前言

主要包括数组切片的一些小坑、接口编程，以及时间和程序运行性能相关的内容。
<!--more-->

### Slice

Slice，中文翻译叫“切片”，这个东西在 Go 语言中不是数组，而是一个结构体，其定义如下：

```go
type slice struct {
    array unsafe.Pointer //指向存放数据的数组指针
    len   int            //长度有多大
    cap   int            //容量有多大
}
```

结构体里用数组指针的问题——__数据会发生共享__!

Slice的一些操作

```go
foo = make([]int, 5)
foo[3] = 42
foo[4] = 100

bar := foo[1:4]
bar[1] = 99
```

解释下这段代码：

* 首先，创建一个 foo 的 Slice，其中的长度和容量都是 5；
* 然后，开始对 foo 所指向的数组中的索引为 3 和 4 的元素进行赋值；
* 最后，对 foo 做切片后赋值给 bar，再修改 bar[1]。

![alt 图](https://static001.geekbang.org/resource/image/66/20/66ed288ef019a8445b639db92d79a420.jpg?wh=1803x1242)

从这张图片中，我们可以看到，因为 foo 和 bar 的内存是共享的，所以，foo 和 bar 对数组内容的修改都会影响到对方。

接下来，我们再来看一个数据操作 append() 的示例：

```go
a := make([]int, 32)
b := a[1:16]
a = append(a, 1)
a[2] = 42
```

这段代码中，把 a[1:16] 的切片赋给 b ，此时，a 和 b 的内存空间是共享的，然后，对 a 做了一个 append()的操作，这个操作会让 a 重新分配内存，这就会导致 a 和 b 不再共享，如下图所示：

![alt 图](https://static001.geekbang.org/resource/image/90/21/90e91f0e9517594b6c26fb64d531c621.jpg?wh=1743x1482)

从图中，我们可以看到，append()操作让 a 的容量变成了 64，而长度是 33。这里你需要重点注意一下，append()这个函数在 cap 不够用的时候，就会重新分配内存以扩大容量，如果够用，就不会重新分配内存了！

我们再来看一个例子：

```cs
func main() {
    path := []byte("AAAA/BBBBBBBBB")
    sepIndex := bytes.IndexByte(path,'/')

    dir1 := path[:sepIndex]
    dir2 := path[sepIndex+1:]

    fmt.Println("dir1 =>",string(dir1)) //prints: dir1 => AAAA
    fmt.Println("dir2 =>",string(dir2)) //prints: dir2 => BBBBBBBBB

    dir1 = append(dir1,"suffix"...)

    fmt.Println("dir1 =>",string(dir1)) //prints: dir1 => AAAAsuffix
    fmt.Println("dir2 =>",string(dir2)) //prints: dir2 => uffixBBBB
}
```

在这个例子中，dir1 和 dir2 共享内存，虽然 dir1 有一个 append() 操作，但是因为 cap 足够，于是数据扩展到了dir2 的空间。下面是相关的图示（注意上图中 dir1 和 dir2 结构体中的 cap 和 len 的变化）：

![alt 图](https://static001.geekbang.org/resource/image/33/01/33b6fb6a551a13cef4e0d9644a410601.jpg?wh=1983x2022)

如果要解决这个问题，我们只需要修改一行代码。我们要把代码

```go
dir1 := path[:sepIndex]
```

修改为：

```go
dir1 := path[:sepIndex:sepIndex]
```

新的代码使用了 Full Slice Expression，最后一个参数叫“Limited Capacity”，于是，后续的 append() 操作会导致重新分配内存。

### 深度比较

我们复制一个对象时，这个对象可以是内建数据类型、数组、结构体、Map……在复制结构体的时候，如果我们需要比较两个结构体中的数据是否相同，就要使用深度比较，而不只是简单地做浅度比较。这里需要使用到反射 reflect.DeepEqual() ，下面是几个示例：

```go
import (
    "fmt"
    "reflect"
)

func main() {

    v1 := data{}
    v2 := data{}
    fmt.Println("v1 == v2:",reflect.DeepEqual(v1,v2))
    //prints: v1 == v2: true

    m1 := map[string]string{"one": "a","two": "b"}
    m2 := map[string]string{"two": "b", "one": "a"}
    fmt.Println("m1 == m2:",reflect.DeepEqual(m1, m2))
    //prints: m1 == m2: true

    s1 := []int{1, 2, 3}
    s2 := []int{1, 2, 3}
    fmt.Println("s1 == s2:",reflect.DeepEqual(s1, s2))
    //prints: s1 == s2: true
}
```

### 接口编程

下面，我们来看段代码，其中是两个方法，它们都是要输出一个结构体，其中一个使用一个函数，另一个使用一个“成员函数”。

```go
func PrintPerson(p *Person) {
    fmt.Printf("Name=%s, Sexual=%s, Age=%d\n",
  p.Name, p.Sexual, p.Age)
}

func (p *Person) Print() {
    fmt.Printf("Name=%s, Sexual=%s, Age=%d\n",
  p.Name, p.Sexual, p.Age)
}

func main() {
    var p = Person{
        Name: "Hao Chen",
        Sexual: "Male",
        Age: 44,
    }

    PrintPerson(&p)
    p.Print()
}
```

在 Go 语言中，使用“成员函数”的方式叫“Receiver”，这种方式是一种封装，因为 PrintPerson()本来就是和 Person强耦合的，所以理应放在一起。更重要的是，这种方式可以进行接口编程，对于接口编程来说，也就是一种抽象，主要是用在“多态”。

在这里，我想讲另一个 Go 语言接口的编程模式。

首先，我们来看一段代码：

```go
type Country struct {
    Name string
}

type City struct {
    Name string
}

type Printable interface {
    PrintStr()
}
func (c Country) PrintStr() {
    fmt.Println(c.Name)
}
func (c City) PrintStr() {
    fmt.Println(c.Name)
}

c1 := Country {"China"}
c2 := City {"Beijing"}
c1.PrintStr()
c2.PrintStr()
```

结构体嵌入法优化

```go
type WithName struct {
    Name string
}

type Country struct {
    WithName
}

type City struct {
    WithName
}

type Printable interface {
    PrintStr()
}

func (w WithName) PrintStr() {
    fmt.Println(w.Name)
}

c1 := Country {WithName{ "China"}}
c2 := City { WithName{"Beijing"}}
c1.PrintStr()
c2.PrintStr()
```

使用接口

```go
type Country struct {
    Name string
}

type City struct {
    Name string
}

type Stringable interface {
    ToString() string
}
func (c Country) ToString() string {
    return "Country = " + c.Name
}
func (c City) ToString() string{
    return "City = " + c.Name
}

func PrintStr(p Stringable) {
    fmt.Println(p.ToString())
}

d1 := Country {"USA"}
d2 := City{"Los Angeles"}
PrintStr(d1)
PrintStr(d2)
```

在这段代码中，我们可以看到，我们使用了一个叫Stringable 的接口，我们用这个接口把“业务类型” Country 和 City 和“控制逻辑” Print() 给解耦了。于是，只要实现了Stringable 接口，都可以传给 PrintStr() 来使用。

这就是面向对象编程方法的黄金法则——“Program to an interface not an implementation”。

### 接口完整性检查

Go 语言的编译器并没有严格检查一个对象是否实现了某接口所有的接口方法，如下面这个示例：

```go
type Shape interface {
    Sides() int
    Area() int
}
type Square struct {
    len int
}
func (s* Square) Sides() int {
    return 4
}
func main() {
    s := Square{len: 5}
    fmt.Printf("%d\n",s.Sides())
}
```

quare 并没有实现 Shape 接口的所有方法，程序可以跑通.

强验证的方法

```go
var _ Shape = (*Square)(nil)
```

声明一个 _ 变量（没人用）会把一个 nil 的空指针从 Square 转成 Shape，这样，如果没有实现完相关的接口方法，编译器就会报错:
> cannot use (*Square)(nil) (type *Square) as type Shape in assignment: *Square does not implement Shape (missing Area method)

### 时间

在 Go 语言中，你一定要使用 time.Time 和 time.Duration  这两个类型。

* 在命令行上，flag 通过 time.ParseDuration 支持了 time.Duration。JSON 中的 encoding/
* json 中也可以把time.Time 编码成 RFC 3339 的格式。
* 数据库使用的 database/sql 也支持把 DATATIME 或 TIMESTAMP 类型转成 time.Time。
* YAML 也可以使用 gopkg.in/yaml.v2 支持 time.Time 、time.Duration 和 RFC 3339 格式。

如果你要和第三方交互，实在没有办法，也请使用 RFC 3339 的格式。

最后，如果你要做全球化跨时区的应用，一定要把所有服务器和时间全部使用 UTC 时间。

### 性能提示

Go 语言是一个高性能的语言，但并不是说这样我们就不用关心性能了，我们还是需要关心的。下面我给你提供一份在编程方面和性能相关的提示。

* 如果需要把数字转换成字符串，使用 strconv.Itoa() 比 fmt.Sprintf() 要快一倍左右。
* 尽可能避免把String转成[]Byte ，这个转换会导致性能下降。
* 如果在 for-loop 里对某个 Slice 使用 append()，请先把 Slice 的容量扩充到位，这样可以避免内存重新分配以及系统自动按 2 的 N 次方幂进行扩展但又用不到的情况，从而避免浪费内存。
* 使用StringBuffer 或是StringBuild 来拼接字符串，性能会比使用 + 或 +=高三到四个数量级。
* 尽可能使用并发的 goroutine，然后使用 sync.WaitGroup 来同步分片操作。
* 避免在热代码中进行内存分配，这样会导致 gc 很忙。尽可能使用  sync.Pool 来重用对象。
* 使用 lock-free 的操作，避免使用 mutex，尽可能使用 sync/Atomic包（关于无锁编程的相关话题，可参看《无锁队列实现》或《无锁 Hashmap 实现》）。
* 使用 I/O 缓冲，I/O 是个非常非常慢的操作，使用 bufio.NewWrite() 和 bufio.NewReader() 可以带来更高的性能。
* 对于在 for-loop 里的固定的正则表达式，一定要使用 regexp.Compile() 编译正则表达式。性能会提升两个数量级。
* 如果你需要更高性能的协议，就要考虑使用 protobuf 或 msgp 而不是 JSON，因为 JSON 的序列化和反序列化里使用了反射。
* 你在使用 Map 的时候，使用整型的 key 会比字符串的要快，因为整型比较比字符串比较要快。
