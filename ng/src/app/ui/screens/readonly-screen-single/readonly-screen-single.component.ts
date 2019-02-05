import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';

import { IEntity, EntityKey } from 'src/app/api/types/ientity';
import { ApiCrudService } from 'src/app/api/services/api-crud.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'sr-readonly-screen-single',
  templateUrl: './readonly-screen-single.component.html',
  styleUrls: ['./readonly-screen-single.component.scss'],
})
export class ReadonlyScreenSingleComponent<
  T extends IEntity<TKey>,
  TKey extends EntityKey
> implements OnInit {
  constructor(protected router: Router) {}
  @Input() item: T | null;
  ngOnInit() {}

  openGrid() {
    this.router.navigate(['powers/grid'], {});
  }
}
