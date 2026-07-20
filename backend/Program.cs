using HrSaaS.Models;
using Microsoft.EntityFrameworkCore;
using HrSaaS.Infrastructure.Bootstrap;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();


builder.Services.AddDbContextPool<HRSaaSContext>(
    options =>
    {
        options.UseSqlServer(
            builder.Configuration.GetConnectionString("DefaultConnection"),
            sqlOptions =>
                sqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(10),
                    errorNumbersToAdd: null
                )
        );
    },
    poolSize: 256
);

//add auth
builder.Services.AddAuthorization();

builder.Services
    .AddIdentity<Users, IdentityRole>()
    .AddEntityFrameworkStores<HRSaaSContext>()
    .AddDefaultTokenProviders();

var app = builder.Build();

///to map the Identity endpoints:

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

///bootstrap for create initial admin and roll
await app.BootstrapAsync();

app.UseHttpsRedirection();

app.UseAuthentication();  
app.UseAuthorization();

app.MapControllers();

app.Run();
