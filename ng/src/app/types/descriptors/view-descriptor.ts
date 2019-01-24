import { IEntity, EntityKey } from '../api/ientity';
import { TypeDescriptor } from './type-descriptor';
import { LocalizeDescriptor } from './localize-descriptor';

export class ViewDescriptor<
  T extends IEntity<TKey>,
  TKey extends EntityKey = number
> {
  constructor(
    public readonly typeName: string,
    public readonly titleKey: keyof T,
    public readonly readForm?: FieldDescriptor<T, ReadFormField>,
    public readonly infoGrid?: FieldDescriptor<T, InfoGridField>,
  ) {
    this._locale = null;
  }

  private _locale: string | null;
  // null means fields not localized
  get locale(): string | null {
    return this._locale;
  }
  localize(locale: string, localize: LocalizeDescriptor<T>) {
    // todo: implement
  }
}

export type FieldDescriptor<
  T,
  V extends ViewField = ViewField
> = TypeDescriptor<T, V>;

export interface ViewField {
  label?: string;
}

export interface ReadFormField extends ViewField {
  showNullValue?: boolean; // if true null will be presented (undefined willl not be presented always)
  preformated?: boolean; // use <pre> instead of <p> for value
  addHorizontalRuler?: boolean;
  hideLabel?: boolean;
  encode?: boolean; // replace line breaks and tabs with html tags
}

export interface InfoGridField extends ViewField {
  sortable?: boolean;
}

export interface ReadFormFieldValue {
  label?: string;
  value: any;
  labelClass?: string; // css class
  valueClass?: string; // css class
  preformated?: boolean; // use <pre> instead of <p> for value
  encodeValue?: boolean; // replace line breaks and tabs with html tags
  addHorizontalRuler?: boolean;
}
