using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Serverofapp.Models
{
    [Table("review")]
    public class Review
    {
        [Key]
        [Column("review_id")]
        public int ReviewId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("monument_id")]
        public int MonumentId { get; set; }

        [Column("comment")]
        public string? Comment { get; set; }

        [Column("rating")]
        public int Rating { get; set; }

        [Column("photo_url")]
        public string? PhotoUrl { get; set; }

        [Column("publish_date")]
        public DateTime PublishDate { get; set; } = DateTime.Now;

        [ForeignKey("UserId")]
        public Users User { get; set; }

        [ForeignKey("MonumentId")]
        public Monument Monument { get; set; }
    }
}
