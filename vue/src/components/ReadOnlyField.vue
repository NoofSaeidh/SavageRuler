<template>
  <div>
    <hr v-if="hRuler">
    <b-row class="text-left">
      <b-col v-if="!hRuler" lg="2" md="3" sm="3">
        <b v-text="title"/>:
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

@Component({})
export default class ReadOnlyField extends Vue {
  @Prop() field!: FormField;
  @Prop() value!: any;
  get title() {
    return this.field.label;
  }

  get hRuler(): boolean {
    return this.field.type === 'hRuler';
  }
}
</script>
