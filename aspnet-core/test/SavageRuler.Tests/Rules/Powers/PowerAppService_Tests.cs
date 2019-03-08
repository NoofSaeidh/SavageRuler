using Abp.Authorization;
using Abp.Authorization.Users;
using FluentAssertions;
using SavageRuler.Authorization;
using SavageRuler.Authorization.Users;
using SavageRuler.Rules.Powers;
using SavageRuler.Rules.Powers.Dto;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace SavageRuler.Tests.Rules.Powers
{
    [Trait("Service", nameof(IPowerAppService))]
    public class PowerAppService_Tests : SavageRulerTestBase
    {
        protected const string ManagerUser = "ManagerUser";
        protected const string SimpleUser = "User";
        private IPowerAppService _service;

        public PowerAppService_Tests()
        {
            _service = Resolve<IPowerAppService>();
            CreateTestData();
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
            using (UseLogout())
                _service
                    .Invoking(s => s.Create(newPower).Wait())
                    .Should()
                    .Throw<AbpAuthorizationException>("update should be restricted for anonumous user");
        }

        [Fact]
        public void Create_As_Manager_Should_Work()
        {
            var newPower = new PowerDto
            {
                Name = "new name",
                Book = "BK",
                Text = "Text"
            };
            using (UseLoginAsHost(ManagerUser))
                _service
                    .Invoking(s => s.Create(newPower).Wait())
                    .Should()
                    .NotThrow();
        }

        [Fact]
        public void Create_As_User_Should_Be_Forbidden()
        {
            var newPower = new PowerDto
            {
                Name = "new name",
                Book = "BK",
                Text = "Text"
            };
            using (UseLoginAsHost(SimpleUser))
                _service
                    .Invoking(s => s.Create(newPower).Wait())
                    .Should()
                    .Throw<AbpAuthorizationException>("update should be restricted for anonumous user");
        }

        [Fact]
        public async Task Delete_As_Anonymous_Should_Be_Forbidden()
        {
            var items = await _service.GetAll(new PowerListDto());
            var power = items.Items.First();

            using (UseLogout())
                _service
                    .Invoking(s => s.Delete(power).Wait())
                    .Should()
                    .Throw<AbpAuthorizationException>("update should be restricted for anonumous user");
        }

        [Fact]
        public async Task Delete_As_Manager_Should_Work()
        {
            var items = await _service.GetAll(new PowerListDto());
            var power = items.Items.First();
            using (UseLoginAsHost(ManagerUser))
                _service
                    .Invoking(s => s.Delete(power).Wait())
                    .Should()
                    .NotThrow();
        }

        [Fact]
        public async Task Delete_As_User_Should_Be_Forbidden()
        {
            var items = await _service.GetAll(new PowerListDto());
            var power = items.Items.First();

            using (UseLoginAsHost(SimpleUser))
                _service
                    .Invoking(s => s.Delete(power).Wait())
                    .Should()
                    .Throw<AbpAuthorizationException>("update should be restricted for anonumous user");
        }

        [Fact]
        public void GetAll_As_Anonymous_Should_Work()
        {
            using (UseLogout())
                _service.Invoking(s => s.GetAll(new PowerListDto()).Wait()).Should().NotThrow();
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
            using (UseLogout())
                _service
                    .Invoking(s => s.Update(newPower).Wait())
                    .Should()
                    .Throw<AbpAuthorizationException>("update should be restricted for anonumous user");
        }

        [Fact]
        public async Task Update_As_Manager_Should_Work()
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
            using (UseLoginAsHost(ManagerUser))
                _service
                    .Invoking(s => s.Update(newPower).Wait())
                    .Should()
                    .NotThrow();
        }

        [Fact]
        public async Task Update_As_User_Should_Be_Forbidden()
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
            using (UseLoginAsHost(SimpleUser))
                _service
                    .Invoking(s => s.Update(newPower).Wait())
                    .Should()
                    .Throw<AbpAuthorizationException>("update should be restricted for anonumous user");
        }


        private void CreateTestData()
        {
            // todo: move to base tests class
            using (UseLoginAsHostAdmin())
                UsingDbContext(context =>
                {
                    context.Users.Add(new User
                    {
                        UserName = ManagerUser,
                        Name = ManagerUser,
                        Surname = "Surname",
                        EmailAddress = "powers@user.test",
                        Password = "123",
                        TenantId = null,
                        Permissions = new UserPermissionSetting[]
                        {
                            new UserPermissionSetting
                            {
                                Name = PermissionNames.Manager_Rules,
                                IsGranted = true,
                                TenantId = null,
                            },
                        }
                    });
                    context.Users.Add(new User
                    {
                        UserName = SimpleUser,
                        Name = SimpleUser,
                        Surname = "Surname",
                        EmailAddress = "powers@user.test",
                        Password = "123",
                        TenantId = null,
                    });
                    context.Powers.AddRange(
                        new Power { Book = "DL", Name = "Power1", Text = "Text 1" },
                        new Power { Book = "HR", Name = "Power2", Text = "Text 2 Mock" }
                    );
                });
        }
    }
}