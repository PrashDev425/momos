using Momos.Server.Data;
using Momos.Server.Entities;
using Momos.Server.Repositories.Base;
using Momos.Server.Repositories.Interface;

namespace Momos.Server.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context)
        {
        }
    }
}
