<template>
  <div>
    <ReadOnlyField
      :fieldValue="fieldValue"
      v-for="fieldValue in fieldValues"
      :key="fieldValue.field.key"
    ></ReadOnlyField>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// import { OnRowClicked } from '@/types/delegates';
import { FormField, ViewFieldValue } from '@/types/view-field';
import { Entity } from '@/types/entity';

import ReadOnlyField from './ReadOnlyField.vue';

@Component({
  components: {
    ReadOnlyField,
  },
})
export default class ReadOnlyScreen<T extends Entity<TKey>, TKey> extends Vue {
  @Prop() fields!: FormField[];
  @Prop() item!: T;
  get fieldValues(): Array<ViewFieldValue<FormField>> {
    return this.convertObjToFormFields(this.item, this.fields);
  }


  // todo: move to helper
  convertObjToFormFields(value: object, fields: FormField[]): Array<ViewFieldValue<FormField>> {
    // todo: rewrite?
    return fields.map(f => ({ field: f, value: (value as any)[f.key] }));
  }

}
</script>
