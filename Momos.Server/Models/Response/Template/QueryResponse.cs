namespace Momos.Server.Models.Response.Template
{
    public class QueryResponse<T> : ProcessResponse
    {
        public T? Data { get; set; }
        public QueryResponse() : base() { }
        public QueryResponse(bool status, string message, T? data = default)
            : base(status, message)
        {
            Data = data;
        }
        public QueryResponse<T> SetResult(bool status, string message, T data)
        {
            Status = status;
            Message = message;
            Data = data;
            return this;
        }
    }
}
