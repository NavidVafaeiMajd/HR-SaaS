using HrSaaS.Models;
using Microsoft.EntityFrameworkCore;

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

builder.Services.AddIdentityApiEndpoints<Users>()
    .AddEntityFrameworkStores<HRSaaSContext>();


var app = builder.Build();

///to map the Identity endpoints:
app.MapIdentityApi<Users>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();   // اضافه شود
app.UseAuthorization();

app.MapControllers();

app.Run();
