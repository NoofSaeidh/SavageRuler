<template>
  <div v-if="show">
    <hr v-if="field.addHorizontalRuler">
    <b-row class="text-left">
      <b-col v-if="!field.hideLabel" lg="2" md="3" sm="3">
        <b v-text="field.label"/>:
      </b-col>
      <b-col v-text="value">
        <p v-text="value"/>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FormField } from '@/types/view-object';
import {stringHelper} from '@/helpers/string-helper';

@Component({})
export default class ReadOnlyField extends Vue {
  @Prop() field!: FormField;
  @Prop() value!: any;
  get show(): boolean {
    if (this.value == null && !this.field.showNullValue) {
      return false;
    }
    return true;
  }

  get encodedValue() {
    return stringHelper.encodeToHtml(this.value as string);
  }
}
</script>
