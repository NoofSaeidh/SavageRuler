import { ErrorHandlerComponent } from '../../elements/error-handler/component/error-handler.component';
import { AlertEventModalComponent } from './components/alert-event-modal/alert-event-modal.component';
import { EventModalService, IEventModal } from './event-modal.service';

export class EventModalTemplates {
  constructor(protected service: EventModalService) {}

  alert: IEventModal<string, AlertEventModalComponent> = {
    showModal: input =>
      this.service.showModal({
        content: AlertEventModalComponent,
        config: {
          initialState: { message: input },
          keyboard: false,
          focus: true,
        },
      }),
  };

  errorHandler: IEventModal<any, ErrorHandlerComponent> = {
    showModal: error =>
      this.service.showModal({
        content: ErrorHandlerComponent,
        config: { initialState: { rawError: error } },
      }),
  };
}
