using Momos.Server.Models.Response.Template;

namespace Momos.Server.Models.Response.Auth
{
    public class LoginResponse<T> : OperationResponse<T>
    {
        public string? Token { get; set; }
        public LoginResponse() : base() { }
        public LoginResponse(bool status, string message, T data)
            : base(status, message, 0, data)
        {
        }
        public LoginResponse(bool status, string message, string? token = null, int rowAffected = 0, T? data = default)
            : base(status, message, rowAffected, data)
        {
            Token = token;
        }
        public LoginResponse<T> SetToken(string token)
        {
            Token = token;
            return this;
        }
        public LoginResponse<T> SetResultWithToken(bool status, string message, int rowAffected, T data, string token)
        {
            SetResult(status, message, rowAffected, data);
            Token = token;
            return this;
        }
    }
}
