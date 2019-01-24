import { Component, OnInit } from '@angular/core';
import { PowersService } from '../api/powers/powers.service';
import { Power } from '../types/api/power';

@Component({
  selector: 'sr-powers',
  templateUrl: './powers.component.html',
  styleUrls: ['./powers.component.scss'],
})
export class PowersComponent implements OnInit {
  powers: Power[];

  private sorted = false;

  get text() {
    if (!this.powers) {
      return null;
    }
    return JSON.stringify(this.powers);
  }

  constructor(private _service: PowersService) {}

  ngOnInit() {
    this.fetchAll();
  }

  fetchAll() {
    this._service.getAll().subscribe(powers => (this.powers = powers));
  }

  sortBy(by: string | any): void {

    this.powers.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }
      return 0;
    });

    this.sorted = !this.sorted;
  }

}
