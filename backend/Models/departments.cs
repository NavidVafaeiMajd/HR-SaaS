using System.Text.Json.Serialization;

public class Departments : IAuditable
{
    public int Id { set; get; }
    public string Name { set; get; }

    [JsonIgnore]
    public ICollection<Position> Positions { get; set; } = [];

    public DateTime CreatedAt { set; get; }

    public DateTime? UpdatedAt { set; get; }
}
