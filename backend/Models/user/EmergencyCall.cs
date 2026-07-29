using System.Text.Json.Serialization;

public class EmergencyCall
{
        public int Id{ set; get; }
    public string? EmergencyName { set; get; } = null!;
    public string? EmergencyPhone { set; get; } = null!;
        [JsonIgnore]
        public Users User { get; set; }
    public string UserId{ get; set; }
}
