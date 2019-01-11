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
import {fieldsHelper} from '@/helpers/fields-helper';

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
    return fieldsHelper.convertObjToFieldValues<FormField>(this.item, this.fields);
  }
}
</script>
