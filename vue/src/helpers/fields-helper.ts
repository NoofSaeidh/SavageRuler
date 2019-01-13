import { ViewField, ViewFieldValue } from '@/types/view-field';
import { localizationHelper } from '@/helpers/localization-helper';
import { arrayHelper } from './array-helper';

export class FieldsHelper {
  toFields(items: Array<ViewField | string>): ViewField[] {
    return items.map(field => {
      if (typeof field === 'string') {
        return {
          key: field,
        };
      }
      return field;
    });
  }

  buildFields<T = undefined>(items: Array<ViewField | string>, titleField?: string, forAll?: T): Array<ViewField & T> {
    let fields = this.toFields(items);
    if (titleField) {
      const title = fields.find(f => f.key === titleField);
      if (title) {
        title.isTitle = true;
      }
    }
    if (forAll) {
      fields = fields.map(f => ({ ...f, ...forAll }));
    }
    return fields as Array<ViewField & T>;
  }

  // todo: perhaps should redesign
  async localizeFields(typeName: string, ...items: ViewField[][]) {
    const iitems = arrayHelper.flatten(items);
    await localizationHelper.localizeLabels(typeName, iitems);
  }

  convertObjToFieldValues<T extends ViewField = ViewField>(value: object, fields: T[]): Array<ViewFieldValue<T>> {
    // todo: rewrite?
    return fields.map(f => ({ field: f, value: (value as any)[f.key] }));
  }

  getTitleKey(fields: ViewField[]): string | undefined {
    for (const field of fields) {
      if (field.isTitle) {
        return field.key;
      }
    }
  }

  getTitle(fields: ViewFieldValue[]): string | undefined {
    for (const field of fields) {
      if (field.field.isTitle) {
        return field.value;
      }
    }
  }
}

export const fieldsHelper = new FieldsHelper();
