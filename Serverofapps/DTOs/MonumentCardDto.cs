namespace Serverofapp.Dto
{
    public class MonumentCardDto
    {
        public int MonumentId { get; set; }
        public string Name { get; set; } = null!;
        public string? City { get; set; }
        public string? PhotoUrl { get; set; }
    }
}