using Momos.Server.Middlewares;

namespace Momos.Server.Extentions
{
    public static class MiddlewareExtention
    {
        public static IApplicationBuilder UseHttpLog(this IApplicationBuilder builder) => builder.UseMiddleware<HttpLogMiddleware>();
    }
}
