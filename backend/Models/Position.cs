public class Position :IAuditable
{
    public int Id { set; get; }
    public string Name { set; get; }

    public Departments Department { set; get; }

    public DateTime CreatedAt { set; get; }

    public DateTime? UpdatedAt { set; get; }
}