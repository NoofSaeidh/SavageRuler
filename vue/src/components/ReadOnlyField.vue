<template>
  <div v-if="show" class="text-left">
    <hr v-if="field.addHorizontalRuler">
    <b-row v-if="!field.hideLabel">
      <b-col cols="3">
        <b v-text="field.label"/>:
      </b-col>
      <b-col v-text="value">
        <p/>
      </b-col>
    </b-row>
    <div v-else>
      <pre v-if="field.preformated" v-text="value"/>
      <p v-else-if="field.encode" v-html="encodedValue"/>
      <p v-else v-text="encodedValue"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FormField } from '@/types/view-object';
import { stringHelper } from '@/helpers/string-helper';

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
