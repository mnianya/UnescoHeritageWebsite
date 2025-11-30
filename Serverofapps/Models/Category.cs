using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Serverofapp.Models
{
    [Table("monumentcategory")]
    public class Category
    {
        [Key]
        [Column("category_id")]
        public int CategoryId { get; set; }

        [Column("name")]
        public string Name { get; set; } = null!;

        public List<Monument> Monuments { get; set; } = new();
    }
}
