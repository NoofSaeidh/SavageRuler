import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadStateService } from './load-state.service';

@Injectable()
export class LoadListStateService<T> extends LoadStateService<T[]> {
  loadList(source: Observable<T[]>): void {
    super.load(source);
  }
}
