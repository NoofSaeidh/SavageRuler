import { Injectable, TemplateRef } from '@angular/core';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class EventModalService {
  constructor(private modalService: BsModalService) {}

  showModal(
    content: string | TemplateRef<any> | any,
    config?: ModalOptions,
  ): BsModalRef {
    return this.modalService.show(content, config);
  }
}
