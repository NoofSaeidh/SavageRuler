<template>
  <div>
    <h1 class="danger">{{id}}</h1>
    <b-container class="content" fluid>
      <b-row class="my-1" v-for="value in fieldValues" :key="value.field.key">
        <b-col sm="3">
          <label :for="`field-${value}`">{{ value.field.label }}</label>
        </b-col>
        <b-col sm="9">
          <b-form-input readonly :id="`field-${value}`" :value="value.value"></b-form-input>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from 'vue-property-decorator';
import { ServerList, ServerReponseList, ServerReponse, ServerError } from '@/types/server';
import { Entity } from '@/types/entity';
import { Modal } from 'bootstrap-vue';
// import { FormField, FormFieldValue, convertObjToFormFields } from '@/types/form';

@Component({})
export default class ModalForm<T extends Entity<TKey>, TKey> extends Vue {
  // @Prop() public item!: T;
  // @Prop() public fields!: FormField[];
  // @Prop() public id!: number;

  // public get fieldValues(): FormFieldValue[] {
  //  return convertObjToFormFields(this.item, this.fields);
  // }

  // public $ref!: {
  //   modalInfo: Modal;
  // };

  // public showModal(record: T, index: number) {
  //   this.$ref.modalInfo.show();
  // }
}
</script>
