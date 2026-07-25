public class Departments : IAuditable
{
    public string Name { set; get; }

    public DateTime CreatedAt { set; get; }

    public DateTime? UpdatedAt { set; get; }
}
