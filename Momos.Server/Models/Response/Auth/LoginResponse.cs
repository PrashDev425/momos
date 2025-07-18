using Momos.Server.Models.Response.Template;

namespace Momos.Server.Models.Response.Auth
{
    public class LoginResponse : OperationResponse
    {
        public string? Token { get; set; }

        public LoginResponse() : base() { }

        public LoginResponse(bool status, string message, string? token = null)
            : base(status, message, 0)
        {
            Token = token;
        }

        public LoginResponse SetToken(string token)
        {
            Token = token;
            return this;
        }
    }

}
