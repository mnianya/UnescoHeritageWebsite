using Microsoft.EntityFrameworkCore;
using Serverofapp.Models;

namespace Serverofapp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Users> Users { get; set; }

        public DbSet<DailyCollection> DailyCollection { get; set; }
        public DbSet<DailyMonument> DailyMonument { get; set; }
        public DbSet<Monument> Monument { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Favorite> Favorite { get; set; }
        public DbSet<Review> Review { get; set; }
        public DbSet<Category> MonumentCategory { get; set; }
        public DbSet<Country> Country { get; set; }
        public DbSet<Photo> Photo { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DailyCollection>(entity =>
            {
                entity.ToTable("dailycollection"); 
                entity.HasKey(e => e.CollectionId);
                entity.Property(e => e.CollectionId).HasColumnName("collection_id");
                entity.Property(e => e.Date).HasColumnName("date");
            });

            modelBuilder.Entity<DailyMonument>(entity =>
            {
                entity.ToTable("dailymonument");
                entity.HasKey(e => e.DailyMonumentId);
                entity.Property(e => e.DailyMonumentId).HasColumnName("daily_monument_id");
                entity.Property(e => e.CollectionId).HasColumnName("collection_id");
                entity.Property(e => e.MonumentId).HasColumnName("monument_id");
            });

            modelBuilder.Entity<Monument>(entity =>
            {
                entity.ToTable("monument");
                entity.HasKey(e => e.MonumentId);
                entity.Property(e => e.MonumentId).HasColumnName("monument_id");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.City).HasColumnName("city");
            });

            modelBuilder.Entity<Photo>(entity =>
            {
                entity.ToTable("photo");
                entity.HasKey(e => e.PhotoId);
                entity.Property(e => e.PhotoId).HasColumnName("photo_id");
                entity.Property(e => e.MonumentId).HasColumnName("monument_id");
                entity.Property(e => e.Url).HasColumnName("photo_url");
            });
        }

    }
}