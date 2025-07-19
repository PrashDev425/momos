using Microsoft.EntityFrameworkCore.Storage;
using Momos.Server.Data;
using Momos.Server.Repositories;
using Momos.Server.Repositories.Interface;
using Momos.Server.UnitOfWork.Interface;

namespace Momos.Server.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        private bool _disposed = false;

        //-----------[ Add repositories here ]----------
        public IUserRepository Users { get; }
        //----------------------------------------------

        public UnitOfWork(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));

            //----------[ Initialize repositories here ]----------
            Users = new UserRepository(_context);
            //----------------------------------------------------
        }

        public int Complete() => _context.SaveChanges();

        public async Task<int> CompleteAsync() => await _context.SaveChangesAsync();

        public IDbContextTransaction BeginTransaction() => _context.Database.BeginTransaction();

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
                _disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
