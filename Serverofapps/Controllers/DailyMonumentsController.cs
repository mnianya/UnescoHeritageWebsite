using Microsoft.AspNetCore.Mvc;
using Serverofapp.Data; // DbContext
using Serverofapp.Models; // модели
using Microsoft.EntityFrameworkCore;
using Serverofapp.Dto;

namespace Serverofapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DailyMonumentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DailyMonumentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDailyMonuments()
        {
            DateTime today = DateTime.Today;

            // Шаг 1: Получение коллекции
            var dailyCollection = await _context.DailyCollection
                .FirstOrDefaultAsync(dc => dc.Date.Date == today);

            if (dailyCollection == null)
                return Ok(new object[0]);

            var collectionId = dailyCollection.CollectionId;

            // Шаг 2: Получение памятников коллекции
            var monumentIds = await _context.DailyMonument
                .Where(dm => dm.CollectionId == collectionId)
                .Select(dm => dm.MonumentId)
                .ToListAsync();

            if (!monumentIds.Any())
                return Ok(new object[0]);

            // Шаг 3: Получение данных памятников
            var monuments = await _context.Monument
                .Where(m => monumentIds.Contains(m.MonumentId))
                .ToListAsync();

            var photos = await _context.Photos
                .Where(p => monumentIds.Contains(p.MonumentId))
                .GroupBy(p => p.MonumentId)
                .Select(g => new
                {
                    MonumentId = g.Key,
                    PhotoUrl = g.OrderBy(p => p.PhotoId).FirstOrDefault().Url
                })
                .ToListAsync();

            // Шаг 4: Формирование результата
            var result = monuments.Select(m => new
            {
                name = m.Name,
                city = m.City,
                photo = photos.FirstOrDefault(p => p.MonumentId == m.MonumentId)?.PhotoUrl ?? ""
            }).ToArray();

            // Шаг 5: Отправка на клиент
            return Ok(result);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateDailyCollection([FromBody] DailyCollectionDto dto)
        {
            if (dto.Names == null || dto.Names.Count != 3)
                return BadRequest(new { message = "Нужно выбрать три памятника" });

            if (dto.Names.Distinct().Count() != 3)
                return BadRequest(new { message = "Памятники должны быть уникальны" });

            // Создаем коллекцию дня
            var dailyCollection = new DailyCollection { Date = dto.Date.Date };
            _context.DailyCollection.Add(dailyCollection);
            await _context.SaveChangesAsync();

            // Добавляем памятники
            foreach (var name in dto.Names)
            {
                var monument = await _context.Monument.FirstOrDefaultAsync(m => m.Name.ToLower() == name.ToLower());
                if (monument == null) return BadRequest(new { message = $"Памятник '{name}' не найден" });

                var dailyMonument = new DailyMonument
                {
                    CollectionId = dailyCollection.CollectionId,
                    MonumentId = monument.MonumentId
                };
                _context.DailyMonument.Add(dailyMonument);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Коллекция дня создана" });
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllDailyCollections()
        {
            var collections = await _context.DailyCollection
                .Include(dc => dc.DailyMonuments)
                .Select(dc => new {
                    collectionId = dc.CollectionId,
                    date = dc.Date,
                    monuments = dc.DailyMonuments
                        .Take(3)
                        .Select(dm => dm.Monument.Name)
                        .ToList()
                })
                .ToListAsync();

            return Ok(collections);
        }

        [HttpDelete("{collectionId}")]
        public async Task<IActionResult> DeleteCollection(int collectionId)
        {
            var collection = await _context.DailyCollection.FindAsync(collectionId);
            if (collection == null)
                return NotFound("Коллекция не найдена");

            _context.DailyCollection.Remove(collection);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Коллекция удалена" });
        }
    }
}