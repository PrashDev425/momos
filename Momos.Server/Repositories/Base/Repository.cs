using Microsoft.EntityFrameworkCore;
using Momos.Server.Data;
using Momos.Server.Repositories.Base.Interface;

namespace Momos.Server.Repositories.Base
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        protected readonly AppDbContext _context;
        private bool _disposed = false;

        public Repository(AppDbContext context)
        {
            _context = context;
        }

        public virtual void Insert(TEntity entity) => _context.Set<TEntity>().Add(entity);

        public virtual async Task InsertAsync(TEntity entity) => await _context.Set<TEntity>().AddAsync(entity);

        public virtual void InsertRange(IEnumerable<TEntity> entities) => _context.Set<TEntity>().AddRange(entities);

        public virtual async Task InsertRangeAsync(IEnumerable<TEntity> entities) => await _context.Set<TEntity>().AddRangeAsync(entities);

        public virtual void Update(TEntity entity) => _context.Set<TEntity>().Update(entity);

        public virtual void Delete(TEntity entity) => _context.Set<TEntity>().Remove(entity);

        public virtual void DeleteRange(IEnumerable<TEntity> entities) => _context.Set<TEntity>().RemoveRange(entities);

        public virtual int Count() => _context.Set<TEntity>().Count();

        public virtual async Task<int> CountAsync() => await _context.Set<TEntity>().CountAsync();

        public virtual List<TEntity> List() => _context.Set<TEntity>().ToList();

        public virtual List<TEntity> List(int page, int pageSize) => _context.Set<TEntity>().Skip((page - 1) * pageSize).Take(pageSize).ToList();

        public virtual async Task<List<TEntity>> ListAsync() => await _context.Set<TEntity>().ToListAsync();

        public virtual async Task<List<TEntity>> ListAsync(int page, int pageSize) => await _context.Set<TEntity>().Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        public virtual TEntity? Find(int id) => _context.Set<TEntity>().Find(id);

        public virtual async Task<TEntity?> FindAsync(int id) => await _context.Set<TEntity>().FindAsync(id);

        public virtual DbSet<TEntity> Set() => _context.Set<TEntity>();

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

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
    }
}
