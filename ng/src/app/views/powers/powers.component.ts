import { Component, OnInit } from '@angular/core';
import { ApiCrudService } from 'src/app/api/services/api-crud.service';
import { Power } from '../../api/entities/powers/descriptors/power';
import { PowersApiService } from 'src/app/api/entities/powers/powers.api.service';
import { ViewDescriptor } from 'src/app/types/descriptors/view-descriptor';
import { powerViewDescriptor } from './descriptors/power-view-descriptor';
import { LoadListStateService } from 'src/app/state/load/load-list-state.service';
import { LOAD_LIST_STATE, LOAD_SINGLE_STATE } from 'src/app/ui/screens/readonly-screen/readonly-screen.component';
import { LoadStateService } from 'src/app/state/load/load-state.service';

@Component({
  selector: 'sr-powers',
  templateUrl: './powers.component.html',
  styleUrls: ['./powers.component.scss'],
  providers: [
    {provide: ApiCrudService, useClass: PowersApiService},
    {provide: ViewDescriptor, useValue: powerViewDescriptor},
    {provide: LOAD_LIST_STATE, useClass: LoadStateService},
    {provide: LOAD_SINGLE_STATE, useClass: LoadStateService},
  ]
})
export class PowersComponent implements OnInit {
  ngOnInit() {}
}
