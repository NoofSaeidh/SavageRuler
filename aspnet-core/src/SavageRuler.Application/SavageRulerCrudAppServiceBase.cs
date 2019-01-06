using Abp;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.IdentityFramework;
using Abp.Localization.Sources;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Identity;
using SavageRuler.Authorization.Users;
using SavageRuler.Localization;
using SavageRuler.MultiTenancy;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;

namespace SavageRuler
{
    public class SavageRulerCrudAppServiceBase<TEntity, TEntityDto, TPrimaryKey, TGetAllInput, TCreateInput, TUpdateInput, TGetInput, TDeleteInput> :
        AsyncCrudAppService<TEntity, TEntityDto, TPrimaryKey, TGetAllInput, TCreateInput, TUpdateInput, TGetInput, TDeleteInput>,
        IAsyncCrudAppService<TEntityDto, TPrimaryKey, TGetAllInput, TCreateInput, TUpdateInput, TGetInput, TDeleteInput>,
        ILocalizablePropertiesAppService
        where TEntity : class, IEntity<TPrimaryKey>
        where TEntityDto : IEntityDto<TPrimaryKey>
        where TUpdateInput : IEntityDto<TPrimaryKey>
        where TGetInput : IEntityDto<TPrimaryKey>
        where TDeleteInput : IEntityDto<TPrimaryKey>
    {
        private ILocalizationSource _typeLocalizationSource;

        public SavageRulerCrudAppServiceBase(IRepository<TEntity, TPrimaryKey> repository) : base(repository)
        {
            LocalizationSourceName = SavageRulerConsts.LocalizationSourceName;
            TypeLocalizationSourceName = SavageRulerConsts.Localization.GetTypeSourceName(typeof(TEntity).Name);
        }

        public TenantManager TenantManager { get; set; }

        public ILocalizationSource TypeLocalizationSource
        {
            get
            {
                if (TypeLocalizationSourceName == null)
                {
                    throw new AbpException("Must set LocalizationSourceName before, in order to get LocalizationSource");
                }

                if (_typeLocalizationSource == null || _typeLocalizationSource.Name != LocalizationSourceName)
                {
                    _typeLocalizationSource = LocalizationManager.GetSource(TypeLocalizationSourceName);
                }

                return _typeLocalizationSource;
            }
        }

        public string TypeLocalizationSourceName { get; protected set; }

        public UserManager UserManager { get; set; }

        public virtual IDictionary<string, string> GetLocalizedProperties()
        {
            return TypeLocalizationSource.ToStringsDictionary(true, true);
        }

        protected virtual void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }

        protected virtual Task<Tenant> GetCurrentTenantAsync()
        {
            return TenantManager.GetByIdAsync(AbpSession.GetTenantId());
        }

        protected virtual Task<User> GetCurrentUserAsync()
        {
            var user = UserManager.FindByIdAsync(AbpSession.GetUserId().ToString());
            if (user == null)
            {
                throw new Exception("There is no current user!");
            }

            return user;
        }

        // localize but for properties (use different source)
        protected virtual string LP(string name)
        {
            return TypeLocalizationSource.GetString(name);
        }

        protected virtual string LP(string name, CultureInfo culture)
        {
            return TypeLocalizationSource.GetString(name, culture);
        }
    }
}