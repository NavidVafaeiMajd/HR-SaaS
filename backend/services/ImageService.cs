public class ImageService : IImageService
{
    private readonly IWebHostEnvironment _environment;

private readonly string _uploadPath;

public ImageService(IWebHostEnvironment environment)
{
    _uploadPath = Path.Combine(environment.ContentRootPath, "..", "storage", "uploads");

    if (!Directory.Exists(_uploadPath))
        Directory.CreateDirectory(_uploadPath);
}
public async Task<string?> SaveAsync(IFormFile? file)
{
    if (file == null)
        return null;

    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

    var filePath = Path.Combine(_uploadPath, fileName);

    using var stream = new FileStream(filePath, FileMode.Create);

    await file.CopyToAsync(stream);

    return fileName;
}
    public async Task<string?> ReplaceAsync(string? oldFile, IFormFile? newFile)
    {
        if (newFile == null)
            return oldFile;

        Delete(oldFile);

        return await SaveAsync(newFile);
    }

    public void Delete(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            return;

        var path = Path.Combine(_uploadPath, "uploads", fileName);

        if (File.Exists(path))
            File.Delete(path);
    }
}