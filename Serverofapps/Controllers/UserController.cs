using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serverofapp.Data;
using Serverofapp.DTOs;
using Serverofapp.Models;
using System.Security.Cryptography;
using System.Text;
using static Serverofapp.DTOs.UsersDTOs;

namespace Serverofapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var errors = new Dictionary<string, string>();

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                errors["email"] = "Email уже используется";

            if (await _context.Users.AnyAsync(u => u.Login == dto.Login))
                errors["login"] = "Логин уже используется";

            if (errors.Any())
                return BadRequest(new { errors });

            var user = new Users
            {
                Login = dto.Login,
                Email = dto.Email,
                Password = dto.Password
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Регистрация успешна" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var errors = new Dictionary<string, string>();

            var userByLogin = await _context.Users.FirstOrDefaultAsync(u => u.Login == dto.Login);
            if (userByLogin == null)
            {
                errors["login"] = "Такого логина не существует";
            }
            else
            {
                if (userByLogin.Password != dto.Password)
                    errors["password"] = "Неверный пароль";
            }

            if (errors.Any())
                return BadRequest(new { errors });

            return Ok(new { message = "Вход успешен", userId = userByLogin.Id, login = userByLogin.Login });
        }

        [HttpGet("{login}")]
        public async Task<IActionResult> GetUserByLogin(string login)
        {
            var user = await _context.Users
                .Where(u => u.Login.ToLower() == login.ToLower())
               .Select(u => new {
                   u.Login,
                   u.Email,
                   u.Password,
                   u.PhotoUrl
               })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound("Пользователь не найден");

            return Ok(user);
        }
        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Login == dto.Login);
            if (user == null)
                return NotFound("Пользователь не найден");

            if (!string.IsNullOrEmpty(dto.NewLogin))
                user.Login = dto.NewLogin;
            if (!string.IsNullOrEmpty(dto.Email))
                user.Email = dto.Email;
            if (!string.IsNullOrEmpty(dto.Password))
                user.Password = dto.Password;
            if (!string.IsNullOrEmpty(dto.PhotoUrl))
                user.PhotoUrl = dto.PhotoUrl;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Данные успешно обновлены" });
        }

        [HttpDelete("{login}")]
        public async Task<IActionResult> DeleteUser(string login)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Login == login);
            if (user == null) return NotFound("Пользователь не найден");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Аккаунт успешно удалён" });
        }
    }
}