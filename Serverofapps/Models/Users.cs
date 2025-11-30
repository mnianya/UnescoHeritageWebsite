using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Serverofapp.Models
{
    [Table("users")]
    public class Users
    {
        [Key]
        [Column("user_id")]
        public int Id { get; set; }

        [Column("login")]
        public string Login { get; set; } = null!;

        [Column("email")]
        public string Email { get; set; } = null!;

        [Column("password")]
        public string Password { get; set; } = null!;

        [Column("photo_url")]
        public string? PhotoUrl { get; set; } 
    }
}
