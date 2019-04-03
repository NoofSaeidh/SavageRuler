import { Injectable, TemplateRef } from '@angular/core';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap';

import { EventModalTemplates } from './event-modal-templates';

export interface ModalRef<R = any> extends BsModalRef {
  content?: R | null;
}

export interface IEventModal<T = void, R = any> {
  showModal(input: T): ModalRef<R>;
}

interface EventModalInput {
  content: string | TemplateRef<any> | any;
  config?: ModalOptions;
}

@Injectable({
  providedIn: 'root',
})
export class EventModalService implements IEventModal<EventModalInput> {
  private _templates: EventModalTemplates;

  constructor(private modalService: BsModalService) {}

  get templates(): EventModalTemplates {
    if (!this._templates) {
      this._templates = new EventModalTemplates(this);
    }
    return this._templates;
  }

  showModal<R>(input: EventModalInput): ModalRef<R>;
  showModal(input: EventModalInput): BsModalRef {
    return this.modalService.show(input.content, input.config);
  }
}
