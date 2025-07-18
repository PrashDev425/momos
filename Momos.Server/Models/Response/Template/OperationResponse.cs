using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Momos.Server.Models.Response.Template
{
    public class OperationResponse : ProcessResponse
    {
        public int RowAffected { get; set; }
        public Dictionary<string, string[]> ValidationErrors { get; private set; } = new();

        public OperationResponse():base() { }

        public OperationResponse(bool status, string message, int rowAffected)
        {
            Status = status;
            Message = message;
            RowAffected = rowAffected;
        }

        public OperationResponse SetResult(bool status, string message, int rowAffected)
        {
            Status = status;
            Message = message;
            RowAffected = rowAffected;

            if (status)
                ValidationErrors.Clear();

            return this;
        }

        public OperationResponse AddValidationError(ModelStateDictionary modelState)
        {
            ValidationErrors = modelState
                .Where(x => x.Value?.Errors.Count > 0)
                .ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                );

            if (ValidationErrors.Count > 0) // |---> Optionally force Status = false if errors found
                Status = false;

            return this;
        }

        public OperationResponse AddValidationError(string key, string errorMessage)
        {
            if (!ValidationErrors.ContainsKey(key))
                ValidationErrors[key] = new[] { errorMessage };
            else
                ValidationErrors[key] = ValidationErrors[key].Append(errorMessage).ToArray();

            Status = false;
            return this;
        }

        public OperationResponse AddValidationError(string key, IEnumerable<string> errorMessages)
        {
            if (!ValidationErrors.ContainsKey(key))
                ValidationErrors[key] = errorMessages.ToArray();
            else
                ValidationErrors[key] = ValidationErrors[key].Concat(errorMessages).ToArray();

            Status = false;
            return this;
        }

        public bool HasValidationErrors => ValidationErrors.Count > 0;
    }
}
