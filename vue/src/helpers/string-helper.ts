export const stringHelper = {
  replaceAll(input: string, search: string, replacement: string): string {
    const fix = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return input.replace(new RegExp(fix, 'g'), replacement);
  },

  // replaceSymbolsWithHtmlTags
  encodeToHtml(input: string): string {
    let value = this.replaceAll(input, '\n', '<br>');
    value = this.replaceAll(value, '\t', '&emsp;');
    return value;
  },

  format(input: string, ...args: string[]): string {
    if (typeof input !== 'string' || args.length < 1) {
      return input;
    }

    let result = input;
    for (let i = 0; i < args.length; i++) {
      const placeHolder = '{' + (i) + '}';
      result = this.replaceAll(result, placeHolder, args[i]);
    }

    return result;
  },
};
