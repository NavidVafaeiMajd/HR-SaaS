using System.Text.Json.Serialization;
using HrSaaS.Infrastructure.Bootstrap;
using HrSaaS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder
    .Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContextPool<HRSaaSDbContext>(
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

//add corse

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "Frontend",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
    );
});

//add auth
builder.Services.AddAuthorization(option =>
{
    foreach (var permission in Enum.GetValues<Permission>())
    {
        option.AddPolicy(
            permission.ToString(),
            policy => policy.Requirements.Add(new PermissionRequirement(permission.ToString()))
        );
    }
});

//change defulte cliam system with cutome for generate permition on it
builder.Services.AddScoped<IUserClaimsPrincipalFactory<Users>, AppClaimsPrincipalFactory>();

//automatic check of permission
builder.Services.AddScoped<IAuthorizationHandler, PermissionHandler>();
builder
    .Services.AddIdentity<Users, Role>()
    .AddEntityFrameworkStores<HRSaaSDbContext>()
    .AddDefaultTokenProviders();

///////////Set Image service
///
builder.Services.AddScoped<IImageService, ImageService>();

/////////add notification system
///
///
builder.Services.AddScoped<INotificationService, NotificationService>();

////
///
/// it system that when you add a new handler it's understand and sub that
///
builder.Services.AddScoped<IEventPublisher, EventPublisher>();

///
/// add each handler
builder.Services.AddScoped<IEventHandler<UserRequestedEvent>, UserRequestedNotificationHandler>();
builder.Services.AddScoped<IEventHandler<AnnouncementRequestedEvent>, AnnouncementCreatedNotificationHandler>();
builder.Services.AddScoped<IEventHandler<LeaveRequestedEvent>, LeaveCreatedNotificationHandler>();


///
/////add cookies config

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "HrSaaS.Auth";

    options.Cookie.HttpOnly = true;

    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;

    options.Cookie.SameSite = SameSiteMode.Lax;

    options.ExpireTimeSpan = TimeSpan.FromMinutes(60);

    options.SlidingExpiration = true;

    options.LoginPath = "/api/auth/login";

    options.LogoutPath = "/api/auth/logout";

    options.AccessDeniedPath = "/api/auth/forbidden";
});

builder.Services.AddOpenApiDocument(options =>
{
    options.Title = "HR SaaS API";
    options.Version = "v1";
});


///
/// add hub for signalR
///
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseOpenApi();

app.UseSwaggerUi();

///
/// add hub for signalR
///
app.MapHub<NotificationHub>("/hubs/notification");

///bootstrap for create initial admin and roll
/// //just for times that you just run the app for the first time and you want to create an admin user and role
// await app.BootstrapAsync();

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
var uploadPath = Path.Combine(builder.Environment.ContentRootPath, "..", "storage", "uploads");

Directory.CreateDirectory(uploadPath);

app.UseStaticFiles(
    new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(uploadPath),
        RequestPath = "/uploads",
    }
);
app.Run();
