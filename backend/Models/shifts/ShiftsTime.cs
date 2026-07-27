public class ShiftTime : IAuditable
{
    public int Id { set; get; }
    public WeekDay DayOfWeek { set; get; }
    public string StartTime { set; get; }
    public string EndTime { set; get; }
    public int ShiftId { set; get; }
    public DateTime CreatedAt { set; get; } 
    public DateTime? UpdatedAt { set; get; } 

    
}