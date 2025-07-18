namespace Momos.Server.Models.Response.Template
{
    public class ProcessResponse
    {
        public bool Status { get; set; }
        public string Message { get; set; } = string.Empty;
        public ProcessResponse() { }
        public ProcessResponse(bool status, string message)
        {
            Status = status;
            Message = message;
        }
        public ProcessResponse SetResult(bool status, string message)
        {
            Status = status;
            Message = message;
            return this;
        }
    }
}
