import { Component, OnInit } from '@angular/core';
import { PowersApiService } from 'src/app/api/entities/powers/powers.api.service';
import { ApiCrudService } from 'src/app/api/services/api-crud.service';
import { EntityViewDescriptor } from 'src/app/types/descriptors/view-descriptor';
// import { PrimaryScreenStateService } from 'src/app/ui/screens/primary-screen/primary-screen-state.service';

import { powerViewDescriptor } from './descriptors/power-view-descriptor';
// import { PowersStateService } from './services/powers-state.service';

@Component({
  selector: 'sr-powers',
  templateUrl: './powers.component.html',
  styleUrls: ['./powers.component.scss'],
  providers: [
    { provide: ApiCrudService, useClass: PowersApiService },
    { provide: EntityViewDescriptor, useValue: powerViewDescriptor },
    // { provide: PrimaryScreenStateService, useExisting: PowersStateService,  },
  ],
})
export class PowersComponent implements OnInit {
  ngOnInit() {}
}
