---
title: 左耳听风-Go语言编程模式：Functional Options
date: 2021-10-15 23:43:58
categories: 笔记
tags: 
 - 笔记
 - 左耳听风
 - go
---

### 前言

我们来讨论一下 Functional Options 这个编程模式。这是一个函数式编程的应用案例，编程技巧也很好，是目前 Go 语言中最流行的一种编程模式。

但是，在正式讨论这个模式之前，我们先来看看要解决什么样的问题。
<!--more-->

### 配置选项问题

在编程中，我们经常需要对一个对象（或是业务实体）进行相关的配置。比如下面这个业务实体（注意，这只是一个示例）：

```go
type Server struct {
    Addr     string
    Port     int
    Protocol string
    Timeout  time.Duration
    MaxConns int
    TLS      *tls.Config
}
```

在这个 Server 对象中，我们可以看到：

* 要有侦听的 IP 地址 Addr 和端口号 Port ，这两个配置选项是必填的（当然，IP 地址和端口号都可以有默认值，不过这里我们用于举例，所以是没有默认值，而且不能为空，需要是必填的）。
* 然后，还有协议 Protocol 、 Timeout 和MaxConns 字段，这几个字段是不能为空的，但是有默认值的，比如，协议是 TCP，超时30秒 和 最大链接数1024个。
* 还有一个 TLS  ，这个是安全链接，需要配置相关的证书和私钥。这个是可以为空的。

针对这样的配置，我们需要有多种不同的创建不同配置 Server 的函数签名，因为 Go 语言不支持重载函数，所以，得用不同的函数名来应对不同的配置选项，如下所示：

```go
func NewDefaultServer(addr string, port int) (*Server, error) {
  return &Server{addr, port, "tcp", 30 * time.Second, 100, nil}, nil
}

func NewTLSServer(addr string, port int, tls *tls.Config) (*Server, error) {
  return &Server{addr, port, "tcp", 30 * time.Second, 100, tls}, nil
}

func NewServerWithTimeout(addr string, port int, timeout time.Duration) (*Server, error) {
  return &Server{addr, port, "tcp", timeout, 100, nil}, nil
}

func NewTLSServerWithMaxConnAndTimeout(addr string, port int, maxconns int, timeout time.Duration, tls *tls.Config) (*Server, error) {
  return &Server{addr, port, "tcp", 30 * time.Second, maxconns, tls}, nil
}
```

### 配置对象方案

要解决这个问题，最常见的方式是使用一个配置对象，如下所示：

```go
type Config struct {
    Protocol string
    Timeout  time.Duration
    Maxconns int
    TLS      *tls.Config
}
```

把那些非必输的选项都移到一个结构体里，这样一来，  Server 对象就会变成：

```go
type Server struct {
    Addr string
    Port int
    Conf *Config
}
```

于是，就只需要一个 NewServer() 的函数了，在使用前需要构造 Config 对象。

```go
func NewServer(addr string, port int, conf *Config) (*Server, error) {
    //...
}

//Using the default configuratrion
srv1, _ := NewServer("localhost", 9000, nil) 

conf := ServerConfig{Protocol:"tcp", Timeout: 60*time.Duration}
srv2, _ := NewServer("locahost", 9000, &conf)
```

### Builder 模式

```go
//使用一个builder类来做包装
type ServerBuilder struct {
  Server
}

func (sb *ServerBuilder) Create(addr string, port int) *ServerBuilder {
  sb.Server.Addr = addr
  sb.Server.Port = port
  //其它代码设置其它成员的默认值
  return sb
}

func (sb *ServerBuilder) WithProtocol(protocol string) *ServerBuilder {
  sb.Server.Protocol = protocol 
  return sb
}

func (sb *ServerBuilder) WithMaxConn( maxconn int) *ServerBuilder {
  sb.Server.MaxConns = maxconn
  return sb
}

func (sb *ServerBuilder) WithTimeOut( timeout time.Duration) *ServerBuilder {
  sb.Server.Timeout = timeout
  return sb
}

func (sb *ServerBuilder) WithTLS( tls *tls.Config) *ServerBuilder {
  sb.Server.TLS = tls
  return sb
}

func (sb *ServerBuilder) Build() (Server) {
  return  sb.Server
}
```

这样一来，就可以使用Builder 模式这样的方式了：

```go
sb := ServerBuilder{}
server, err := sb.Create("127.0.0.1", 8080).
  WithProtocol("udp").
  WithMaxConn(1024).
  WithTimeOut(30*time.Second).
  Build()
```

这种方式也很清楚，不需要额外的 Config 类，使用链式的函数调用的方式来构造一个对象，只需要多加一个 Builder 类。你可能会觉得，这个 Builder 类似乎有点多余，我们似乎可以直接在Server 上进行这样的 Builder 构造，的确是这样的。但是，在处理错误的时候可能就有点麻烦，不如一个包装类更好一些。

如果我们想省掉这个包装的结构体，就要请出 Functional Options 上场了：函数式编程。

### Functional Options

首先，定义一个函数类型：

```go
type Option func(*Server)
```

然后，可以使用函数式的方式定义一组如下的函数：

```go
func Protocol(p string) Option {
    return func(s *Server) {
        s.Protocol = p
    }
}
func Timeout(timeout time.Duration) Option {
    return func(s *Server) {
        s.Timeout = timeout
    }
}
func MaxConns(maxconns int) Option {
    return func(s *Server) {
        s.MaxConns = maxconns
    }
}
func TLS(tls *tls.Config) Option {
    return func(s *Server) {
        s.TLS = tls
    }
}
```

这组代码传入一个参数，然后返回一个函数，返回的这个函数会设置自己的 Server 参数。例如，当我们调用其中的一个函数 MaxConns(30) 时，其返回值是一个 func(s* Server) { s.MaxConns = 30 } 的函数。

这个叫高阶函数。在数学上，这有点像是计算长方形面积的公式为： rect(width, height) = width * height; 这个函数需要两个参数，我们包装一下，就可以变成计算正方形面积的公式：square(width) = rect(width, width)  。也就是说，squre(width)返回了另外一个函数，这个函数就是rect(w,h) ，只不过它的两个参数是一样的，即：f(x) = g(x, x)。

现在再定义一个 NewServer()的函数，其中，有一个可变参数 options  ，它可以传出多个上面的函数，然后使用一个 for-loop 来设置我们的 Server 对象。

```go
func NewServer(addr string, port int, options ...func(*Server)) (*Server, error) {
  srv := Server{
    Addr:     addr,
    Port:     port,
    Protocol: "tcp",
    Timeout:  30 * time.Second,
    MaxConns: 1000,
    TLS:      nil,
  }
  for _, option := range options {
    option(&srv)
  }
  //...
  return &srv, nil
}
```

在创建 Server 对象的时候，就可以像下面这样：

```go
s1, _ := NewServer("localhost", 1024)
s2, _ := NewServer("localhost", 2048, Protocol("udp"))
s3, _ := NewServer("0.0.0.0", 8080, Timeout(300*time.Second), MaxConns(1000))
```

使用 Functional Options的6个好处

* 直觉式的编程；
* 高度的可配置化；
* 很容易维护和扩展；
* 自文档；
* 新来的人很容易上手；
* 没有什么令人困惑的事（是 nil 还是空）。
