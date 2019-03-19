import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { LocalizeDescriptor } from 'src/app/types/descriptors/localize-descriptor';
import {
  EditFormField,
  EditFormTypeEntries,
} from 'src/app/types/descriptors/view-descriptor';

@Component({
  selector: 'sr-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
})
export class EditFormComponent<T> implements OnInit {
  private _localize: LocalizeDescriptor<T>;
  private _item?: T | null;
  @Input() view: EditFormTypeEntries<T>;
  @Input() set localize(value: LocalizeDescriptor<T>) {
    this._localize = value;
    if (this.elements) {
      for (const element of this.elements) {
        element.title = value[element.key];
      }
    }
  }
  @Input() set item(value: T | null) {
    this._item = value;
    if (this.form) {
      this.resetForm();
    }
  }
  @Output() save = new EventEmitter<T>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  elements: Array<{
    key: string;
    title: string;
    field: EditFormField;
    control: AbstractControl;
  }>;

  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  get title(): string {
    return this.form.value[this.view.viewType.titleKey];
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit({ ...this._item, ...this.form.value });
    }
  }

  private initForm() {
    this.form = new FormGroup({});
    this.elements = [];
    for (const field of this.view.entries) {
      const control = new FormControl(
        (this._item && this._item[field.key]) || '',
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

  resetForm() {
    this.form.reset(this._item);
  }
}