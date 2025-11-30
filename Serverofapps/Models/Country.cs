using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Serverofapp.Models
{
    [Table("country")]
    public class Country
    {
        [Key]
        [Column("country_id")]
        public int CountryId { get; set; }

        [Column("name")]
        public string Name { get; set; } = null!;

        public List<Monument> Monuments { get; set; } = new();
    }
}
