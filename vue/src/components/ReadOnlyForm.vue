<template>
  <div>
    <ReadOnlyField
      v-for="[key, field, value] in fields"
      :key="key"
      :field="field"
      :value="value"
    ></ReadOnlyField>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Entity } from '@/types/entity';

import ReadOnlyField from './ReadOnlyField.vue';
import { ViewObjectDescriptor, FormField } from '@/types/view-object';

@Component({
  components: {
    ReadOnlyField,
  },
})
export default class ReadOnlyScreen<T extends Entity<TKey>, TKey> extends Vue {
  @Prop() descriptor!: ViewObjectDescriptor<T>;
  @Prop() item!: T;

  // todo: add real checkings?
  get fields(): Array<[string, FormField | undefined, any]> | undefined {
    if (!this.descriptor.formFields) {
      return;
    }
    const result: Array<[string, FormField | undefined, any]> = [];
    for(const [key, value] of Object.entries(this.item)){
      result.push([key, this.descriptor.formFields[key], value]);
    }
    return result;
  }
}
</script>
