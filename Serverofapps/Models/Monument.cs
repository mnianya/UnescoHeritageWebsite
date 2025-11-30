using Serverofapp.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Metrics;

namespace Serverofapp.Models
{
    [Table("monument")]
    public class Monument
    {
        [Key]
        [Column("monument_id")]
        public int MonumentId { get; set; }

        [Column("country_id")]
        public int CountryId { get; set; }

        [Column("category_id")]
        public int CategoryId { get; set; }

        [Column("name")]
        public string Name { get; set; } = null!;

        [Column("city")]
        public string? City { get; set; }

        [Column("short_description")]
        public string? ShortDescription { get; set; }

        [Column("history")]
        public string? History { get; set; }

        [Column("visit_recommendations")]
        public string? VisitRecommendations { get; set; }

        [Column("unesco_link")]
        public string? UnescoLink { get; set; }
        public List<Review> Reviews { get; set; } = new();
        public List<Photo> Photos { get; set; } = new();
        [ForeignKey("CountryId")]
        public Country? Country { get; set; }

        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }

    }
}