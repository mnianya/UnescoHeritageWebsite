using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Serverofapp.Models
{
    [Table("favorite")]
    public class Favorite
    {
        [Key]
        [Column("favorite_id")]
        public int FavoriteId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("monument_id")]
        public int MonumentId { get; set; }

        public Users User { get; set; }
        public Monument Monument { get; set; }
    }

}
