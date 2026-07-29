public interface IImageService
{
    Task<string?> SaveAsync(IFormFile? file);
    Task<string?> ReplaceAsync(string? oldFile, IFormFile? newFile);
    void Delete(string? fileName);
}