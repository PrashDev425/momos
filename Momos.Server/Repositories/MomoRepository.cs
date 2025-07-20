using Momos.Server.Data;
using Momos.Server.Entities;
using Momos.Server.Repositories.Base;
using Momos.Server.Repositories.Interface;

namespace Momos.Server.Repositories
{
    public class MomoRepository : Repository<Momo>, IMomoRepository
    {
        public MomoRepository(AppDbContext context) : base(context)
        {

        }
    }
}
