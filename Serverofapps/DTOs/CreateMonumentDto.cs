namespace Serverofapp.DTOs
{
    public class CreateMonumentDto
    {
        public string Name { get; set; }
        public string CountryName { get; set; }
        public string CategoryName { get; set; }
        public string City { get; set; }
        public string ShortDescription { get; set; }
        public string History { get; set; }
        public string VisitRecommendations { get; set; }
        public string UnescoLink { get; set; }
        public List<string> PhotosBase64 { get; set; }
    }
}
