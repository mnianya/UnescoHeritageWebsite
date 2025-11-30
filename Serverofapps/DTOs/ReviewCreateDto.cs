namespace Serverofapp.Dto
{
    public class ReviewCreateDto
    {
        public string UserLogin { get; set; }
        public string MonumentName { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public List<string> Photos { get; set; } = new();
    }
}