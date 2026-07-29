using System.Text.Json.Serialization;

public class SocialMedia
{
    public int Id{ set; get; }
    public string? Instagram { set; get; } = null!;
    public string? Twitter { set; get; }= null!;
    public string? Linkedin { set; get; }= null!;
    public string? Email { set; get; } = null!;
        [JsonIgnore]

        public Users User { get; set; }
    public string UserId{ get; set; }

}