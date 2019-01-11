<template>
  <!--TODO: configurable -->
  <div>
    <b v-text="title"/>: <p v-text="value"/>
  </div> 
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// import { OnRowClicked } from '@/types/delegates';
import { FormField, ViewFieldValue } from '@/types/view-field';

@Component({})
export default class ReadOnlyField extends Vue {
  @Prop() fieldValue!: ViewFieldValue<FormField>;
  get title() {
      return this.fieldValue.field.label || this.fieldValue.field.key;
  }
  get value() {
      return this.fieldValue.value;
  }
}
</script>
