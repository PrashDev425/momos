namespace Momos.Server.Services.FileService.Interface
{
    public interface IFileService
    {
        Task<string> SaveImageAsync(IFormFile file);
        Task DeleteImageAsync(string imagePath);
    }
}
