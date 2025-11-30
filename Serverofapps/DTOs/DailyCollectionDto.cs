using System;
using System.Collections.Generic;

namespace Serverofapp.Dto
{
    public class DailyCollectionDto
    {
        public List<string> Names { get; set; } = new List<string>(); 
        public DateTime Date { get; set; } 
    }
}