export class LogHelper {
  static logGroup(name: string, ...args: any) {
    console.group(name);
    for (const arg of args) {
      console.log(arg);
    }
    console.groupEnd();
  }
  static logGroupCallback(name: string, callback: () => void, ...args: any) {
    console.group(name);
    console.group('before');
    for (const arg of args) {
      console.log(arg);
    }
    console.groupEnd();
    callback();
    console.group('after');
    for (const arg of args) {
      console.log(arg);
    }
    console.groupEnd();
    console.groupEnd();
  }
}
