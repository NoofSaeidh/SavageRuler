import { ApiCrudService } from 'src/app/api/services/api-crud.service';
import { PowersApiService } from 'src/app/api/entities/powers/powers.api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UiModule } from 'src/app/ui/ui.module';
import {
  TestModuleMetadata,
  TestBedStatic,
  TestBed,
} from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { EntityViewDescriptor } from 'src/app/types/descriptors/view-descriptor';
import { powerViewDescriptor } from 'src/app/views/powers/descriptors/power-view-descriptor';
import { CollapseModule, ModalModule } from 'ngx-bootstrap';
import { LocalStorageService, WebStorageModule } from 'ngx-store';
import { ApiDescriptor } from 'src/app/api/types/api-descriptor';
import { JwtModule } from '@auth0/angular-jwt';
import { authJwtModuleOptions } from 'src/app/auth/auth-jwt-module-options';
import { LocalizationDictionary } from 'src/app/localization/localization-dictionary';

export class SrTestBed {
  static defaultApiMetadata(
    moduleDef?: TestModuleMetadata,
  ): TestModuleMetadata {
    const metadata: TestModuleMetadata = {
      imports: [
        HttpClientTestingModule,
        WebStorageModule,
        JwtModule.forRoot(authJwtModuleOptions),
      ], // todo: stub for local storage
      providers: [
        {
          provide: ApiDescriptor,
          useValue: new ApiDescriptor({
            name: 'test',
            methods: { test: { httpMethod: 'GET', url: '/test' } },
          }),
        },
        { provide: ApiCrudService, useClass: PowersApiService },
        { provide: EntityViewDescriptor, useValue: powerViewDescriptor },
      ],
    };
    return this.mergeMetadata(metadata, moduleDef);
  }

  static defaultUiComponentsMetadata(
    moduleDef?: TestModuleMetadata,
  ): TestModuleMetadata {
    return this.mergeMetadata(
      this.defaultApiMetadata({
        imports: [AppModule, CollapseModule, ModalModule],
        providers: [{ provide: LocalizationDictionary, useValue: {} }],
      }),
      moduleDef,
    );
  }

  static defaultViewComponentsMetadata(
    moduleDef?: TestModuleMetadata,
  ): TestModuleMetadata {
    return this.mergeMetadata(
      this.defaultUiComponentsMetadata({
        imports: [UiModule],
      }),
      moduleDef,
    );
  }

  private static mergeArrays<T>(left?: T[], right?: T[]): T[] {
    if (!left) {
      return right;
    }
    if (!right) {
      return left;
    }
    return [...left, ...right];
  }

  private static mergeMetadata(
    left: TestModuleMetadata,
    right?: TestModuleMetadata,
  ) {
    if (!right) {
      return left;
    }
    left.imports = this.mergeArrays(left.imports, right.imports);
    left.declarations = this.mergeArrays(left.declarations, right.declarations);
    left.providers = this.mergeArrays(left.providers, right.providers);
    left.schemas = this.mergeArrays(left.schemas, right.schemas);
    return left;
  }

  private static mergeMetadataArray(...args: TestModuleMetadata[]) {
    let result: TestModuleMetadata;
    for (const [index, value] of args.entries()) {
      if (index === 0) {
        result = value;
      } else {
        result = this.mergeMetadata(result, value);
      }
    }
    return result;
  }
}
