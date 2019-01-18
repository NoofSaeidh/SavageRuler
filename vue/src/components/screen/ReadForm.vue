<template>
  <div class="card border-dark text-dark mb-3">
    <h4
      class="card-header"
      v-if="showTitle"
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

import { ViewObjectDescriptor, FormField, ReadFieldValue } from '@/types/view-object';
import { arrayHelper } from '@/helpers/array-helper';

import ReadField from '../base/ReadField.vue';

@Component({
  components: {
    ReadField,
  },
})
export default class ReadForm<T extends Entity<TKey>, TKey> extends Vue {
  @Prop() descriptor!: ViewObjectDescriptor<T>;
  @Prop() item!: T;
  @Prop() showTitle?: boolean;

  // todo: add real checkings?
  get fields(): Array<[string, ReadFieldValue]> | undefined {
    if (!this.descriptor.formFields) {
      return;
    }
    const result: Array<[string, ReadFieldValue]> = [];
    for (const [key, value] of Object.entries(this.item)) {
      const field = this.descriptor.formFields[key];
      if (!field || value === undefined) {
        continue;
      }
      if (value === null && !field.showNullValue) {
        continue;
      }
      const fieldValue: ReadFieldValue = {
        encodeValue: field.encode,
        label: field.hideLabel ? undefined : field.label,
        labelClass: 'col-sm-3 col-md-4 col-lg-2',
        addHorizontalRuler: field.addHorizontalRuler,
        value,
      };
      result.push([key, fieldValue]);
    }
    return result;
  }

  get title(): string | null {
    if (!this.showTitle) return null;
    return this.item![this.descriptor.titleKey];
  }
}
</script>
