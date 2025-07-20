using Microsoft.EntityFrameworkCore.Storage;
using Momos.Server.Repositories.Interface;

namespace Momos.Server.UnitOfWork.Interface
{
    public interface IUnitOfWork
    {
        // Repositories
        IUserRepository Users { get; }
        IMomoRepository Momos { get; }

        // Save changes
        int Complete();
        Task<int> CompleteAsync();

        // Transaction
        IDbContextTransaction BeginTransaction();
    }
}
