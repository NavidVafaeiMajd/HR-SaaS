using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Moq;

namespace HR.UnitTests;

public class ImageServiceTest
{
    [Fact]
    public async void TestSaveImageAsync()
    {
        //assert
        var env = new Mock<IWebHostEnvironment>();
        env.Setup(x => x.ContentRootPath).Returns(Path.GetTempPath());
        var service = new ImageService(env.Object);

        //action
        var stream = new MemoryStream();
        var formFile = new FormFile(stream, 0, stream.Length, "file", "test.jpg");

        var result = await service.SaveAsync(formFile);

        //result
        result.Should().NotBeNull();
        result.Should().EndWith(".jpg");
    }
}
