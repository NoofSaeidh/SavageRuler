import { State } from './state';

export class LoadState<T> extends State<T | null> {
  readonly isLoaded: boolean;
  readonly isLoading: boolean;

  constructor(
    value: T = null,
    isLoaded: boolean = false,
    isLoading: boolean = false,
  ) {
    super(value);
    this.isLoaded = isLoaded;
    this.isLoading = isLoading;
  }

  static fromLoading<T>(): LoadState<T> {
    return new LoadState<T>(null, false, true);
  }
  static fromLoaded<T>(value: T): LoadState<T> {
    return new LoadState(value, true, false);
  }
}
