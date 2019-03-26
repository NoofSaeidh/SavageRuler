import { ErrorHandlerInterceptor } from './error-handler.interceptor';
import { EventModalService } from '../../events/modal/event-modal.service';

describe('ErrorHandlerInterceptor', () => {
  it('should create an instance', () => {
    expect(new ErrorHandlerInterceptor({} as EventModalService)).toBeTruthy();
  });
});
