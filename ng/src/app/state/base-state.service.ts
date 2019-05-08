import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { State } from './types/state';

export abstract class BaseStateService<T, S extends State<T> = State<T>> {
  readonly subject: BehaviorSubject<S>;
  protected constructor(initialValue: S) {
    this.subject = new BehaviorSubject(initialValue);
  }

  get state(): S {
    return this.subject.getValue();
  }

  get value(): T {
    return this.state.value;
  }
}
