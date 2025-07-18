using Momos.Server.Entities;

namespace Momos.Server.Services.TokenService.Interface
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
