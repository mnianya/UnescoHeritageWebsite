namespace Serverofapp.Dto
{
    public class MonumentDetailsDto
    {
        public int MonumentId { get; set; }
        public string Name { get; set; } = null!;
        public string? City { get; set; }
        public string? ShortDescription { get; set; }
        public string? History { get; set; }
        public string? VisitRecommendations { get; set; }
        public string? UnescoLink { get; set; }
        public string? CountryName { get; set; }
        public string? CategoryName { get; set; }

        public List<ReviewDto> Reviews { get; set; } = new();

        public List<string> Photos { get; set; } = new();
    }

    public class ReviewDto
    {
        public int ReviewId { get; set; }
        public string? Comment { get; set; }
        public int Rating { get; set; }
        public string? ReviewPhoto { get; set; }
        public DateTime PublishDate { get; set; }
        public string UserLogin { get; set; } = null!;
        public string? UserPhoto { get; set; }
    }
}
