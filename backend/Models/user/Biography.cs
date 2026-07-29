public class Biography
{
        public int Id{ set; get; }

    public string? Bio { set; get; } = null!;
    public string? WorkExperience { set; get; } = null!;
    public Users User { get; set; }
    public string UserId{ get; set; }
    
}
