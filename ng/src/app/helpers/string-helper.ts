export class StringHelper {
  // replaces all such inputs in string: {id} to args.id
  // todo: the same for array??
  static objectReplace(input: string, args: {} | []): string {
    for (const [key, value] of Object.entries(args)) {
      input = input.split(`{${key}}`).join(value);
    }
    return input;
  }

  static capitalize(input: string): string {
    return input.replace(/^\w/, c => c.toUpperCase());
  }

  static toHtmlWhitespaces(input: string): string {
    return input
      .replace(/ /g, '&nbsp;')
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
      .replace(/\n/g, '<br />');
  }

  static tryParseBoolean(input: string): boolean | null {
    if (input.toLowerCase() === 'true') {
      return true;
    }
    if (input.toLowerCase() === 'false') {
      return false;
    }
    return null;
  }
}
