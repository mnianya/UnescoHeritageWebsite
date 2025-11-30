using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Serverofapp.Models
{
    [Table("photo")]
    public class Photo
    {
        [Key]
        [Column("photo_id")]
        public int PhotoId { get; set; }

        [Column("monument_id")]
        public int MonumentId { get; set; }

        [Column("photo_url")]
        public string Url { get; set; } = null!;
    }
}

