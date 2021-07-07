---
title: Asp.Net Core Web API的先进架构
date: 2018-06-21 23:58:04
categories: .Net Core
tags:
 - .Net Core
 - Web API
---
##### 架构分层

端口和适配器模式(又称六角形架构)可以解决业务逻辑与其他依赖项(如数据访问或API框架)耦合过于紧密的问题。使用此模式将允许您的API解决方案具有清晰的边界、具有单一职责的良好命名的对象，最终使其更容易开发和维护。架构分为API层,Domain层和Data层
<!--more-->
##### Domain层

领域层具有以下功能:

* 定义将在整个解决方案中使用的实体对象。这些模型将表示数据层的数据模型（DataModel）
* 定义视图模型（ViewModel），将由API层针对HTTP请求和响应作为单个对象或对象集来使用
* 定义接口，我们的数据层可以通过这些接口实现数据访问逻辑
* 实现将包含从API层调用的方法的Supervisor。每个方法都代表一个API调用，并将数据从注入的数据层转换为视图模型以返回

示例如下

```cs
// Album.cs
public sealed class Album
{
    public int AlbumId { get; set; }
    public string Title { get; set; }
    public int ArtistId { get; set; }
        
    public ICollection<Track> Tracks { get; set; } = new HashSet<Track>();
    public Artist Artist { get; set; }
}
// AlbumViewModel.cs
public class AlbumViewModel
{
    public int AlbumId { get; set; }
    public string Title { get; set; }
    public int ArtistId { get; set; }
    public string ArtistName { get; set; }

    public ArtistViewModel Artist { get; set; }
    public IList<TrackViewModel> Tracks { get; set; }
}
// IAlbumRepository.cs
public interface IAlbumRepository : IDisposable
{
    Task<List<Album>> GetAllAsync(CancellationToken ct = default(CancellationToken));
    Task<Album> GetByIdAsync(int id, CancellationToken ct = default(CancellationToken));
    Task<List<Album>> GetByArtistIdAsync(int id, CancellationToken ct = default(CancellationToken));
    Task<Album> AddAsync(Album newAlbum, CancellationToken ct = default(CancellationToken));
    Task<bool> UpdateAsync(Album album, CancellationToken ct = default(CancellationToken));
    Task<bool> DeleteAsync(int id, CancellationToken ct = default(CancellationToken));
}
// Supervisor.cs
public async Task<AlbumViewModel> GetAlbumByIdAsync(int id, CancellationToken ct = default(CancellationToken))
{
    var albumViewModel = AlbumCoverter.Convert(await _albumRepository.GetByIdAsync(id, ct));
    albumViewModel.Artist = await GetArtistByIdAsync(albumViewModel.ArtistId, ct);
    albumViewModel.Tracks = await GetTrackByAlbumIdAsync(albumViewModel.AlbumId, ct);
    albumViewModel.ArtistName = albumViewModel.Artist.Name;
    return albumViewModel;
}

```

##### Data层

数据层的关键是使用领域层中开发的接口实现每个实体存储库。以领域层的专辑存储库为例，它就是实现了IAlbumRepository接口。每个存储库都将注入DBContext，允许使用实体框架核心访问SQL数据库

```cs
public class AlbumRepository : IAlbumRepository
{
    private readonly ChinookContext _context;

    public AlbumRepository(ChinookContext context)
    {
        _context = context;
    }

    private async Task<bool> AlbumExists(int id, CancellationToken ct = default(CancellationToken))
    {
return await GetByIdAsync(id, ct) != null;
    }

    public void Dispose()
    {
        _context.Dispose();
    }

    public async Task<List<Album>> GetAllAsync(CancellationToken ct = default(CancellationToken))
    {
        return await _context.Album.ToListAsync(ct);
    }

    public async Task<Album> GetByIdAsync(int id, CancellationToken ct = default(CancellationToken))
    {
        return await _context.Album.FindAsync(id);
    }

    public async Task<Album> AddAsync(Album newAlbum, CancellationToken ct = default(CancellationToken))
    {
        _context.Album.Add(newAlbum);
        await _context.SaveChangesAsync(ct);
        return newAlbum;
    }

    public async Task<bool> UpdateAsync(Album album, CancellationToken ct = default(CancellationToken))
    {
        if (!await AlbumExists(album.AlbumId, ct))
            return false;
        _context.Album.Update(album);

        _context.Update(album);
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default(CancellationToken))
    {
        if (!await AlbumExists(id, ct))
            return false;
        var toRemove = _context.Album.Find(id);
        _context.Album.Remove(toRemove);
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<List<Album>> GetByArtistIdAsync(int id, CancellationToken ct = default(CancellationToken))
    {
        return await _context.Album.Where(a => a.ArtistId == id).ToListAsync(ct);
    }
}
```

##### API层

这一层包含Web API端点逻辑的代码，包括控制器。这个解决方案的API项目将有一个单独的职责，那就是处理web服务器接收到的HTTP请求并返回HTTP响应，无论成功还是失败。在这个项目中，将会有非常少的业务逻辑。我们将处理在领域或数据项目中发生的异常和错误，以有效地与API的使用者进行通信。此通信将使用HTTP响应代码和在HTTP响应报文中返回的任何数据。

```cs
[Route("api/[controller]")]
public class AlbumController : Controller
{
    private readonly ISupervisor _Supervisor;

    public AlbumController(ISupervisor Supervisor)
    {
        _Supervisor = Supervisor;
    }

    [HttpGet]
    [Produces(typeof(List<AlbumViewModel>))]
    public async Task<IActionResult> Get(CancellationToken ct = default(CancellationToken))
    {
        try
        {
            return new ObjectResult(await _Supervisor.GetAllAlbumAsync(ct));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex);
        }
    } 

    ...
}
```
