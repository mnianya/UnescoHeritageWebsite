using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serverofapp.Data;
using Serverofapp.Models;
using System.Threading.Tasks;
using System.Linq;

namespace Serverofapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FavoritesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("addByName")]
        public IActionResult AddFavoriteByName(string userLogin, string monumentName)
        {
            var user = _context.Users.FirstOrDefault(u => u.Login == userLogin);
            if (user == null) return NotFound("Пользователь не найден");

            var monument = _context.Monument.FirstOrDefault(m => m.Name == monumentName);
            if (monument == null) return NotFound("Памятник не найден");

            // Проверяем, нет ли уже такого избранного
            var existing = _context.Favorite.FirstOrDefault(f =>
                f.UserId == user.Id && f.MonumentId == monument.MonumentId);
            if (existing != null) return BadRequest("Уже в избранном");

            _context.Favorite.Add(new Favorite
            {
                UserId = user.Id,
                MonumentId = monument.MonumentId
            });
            _context.SaveChanges();
            return Ok("Добавлено в избранное");
        }

        [HttpDelete("removeByName")]
        public IActionResult RemoveFavoriteByName(string userLogin, string monumentName)
        {
            var user = _context.Users.FirstOrDefault(u => u.Login == userLogin);
            if (user == null) return NotFound("Пользователь не найден");

            var monument = _context.Monument.FirstOrDefault(m => m.Name == monumentName);
            if (monument == null) return NotFound("Памятник не найден");

            var fav = _context.Favorite.FirstOrDefault(f =>
                f.UserId == user.Id && f.MonumentId == monument.MonumentId);
            if (fav == null) return NotFound("Не найдено в избранном");

            _context.Favorite.Remove(fav);
            _context.SaveChanges();
            return Ok("Удалено из избранного");
        }

        [HttpGet("user")]
        public IActionResult GetFavoritesByUser(string userLogin)
        {
            var user = _context.Users.FirstOrDefault(u => u.Login == userLogin);
            if (user == null) return NotFound("Пользователь не найден");

            var favorites = _context.Favorite
                .Where(f => f.UserId == user.Id)
                .Select(f => f.Monument.Name) // возвращаем имена
                .ToList();

            return Ok(favorites);
        }

        [HttpGet("user/details")]
        public IActionResult GetFavoritesDetails(string userLogin)
        {
            var user = _context.Users.FirstOrDefault(u => u.Login == userLogin);
            if (user == null) return NotFound("Пользователь не найден");

            var favorites = _context.Favorite
                .Where(f => f.UserId == user.Id)
                .Select(f => new
                {
                    f.Monument.Name,
                    f.Monument.City,
                    f.Monument.Photos
                })
                .ToList();

            return Ok(favorites);
        }
    }

}
