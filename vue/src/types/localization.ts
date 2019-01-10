export interface LanguageInfo {
  name: string;
  displayName: string;
  icon: string;
  isDefault: boolean;
  isDisabled: boolean;
  isRightToLeft: boolean;
}

export interface SourceInfo {
  name: string;
  type: string;
}

// simple object actually
// todo: use real Map instead?
export interface LocalizationMap {
  [keyof: string]: string | undefined;
}
