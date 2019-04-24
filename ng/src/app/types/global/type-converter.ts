import { StringHelper } from 'src/app/helpers/string-helper';

export class TypeConverter {
  // only string 'true', 'false' is traited as boolean and boolean itself
  static tryParseBoolean(input: any, defaultValue?: boolean): boolean | null {
    if (typeof input === 'boolean') {
      return input;
    }
    if (typeof input === 'string') {
      return StringHelper.tryParseBoolean(input);
    }
    return defaultValue !== undefined ? defaultValue : null;
  }
}
