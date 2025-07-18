using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Momos.Server.Entities;

namespace Momos.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.ConfigureWarnings(warnings =>
                warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));

            optionsBuilder.UseSeeding((context, _) =>
            {
                var userSet = context.Set<User>();
                var user = userSet.FirstOrDefault(b => b.Username == "admin");

                if (user == null)
                {
                    var hasher = new PasswordHasher<User>();
                    var newUser = new User
                    {
                        Username = "admin",
                        Role = "Admin"
                    };
                    newUser.PasswordHash = hasher.HashPassword(newUser, "admin123");

                    userSet.Add(newUser);
                    context.SaveChanges();
                }
            });
        }

        public DbSet<User> Users { get; set; }
    }
}
