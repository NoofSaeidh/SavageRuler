import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  EditFormTypeEntries,
  EditFormField,
} from 'src/app/types/descriptors/view-descriptor';
import { LocalizeDescriptor } from 'src/app/types/descriptors/localize-descriptor';
import { TypeEntry } from 'src/app/types/global/type-entry';
import { IEntity } from 'src/app/api/types/ientity';
import { LocalizationDictionary } from 'src/app/localization/localization-dictionary';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  RequiredValidator,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'sr-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
})
export class EditFormComponent<T> implements OnInit {
  private _localize: LocalizeDescriptor<T>;

  @Input() item?: T;
  @Input() view: EditFormTypeEntries<T>;
  @Output() saved = new EventEmitter<T>();
  @Input() set localize(value: LocalizeDescriptor<T>) {
    this._localize = value;
    if (this.elements) {
      for (const element of this.elements) {
        element.title = value[element.key];
      }
    }
  }

  form: FormGroup;

  elements: Array<{
    key: string;
    title: string;
    field: EditFormField;
    control: AbstractControl;
  }>;

  constructor(public L: LocalizationDictionary) {}

  ngOnInit() {
    this.form = new FormGroup({});
    this.elements = [];
    for (const field of this.view.entries) {
      const control = new FormControl(
        (this.item && this.item[field.key]) || '',
        field.value.validators,
      );
      // todo: handle keys numbers (symbols?)
      this.form.addControl(field.key as string, control);
      this.elements.push({
        key: field.key as string,
        field: field.value,
        title: this._localize[field.key],
        control: control,
      });
    }
  }

  get title(): string {
    return this.form.value[this.view.viewType.titleKey];
  }

  save() {
    this.saved.emit(this.item);
  }

  onSubmit() {}

  // getText(entry: TypeEntry<T, EditFormField>): any {
  //   const val = this.item[entry.key];
  //   if (typeof val !== 'string') {
  //     return val;
  //   }
  //   if (entry.value.encode) {
  //     return StringHelper.toHtmlWhitespaces(val);
  //   }
  //   return val;
  // }
}
