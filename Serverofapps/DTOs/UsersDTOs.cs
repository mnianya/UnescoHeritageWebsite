namespace Serverofapp.DTOs
{
    public class UsersDTOs
    {
        public class RegisterDto
        {
            public string Login { get; set; } = null!;
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;
        }

        public class LoginDto
        {
            public string Login { get; set; } = null!;
            public string Password { get; set; } = null!;
        }

        public class UpdateUserDto
        {
            public string Login { get; set; }          
            public string? NewLogin { get; set; }      
            public string? Email { get; set; }
            public string? Password { get; set; }
            public string? PhotoUrl { get; set; }
        }
    }
}
