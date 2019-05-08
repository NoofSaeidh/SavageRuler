export class State<T> {
  readonly date: Date;
  readonly value: T;
  constructor(value: T, date?: Date) {
    this.value = value;
    this.date = date !== undefined ? date : new Date();
  }
}
