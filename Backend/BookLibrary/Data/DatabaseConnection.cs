using System;
using BookLibrary.Model;
using Microsoft.EntityFrameworkCore;


namespace BookLibrary.Data;

public class DatabaseConnection : DbContext
{
      public DatabaseConnection(DbContextOptions<DatabaseConnection> options) : base(options)
    {
        
    }

    public  DbSet<Book> Books { get; set;}
    public  DbSet<User> Users { get; set;}
    public  DbSet<Category> Categories { get; set;}
    public  DbSet<Genre> Genres { get; set;}

}
