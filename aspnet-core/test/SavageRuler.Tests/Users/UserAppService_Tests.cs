﻿using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FluentAssertions;
using Xunit;
using Abp.Application.Services.Dto;
using SavageRuler.Users;
using SavageRuler.Users.Dto;

namespace SavageRuler.Tests.Users
{
    public class UserAppService_Tests : SavageRulerTestBase
    {
        private readonly IUserAppService _userAppService;

        public UserAppService_Tests()
        {
            _userAppService = Resolve<IUserAppService>();
        }

        [Fact]
        public async Task GetUsers_Test()
        {
            // Act
            var output = await _userAppService.GetAll(new PagedUserResultRequestDto{MaxResultCount=20, SkipCount=0} );

            // Assert
            output.Items.Count.Should().BeGreaterThan(0);
        }

        [Fact]
        public async Task CreateUser_Test()
        {
            // Act
            await _userAppService.Create(
                new CreateUserDto
                {
                    EmailAddress = "john@volosoft.com",
                    IsActive = true,
                    Name = "John",
                    Surname = "Nash",
                    Password = "123qwe",
                    UserName = "john.nash"
                });

            await UsingDbContextAsync(async context =>
            {
                var johnNashUser = await context.Users.FirstOrDefaultAsync(u => u.UserName == "john.nash");
                johnNashUser.Should().NotBeNull();
            });
        }
    }
}
