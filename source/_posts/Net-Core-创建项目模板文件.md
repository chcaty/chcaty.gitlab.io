---
title: .Net Core 创建项目模板文件
date: 2021-09-27 22:08:42
categories: .Net Core
tags:
 - .Net Core
 - 项目模板
---

### 前言

公司新架构是根据不同模块分成一个个独立项目，然后生成nuget包，最后在webHost项目中统一注入。为了避免新建项目的麻烦，于是就有了创建项目模板包的想法，直接生成对应基础的项目目录和文件。
后续的步骤都是建立在你已经把需要设置为模板的项目文件准备好以后才进行。
<!--more-->

### 创建模板配置

模板在 .Net 中通过模板根目录中的特殊文件夹和配置文件进行识别。

创建模板时，除特殊配置文件夹外，模板文件夹中的所有文件和文件夹都作为模板的一部分包含在内（也可以通过配置排除掉特定的文件和文件夹）。此配置文件夹名为“.template.config”。

首先，创建一个名为“.template.config” 的新子文件夹，然后进入该文件夹。 然后，创建一个名为“template.json” 的新文件。

编辑 template.json，内容如下

```json
{
  "$schema": "http://json.schemastore.org/template",
  "author": "Caty",
  "classifications": [ "Common", "Console", "C#9" ],
  "identity": "ExampleTemplate.Project",
  "name": "Example templates: project",
  "shortName": "consoleasync",
  "sourceName": "Template",
  "tags": {
    "language": "C#",
    "type": "project"
  }
}
```

此配置文件包含模板的所有设置。上面是5个必需设置信息，包含作者、模板特征、模板的唯一名称、用户看到的模板名称、模板名称缩写、模板标签。

sourceName: 项目中的名称，用于替换用户指定的名称。模板引擎将查找配置文件中提及并出现的任何 sourceName，并将其替换为文件名和文件内容。 可以在运行模板时使用 -n 或 --name 选项提供要替换的值。

如果需要排除特定文件夹，可以在配置文件中补充配置来排除，排除文件和文件夹的配置如下

```json
"sources": [
        {
          "modifiers": [
            {
              "exclude": [
                ".git/**",
                ".vs/**",
                "_rels/**",
                "package/**",
                "*.xml",
                "*.nuspec",
                "*.md"
              ]
            }
          ]
        }
      ]
```

如果还有其他的需要，可以去 http://json.schemastore.org/template 看一下对应的配置说明，然后进行配置。

### 将模板打包到 NuGet 包（nupkg 文件）

#### dotnet pack 命令和.csproj文件一起打包

该 .csproj 文件与传统代码项目 .csproj 文件略有不同。 请注意以下设置：

1. 添加 `<PackageType>`设置并将其设为 Template。
2. 添加 `<PackageVersion>`设置并将其设为有效的 NuGet 版本号。
3. 添加 `<PackageId>` 设置并将其设为唯一标识符。 此标识符用于卸载模板包，NuGet 源用它来注4册你的模板包。
4. 应设置泛型元数据设置：`<Title>`、`<Authors>`、`<Description>` 和 `<PackageTags>`。
5. 必须设置 `<TargetFramework>`设置，即使未使用模板过程生成的二进制文件也必须设置。

.nupkg NuGet 包形式的模板包要求所有模板都存储在包中的 content 文件夹中。 还有几个设置将添加到 .csproj 文件以确保生成的 .nupkg 作为模板包安装：

1. `<IncludeContentInPack>` 设置设为 true 以包含项目在 NuGet 包中设为“内容”的任何文件。
2. `<IncludeBuildOutput>` 设置设为 false 以从 NuGet 包排除编译器生成的所有二进制文件。
3. `<ContentTargetFolders>` 设置设为 content。 这可确保设为“内容”的文件存储在 NuGet 包的 content 文件夹中。 NuGet 包中的此文件夹由 dotnet 模板系统解析。

#### NuGet 可与 nuget pack 命令以及 .nuspec 文件一起使用

创建一个.nuspec 文件，用于生成包和为使用者提供信息,内容如下

```xml
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://schemas.microsoft.com/packaging/2012/06/nuspec.xsd">
  <metadata>
    <id>PltSolutionTemplate</id>
    <version>1.0.7</version>
    <description>PltSolution Template</description>
    <authors>apukj</authors>
    <packageTypes>
      <packageType name="Template" />
    </packageTypes>
  </metadata>
</package>
```

nuget使用nuspec文件命令如下：、

```cmd
nuget pack PltSolutionTemplate.nuspec -OutputDirectory .
```

然后将生成的nupkg包推动到包服务器上。

### 安装和使用自定义模板创建项目

使用 NuGet 包标识符安装模板包

```cs
dotnet new -i <NUGET_PACKAGE_ID>
```

获取已安装模板的列表

```cs
dotnet new -u
```

卸载模板

```cs
dotnet new -u <NUGET_PACKAGE_ID>
```

使用自定义模板创建项目

```cs
dotnet new <TEMPLATE>
```

这就是创建项目模板，并使用的大体步骤了。
