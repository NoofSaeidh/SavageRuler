import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { LocalizeDescriptor } from 'src/app/types/descriptors/localize-descriptor';
import {
  EditFormField,
  EditFormTypeEntries,
} from 'src/app/types/descriptors/view-descriptor';
import { LogHelper } from 'src/app/types/global/log-helper';
import { EventModalService } from '../../events/modal/event-modal.service';
import { first } from 'rxjs/operators';

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
      this.form.reset(value);
    }
  }

  @Output() save = new EventEmitter<T>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  elements: Array<{
    id: string;
    key: string;
    title: string;
    field: EditFormField;
    control: AbstractControl;
  }>;

  private _uniquePrefix: string;

  constructor(private _eventService: EventModalService) {
    // todo: more unique?
    this._uniquePrefix = 'edit_form_' + Math.round(Math.random() * 100) + '_';
  }

  ngOnInit() {
    this.initForm();
  }

  get title(): string {
    return this.form.value[this.view.viewType.titleKey];
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit({ ...this._item, ...this.form.value });
    } else {
      this.form.markAsTouched();
      this.form.markAsDirty();
    }
  }

  // todo: move text into component
  onCancel() {
    const modal = this._eventService.templates.alert.showModal(
      'Are you sure? All changes will be lost.',
    );
    modal.content.close.pipe(first()).subscribe(r => {
      modal.hide();
      if (r) {
        this.cancel.emit();
      }
    });
  }

  onReset() {
    const modal = this._eventService.templates.alert.showModal(
      'Are you sure? All changes will be lost.',
    );
    modal.content.close.pipe(first()).subscribe(r => {
      modal.hide();
      if (r) {
        this.form.reset(this._item);
      }
    });
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
      const key = field.key as string;
      this.elements.push({
        id: this._uniquePrefix + key,
        key: key,
        field: field.value,
        title: this._localize[field.key],
        control: control,
      });
    }
  }
}
