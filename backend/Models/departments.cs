public class Departments : IAuditable
{
    public int Id { set; get; }
    public string Name { set; get; }

    public DateTime CreatedAt { set; get; }

    public DateTime? UpdatedAt { set; get; }
}
