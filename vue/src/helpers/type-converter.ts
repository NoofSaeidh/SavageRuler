export class TypeConverter {
  // stringToNumber(input: string): number | null {
  //   return parseFloat(input);
  // }
  // everything that not 'true' is false (case insensetive)
  parseBoolean(input: string): boolean {
    const val = input.toLowerCase();
    if (val === 'true') return true;
    return false;
  }
  // numberToString(input: number): string {
  //   throw new Error('Not implemented');
  // }
  // numberToBoolean(input: number): boolean {
  //   throw new Error('Not implemented');
  // }
  // booleanToString(input: boolean): string {
  //   throw new Error('Not implemented');
  // }
  // booleanToNumber(input: boolean): number {
  //   throw new Error('Not implemented');
  // }
}

export const typeConverter = new TypeConverter();
