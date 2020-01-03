---
title: 微服务-Consul学习
date: 2019-03-05 23:18:12
categories: 微服务
tags: 
 - .Net Core
 - 微服务
---
#### Consul介绍：
> Consul 是由 HashiCorp 公司推出的开源软件，用于实现分布式系统的服务发现与配置。与其他分布式服务注册与发现的方案，Consul 的方案更“一站式”，内置了服务注册与发现框 架、分布一致性协议实现、健康检查、Key/Value 存储、多数据中心方案，不再需要依赖其他工具（比如 ZooKeeper 等），使用起来也较为简单。Consul使用Go语言编写，因此具有天然可移植性(支持Linux、windows和Mac OS X)；安装包仅包含一个可执行文件，方便部署，与Docker等轻量级容器可无缝配合 。
<!--more-->
#### Consul安装
从consul官网 https://www.consul.io/downloads.html 进行下载就好（选择好OS和位数）
1. 解压下载好的压缩文件
2. Windows需配置环境变量path.
3. 查看是否安装成功
直接在家目录下执行consul命令即可。出现usage: consul [--version] [--help] <command> [<args>]等字样，表示安装成功。
#### Consul启动
1. 运行命令
```
consul agent -dev //-dev表示开发模式运行，-server表示服务模式运行
```
2. 查看consul cluster中的每一个consul节点的信息
```
consul members //信息说明 Address：节点地址 Status：alive表示节点健康 Type：server运行状态是server状态 DC：dc1表示该节点属于DataCenter1 
```
3. 访问Consul
http://127.0.0.1:8500/ui/
4. 停止服务
CTRL+C
#### 常用命令

| 命令 | 说明 | 示例 |
| :------: | :------: | :------: |
| agent | 运行一个consul agent | consul agent -dev |
| join | 将agent加入到consul集群 | consul join IP |
| agent | 列出consul cluster集群中的节点 | consul members |
| agent | 将节点移除所在集群 | consul leave |
#### consul agent 命令常用选项
* -data-dir 指定agent储存状态的数据目录(必须)
* -config-dir 指定service的配置文件和检查定义所在的位置
* -config-file 指定一个要装载的配置文件
* -dev 创建开发环境的server节点
* -bootstrap-expect 预加入的server节点个数,在指定数量节点加入后启动
* -node 指定节点在集群的名称
* -bind 指定节点IP地址
* -server 指定节点为server
* -client 指定节点为client(后面接IP 可指定允许客户端使用什么IP去访问)
* -join 将节点加入集群
* -datecenter 指点节点加入哪个数据中心
