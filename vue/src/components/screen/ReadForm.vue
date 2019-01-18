<template>
  <div class="card border-dark text-dark">
    <h4
      class="card-header"
      v-text="title"
    />
    <div class="card-body px-3">
      <ReadField
        v-for="[key, field] in fields"
        :key="key"
        :field="field"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Entity } from '@/types/entity';

import { ViewObjectDescriptor, FormField, ReadFieldValue, ViewFieldDescriptor } from '@/types/view-object';
import { arrayHelper } from '@/helpers/array-helper';

import ReadField from '../base/ReadField.vue';

@Component({
  components: {
    ReadField,
  },
})
export default class ReadForm<T extends Entity<TKey>, TKey> extends Vue {

  // todo: move to global helper
  static convertToFields<TItem>(
    item: TItem,
    formFields: ViewFieldDescriptor<TItem, FormField>,
    labelClass?: string,
    valueClass?: string,
  )
    : Array<[string, ReadFieldValue]> {

    const result: Array<[string, ReadFieldValue]> = [];
    for (const [key, value] of Object.entries(item)) {
      const field = formFields[key as keyof TItem];
      if (!field || value === undefined) {
        continue;
      }
      if (value === null && !field.showNullValue) {
        continue;
      }
      const fieldValue: ReadFieldValue = {
        encodeValue: field.encode,
        addHorizontalRuler: field.addHorizontalRuler,
        label: field.hideLabel ? undefined : field.label,
        value,
        labelClass,
        valueClass,
      };
      result.push([key, fieldValue]);
    }
    return result;
  }

  @Prop() descriptor!: ViewObjectDescriptor<T>;
  @Prop() item!: T;
  @Prop() cssClasses?: { labels?: string, values?: string };

  // todo: move to helper?
  get fields(): Array<[string, ReadFieldValue]> | undefined {
    if (!this.descriptor.formFields) {
      return;
    }
    return ReadForm.convertToFields(this.item, this.descriptor.formFields, this.labelsClass, this.valuesClass);
  }

  get title(): string {
    return this.item![this.descriptor.titleKey];
  }

  private get labelsClass(): string | undefined {
    if (this.cssClasses && this.cssClasses.labels) {
      return this.cssClasses.labels;
    }
    return;
  }

  private get valuesClass(): string | undefined {
    if (this.cssClasses && this.cssClasses.values) {
      return this.cssClasses.values;
    }
    return;
  }


}
</script>
