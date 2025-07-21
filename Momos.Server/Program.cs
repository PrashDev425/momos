using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Momos.Server.Data;
using Momos.Server.Extentions;

var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

//var builder = WebApplication.CreateBuilder(new WebApplicationOptions
//{
//    Args = args,
//    WebRootPath = environment == "Production" ? "wwwroot" : ""
//});

var builder = WebApplication.CreateBuilder(args);

ConfigureServices(builder.Services);

// Add services to the container.
void ConfigureServices(IServiceCollection services)
{
    services.AddDbContext<AppDbContext>(options => options.UseSqlite(builder.Configuration.GetConnectionString("SQLiteConnection")));
    services.Configure<ApiBehaviorOptions>(options =>
    {
        options.SuppressModelStateInvalidFilter = true;
    });
    services.AddSwaggerGen(c => {
        c.SwaggerDoc("v1", new()
        {
            Title = "Momos API",
            Version = "v1"
        });

        // Add JWT Authentication
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });

        c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
          new OpenApiSecurityScheme {
            Reference = new OpenApiReference {
              Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
            }
          },
          new string[] {}
        }
      });
    });
    services.AddControllers();
    services.AddUnitOfWork();
    services.AddJwtAuthentication(builder.Configuration);
    services.AddServices();
}

var app = builder.Build();
// Configure the HTTP request pipeline.
app.UseHttpLog();
app.UseDefaultFiles();
app.MapStaticAssets();
app.UseStaticFiles();
app.MapOpenApi();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Momo Api");
        c.RoutePrefix = "swagger-ui";
    });
}
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");
app.Run();