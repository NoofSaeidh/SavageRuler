using System.ComponentModel.DataAnnotations;

namespace SavageRuler.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}
