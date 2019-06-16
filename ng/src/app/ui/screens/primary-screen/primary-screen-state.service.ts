// import { Injectable } from '@angular/core';
// import { State } from 'src/app/state/types/state';
// import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
// import { FullShowType } from './primary-screen.component';
// import { ArrayElement } from 'src/app/types/global/array-element';
// import { LocalizeDescriptor } from 'src/app/types/descriptors/localize-descriptor';
// import { IEntity, EntityKey } from 'src/app/api/types/ientity';

// export abstract class PrimaryScreenStateService<
//   T extends IEntity<TKey>,
//   TKey extends EntityKey
// > {
//   private _initialized: boolean = false;

//   readonly localizeDescriptor$ = new ReplaySubject<LocalizeDescriptor<T>>(1);
//   readonly items$ = new ReplaySubject<T[] | null>(1);
//   readonly selected$ = new ReplaySubject<ArrayElement<T> | TKey | null>(1);
//   readonly showType$ = new ReplaySubject<FullShowType>(1);
//   readonly editMode$ = new ReplaySubject<boolean | null>(1);
//   readonly isLoading$ = new ReplaySubject<boolean>(1);
//   readonly permissions$ = new ReplaySubject<boolean>(1); // todo: permission types
//   readonly swipeItem$ = new Subject<number>();

//   constructor() {}

//   get initialized(): boolean {
//     return this._initialized;
//   }

//   markInitialized() {
//     this._initialized = true;
//   }
// }
