using System.Diagnostics;

namespace Momos.Server.Middlewares
{
    public class HttpLogMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<HttpLogMiddleware> _logger;
        public HttpLogMiddleware(RequestDelegate next, ILogger<HttpLogMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();
            try
            {
                _logger.LogInformation($"[+] {DateTime.UtcNow} : {context.Request.Method} {context.Request.Path}");
                await _next(context);
                _logger.LogInformation($"[+] Outgoing Response Code: {context.Response.StatusCode}");
            }
            finally
            {
                stopwatch.Stop();
                _logger.LogInformation($"[+] Request Processing Time: {stopwatch.ElapsedMilliseconds} ms");
            }
        }
    }
}
