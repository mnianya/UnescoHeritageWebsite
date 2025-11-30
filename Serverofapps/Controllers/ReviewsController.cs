using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serverofapp.Data; 
using Serverofapp.Dto;
using Serverofapp.Models; 

[Route("api/[controller]")]
[ApiController]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("latest3")]
    public async Task<IActionResult> GetLatestReviews()
    {
        try
        {
            var reviews = await _context.Review
                .OrderByDescending(r => r.PublishDate)
                .Take(3)
                .Select(r => new
                {
                    r.Comment,
                    r.Rating,
                    photoUrl = r.PhotoUrl,
                    monumentName = r.Monument.Name,
                    userLogin = r.User.Login,
                    userPhoto = r.User.PhotoUrl
                })
                .ToListAsync();

            return Ok(reviews);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddReview([FromBody] ReviewCreateDto dto)
    {
        if (dto == null) return BadRequest("Нет данных");

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Login == dto.UserLogin);

        if (user == null) return NotFound("Пользователь не найден");

        var monument = await _context.Monument
            .FirstOrDefaultAsync(m => m.Name == dto.MonumentName);

        if (monument == null) return NotFound("Памятник не найден");

        var review = new Review
        {
            UserId = user.Id,
            MonumentId = monument.MonumentId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            PhotoUrl = string.Join(";", dto.Photos),
        };

        _context.Review.Add(review);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Отзыв добавлен", reviewId = review.ReviewId });
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllReviews()
    {
        try
        {
            var reviews = await _context.Review
                .Include(r => r.User)
                .Include(r => r.Monument)
                .OrderByDescending(r => r.PublishDate)
                .Select(r => new
                {
                    r.ReviewId,
                    userLogin = r.User.Login,
                    monumentName = r.Monument != null ? r.Monument.Name : "",
                    r.Rating,
                    r.Comment,
                    PhotoUrls = r.PhotoUrl, 
                    PublishDate = r.PublishDate.ToString("yyyy-MM-dd HH:mm"),
                })
                .ToListAsync();

            return Ok(reviews);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var review = await _context.Review.FindAsync(id);

        if (review == null)
            return NotFound("Отзыв не найден");

        _context.Review.Remove(review);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Отзыв удалён" });
    }
}