import { Component, OnInit } from '@angular/core';
import { ApiCrudService } from 'src/app/api/services/api-crud.service';
import { PowersApiService } from 'src/app/api/entities/powers/powers.api.service';
import { EntityViewDescriptor } from 'src/app/types/descriptors/view-descriptor';
import { powerViewDescriptor } from './descriptors/power-view-descriptor';

@Component({
  selector: 'sr-powers',
  templateUrl: './powers.component.html',
  styleUrls: ['./powers.component.scss'],
  providers: [
    {provide: ApiCrudService, useClass: PowersApiService},
    {provide: EntityViewDescriptor, useValue: powerViewDescriptor},
  ]
})
export class PowersComponent implements OnInit {
  ngOnInit() {}
}
