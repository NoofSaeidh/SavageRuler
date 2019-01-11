<template>
  <b-row class="text-left">
    <b-col cols="2" lg="1">
      <b v-text="title"/>: 
    </b-col>
    <b-col v-text="value">
      <p v-text="value"/>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
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
