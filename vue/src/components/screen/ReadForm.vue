<template>
  <div>
    <ReadField v-for="[key, field, value] in fields" :key="key" :field="field" :value="value"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Entity } from '@/types/entity';

import { ViewObjectDescriptor, FormField } from '@/types/view-object';
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

  // todo: add real checkings?
  get fields(): Array<[string, FormField, any]> | undefined {
    if (!this.descriptor.formFields) {
      return;
    }
    const result: Array<[string, FormField, any]> = [];
    for (const [key, value] of Object.entries(this.item)) {
      const field = this.descriptor.formFields[key];
      if (!field || value === undefined) {
        continue;
      }
      result.push([key, field, value]);
    }
    return result;
  }
}
</script>
