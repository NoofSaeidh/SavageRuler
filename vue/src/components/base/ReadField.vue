<template>
  <div class="text-left">
    <hr v-if="field.addHorizontalRuler">
    <b-row v-if="field.label">
      <b-col :class="field.labelClass">
        <b v-text="field.label" />:
      </b-col>
      <b-col
        :class="field.valueClass"
        v-text="field.value"
      >
      </b-col>
    </b-row>
    <div v-else>
      <pre
        v-if="field.preformated"
        :class="field.valueClass"
        v-text="field.value"
      />
      <p
        v-else-if="field.encode"
        :class="field.valueClass"
        v-html="encodedValue"
      />
      <p 
        v-else 
        :class="field.valueClass"
        v-text="field.value"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FormField, ReadFieldValue } from '@/types/view-object';
import { Size } from '@/types/bootstrap';
import { stringHelper } from '@/helpers/string-helper';

@Component({})
export default class ReadField extends Vue {
  @Prop() field!: ReadFieldValue;

  get encodedValue(): string | undefined {
    if (!this.field.value) return;
    return stringHelper.encodeToHtml(this.field.value as string);
  }
}
</script>
