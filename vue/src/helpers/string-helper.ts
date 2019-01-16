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
};
