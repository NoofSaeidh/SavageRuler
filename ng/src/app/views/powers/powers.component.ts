import { Component, OnInit } from '@angular/core';
import { ApiCrudService } from 'src/app/api/services/api-crud.service';
import { Power } from '../../api/entities/powers/descriptors/power';
import { ApiDescriptor } from 'src/app/api/types/api-descriptor';
import { powerApiDescriptor } from '../../api/entities/powers/descriptors/power-api-descriptor';
import { PowersApiService } from 'src/app/api/entities/powers/powers.api.service';

@Component({
  selector: 'sr-powers',
  templateUrl: './powers.component.html',
  styleUrls: ['./powers.component.scss'],
})
export class PowersComponent implements OnInit {
  items: Power[];

  constructor(private apiService: PowersApiService) {}

  ngOnInit() {
    this.getItems();
  }

  getItems() {
    this.apiService
      .getAll()
      .subscribe(result => (this.items = result.result.items));
  }
}
