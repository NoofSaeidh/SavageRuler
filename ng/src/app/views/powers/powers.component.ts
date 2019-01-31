import { Component, OnInit } from '@angular/core';
import { ApiCrudService } from 'src/app/api/services/api-crud.service';
import { Power } from '../../api/entities/powers/descriptors/power';
import { PowersApiService } from 'src/app/api/entities/powers/powers.api.service';
import { ViewDescriptor } from 'src/app/types/descriptors/view-descriptor';
import { powerViewDescriptor } from './descriptors/power-view-descriptor';
import { EntityStateService } from 'src/app/state/entity/entity-state.service';

@Component({
  selector: 'sr-powers',
  templateUrl: './powers.component.html',
  styleUrls: ['./powers.component.scss'],
  providers: [
    {provide: ApiCrudService, useClass: PowersApiService},
    {provide: ViewDescriptor, useValue: powerViewDescriptor},
    EntityStateService,
  ]
})
export class PowersComponent implements OnInit {
  constructor(public state: EntityStateService<Power>){}
  ngOnInit() {}
}
