using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Serverofapp.Models
{
    [Table("dailycollection")]
    public class DailyCollection
    {
        [Key]
        [Column("collection_id")]
        public int CollectionId { get; set; }

        [Column("date")]
        public DateTime Date { get; set; }
        public ICollection<DailyMonument> DailyMonuments { get; set; }
    }
}
