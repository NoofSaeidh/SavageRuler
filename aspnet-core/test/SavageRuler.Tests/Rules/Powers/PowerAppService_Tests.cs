using FluentAssertions;
using SavageRuler.Rules.Powers;
using SavageRuler.Rules.Powers.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace SavageRuler.Tests.Rules.Powers
{
    public class PowerAppService_Tests : SavageRulerTestBase
    {
        private IPowerAppService _service;

        public PowerAppService_Tests()
        {
            _service = Resolve<IPowerAppService>();
            CreateTestData();
        }

        [Fact]
        public async Task Update_As_Anonymous_Should_Be_Forbidden()
        {
            var items = await _service.GetAll(new PowerListDto());
            var power = items.Items.First();
            var newPower = new PowerDto
            {
                Id = power.Id,
                Name = power.Name + " test it",
                Book = "BK",
                Text = "Text"
            };
            _service
                .Invoking(s => s.Update(newPower).Wait())
                .Should()
                .Throw<Exception>("update should be restricted for anonumous user");
        }

        [Fact]
        public void Create_As_Anonymous_Should_Be_Forbidden()
        {
            var newPower = new PowerDto
            {
                Name = "new name",
                Book = "BK",
                Text = "Text"
            };
            _service
                .Invoking(s => s.Create(newPower).Wait())
                .Should()
                .Throw<Exception>("update should be restricted for anonumous user");
        }

        [Fact]
        public async Task Delete_As_Anonymous_Should_Be_Forbidden()
        {
            var items = await _service.GetAll(new PowerListDto());
            var power = items.Items.First();
            _service
                .Invoking(s => s.Delete(power).Wait())
                .Should()
                .Throw<Exception>("update should be restricted for anonumous user");
        }

        [Fact]
        public async Task Delete_As_Manager_Should_Work()
        {
            var items = await _service.GetAll(new PowerListDto());
            var power = items.Items.First();
            LoginAsHostAdmin();
            _service
                .Invoking(s => s.Delete(power).Wait())
                .Should()
                .NotThrow();
        }

        [Fact]
        public void GetAll_As_Anonymous_Should_Work()
        {
            _service.Invoking(s => s.GetAll(new PowerListDto()).Wait()).Should().NotThrow();
        }

        private void CreateTestData()
        {
            UsingDbContext(context =>
            {
                context.Powers.AddRange(
                    new Power { Book = "DL", Name = "Power1", Text = "Text 1" },
                    new Power { Book = "HR", Name = "Power2", Text = "Text 2 Mock" }
                );
            });
        }
    }
}
