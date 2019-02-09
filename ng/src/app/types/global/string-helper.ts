export class StringHelper {
  // replaces all such inputs in string: {id} to args.id
  // todo: the same for array??
  static objectReplace(input: string, args: {}): string {
    for (const [key, value] of Object.entries(args)) {
      input = input.replace(new RegExp(`{${key}}`), String(value));
    }
    return input;
  }
}