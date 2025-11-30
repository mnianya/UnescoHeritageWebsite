using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serverofapp.Data;
using Serverofapp.Dto;
using Serverofapp.DTOs;
using Serverofapp.Models;
using System.Reflection.Metadata;

namespace Serverofapp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonumentDetailsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MonumentDetailsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> GetDetails(string name)
        {
            var monument = await _context.Monument
                .Where(m => m.Name.ToLower() == name.ToLower())
                .Select(m => new MonumentDetailsDto
                {
                    MonumentId = m.MonumentId,
                    Name = m.Name,
                    City = m.City,
                    CountryName = m.Country.Name,        
                    CategoryName = m.Category.Name,
                    ShortDescription = m.ShortDescription,
                    History = m.History,
                    VisitRecommendations = m.VisitRecommendations,
                    UnescoLink = m.UnescoLink,
                    Photos = m.Photos.Select(p => p.Url).ToList(),
                    Reviews = m.Reviews
                        .Select(r => new ReviewDto
                        {
                            ReviewId = r.ReviewId,
                            Comment = r.Comment,
                            Rating = r.Rating,
                            ReviewPhoto = r.PhotoUrl,
                            PublishDate = r.PublishDate,
                            UserLogin = r.User.Login,
                            UserPhoto = r.User.PhotoUrl
                        }).ToList()
                })
                .FirstOrDefaultAsync();

            if (monument == null)
                return NotFound("Памятник с таким названием не найден");

            return Ok(monument);
        }

        [HttpGet("filtered")]
        public async Task<IActionResult> GetFilteredMonuments(
           [FromQuery] string? countryName,
           [FromQuery] string? categoryName)
        {
            var query = _context.Monument
                .Include(m => m.Country)
                .Include(m => m.Category)
                .Include(m => m.Photos)
                .AsQueryable();

            if (!string.IsNullOrEmpty(countryName))
                query = query.Where(m => m.Country.Name.ToLower() == countryName.ToLower());

            if (!string.IsNullOrEmpty(categoryName))
                query = query.Where(m => m.Category.Name.ToLower() == categoryName.ToLower());

            var result = await query
                .Select(m => new MonumentCardDto
                {
                    MonumentId = m.MonumentId,
                    Name = m.Name,
                    City = m.City,
                    PhotoUrl = m.Photos.Select(p => p.Url).FirstOrDefault()
                })
                .ToListAsync();

            return Ok(result);
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateMonument([FromBody] CreateMonumentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var country = await _context.Country
                .FirstOrDefaultAsync(c => c.Name.ToLower() == dto.CountryName.ToLower());

            if (country == null)
                return BadRequest("Указанная страна не найдена.");

            var category = await _context.MonumentCategory
                .FirstOrDefaultAsync(c => c.Name.ToLower() == dto.CategoryName.ToLower());

            if (category == null)
                return BadRequest("Указанная категория не найдена.");

            var monument = new Monument
            {
                Name = dto.Name,
                City = dto.City,
                ShortDescription = dto.ShortDescription,
                History = dto.History,
                VisitRecommendations = dto.VisitRecommendations,
                UnescoLink = dto.UnescoLink,
                CountryId = country.CountryId,  
                CategoryId = category.CategoryId 
            };

            _context.Monument.Add(monument);
            await _context.SaveChangesAsync();

            if (dto.PhotosBase64 != null && dto.PhotosBase64.Any())
            {
                foreach (var base64 in dto.PhotosBase64)
                {
                    _context.Photo.Add(new Photo
                    {
                        Url = base64,
                        MonumentId = monument.MonumentId
                    });
                }
                await _context.SaveChangesAsync();
            }

            return Ok(new { monument.MonumentId, Message = "Памятник успешно добавлен!" });
        }

        [HttpGet("search")]
        public IActionResult Search(string query)
        {
            var monuments = _context.Monument
                .Where(m => m.Name.Contains(query))
                .Select(m => new { m.MonumentId, m.Name })
                .ToList();
            return Ok(new { monuments, Message = "Памятник успешно добавлен!" });
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateMonument([FromBody] UpdateMonumentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Ищем памятник по имени
            var monument = await _context.Monument
                .Include(m => m.Photos)
                .FirstOrDefaultAsync(m => m.Name.ToLower() == dto.Name.ToLower());

            if (monument == null)
                return NotFound(new { message = "Памятник не найден" });

            var country = await _context.Country.FirstOrDefaultAsync(c => c.Name.ToLower() == dto.CountryName.ToLower());
            if (country == null) return BadRequest(new { message = "Страна не найдена" });

            var category = await _context.MonumentCategory.FirstOrDefaultAsync(c => c.Name.ToLower() == dto.CategoryName.ToLower());
            if (category == null) return BadRequest(new { message = "Категория не найдена" });

            monument.City = dto.City;
            monument.CountryId = country.CountryId;
            monument.CategoryId = category.CategoryId;
            monument.ShortDescription = dto.ShortDescription;
            monument.History = dto.History;
            monument.VisitRecommendations = dto.VisitRecommendations;
            monument.UnescoLink = dto.UnescoLink;

            var toRemove = monument.Photos.Where(p => !dto.PhotosBase64.Contains(p.Url)).ToList();
            if (toRemove.Any()) _context.Photo.RemoveRange(toRemove);

            var existingUrls = monument.Photos.Select(p => p.Url).ToList();
            foreach (var url in dto.PhotosBase64)
            {
                if (!existingUrls.Contains(url))
                    _context.Photo.Add(new Photo { MonumentId = monument.MonumentId, Url = url });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Памятник обновлён" });
        }
    }
}