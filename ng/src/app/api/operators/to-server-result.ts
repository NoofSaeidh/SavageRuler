import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServerResponseList, ServerResponse } from '../types/responses';

export const toServerResult = () => <T>(source: Observable<ServerResponse<T>>) =>
source.pipe(map(value => value.result));

export const toServerListResult = () => <T>(
source: Observable<ServerResponseList<T>>,
) => source.pipe(map(value => value.result.items));
