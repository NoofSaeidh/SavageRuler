import { ServerError, serverResponseMarker } from '../types/responses';

function _parseServerError(error: any): ServerError | null {
  if (typeof error === 'object' && error[serverResponseMarker] !== undefined) {
    return error.error;
  }
  return null;
}

export function parseServerError(error: any): ServerError | null {
  let result: ServerError | null;
  if ((result = _parseServerError(error))) {
    return result;
  }
  error = error && error.error;
  if (error && (result = _parseServerError(error))) {
    return result;
  }
  return null;
}
