using Serverofapp.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Serverofapp.Models
{
    [Table("daily_monument")]
    public class DailyMonument
    {
        [Key]
        [Column("daily_monument_id")]
        public int DailyMonumentId { get; set; }

        [Column("monument_id")]
        public int MonumentId { get; set; }

        [ForeignKey(nameof(DailyCollection))]
        [Column("collection_id")]
        public int CollectionId { get; set; }

        public Monument Monument { get; set; }
        public DailyCollection DailyCollection { get; set; }
    }
}
