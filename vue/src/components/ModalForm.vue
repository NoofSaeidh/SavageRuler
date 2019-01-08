<template>
  <div>
    <p>{{id}}</p>
    <b-container class="content" fluid>
      <b-row class="my-1" v-for="item in items" :key="item.field.key">
        <b-col sm="3">
          <label :for="`field-${item}`">{{ item.field.label }}</label>
        </b-col>
        <b-col sm="9">
          <b-form-input readonly :id="`field-${item}`" :value="item.value"></b-form-input>
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
import { FormField, FormFieldValue } from '@/types/form';

@Component({
  data() {
    return {
      id: 0,
    };
  },
})
export default class ModalForm<T extends Entity<TKey>, TKey> extends Vue {
  public source: T | null = null;
  public fields: FormField[] = [];

  public get items(): FormFieldValue[] {
    // return [
    //   new FormFieldValue({
    //     key: 'name',
    //     label: 'Name',
    //   }, 'Value'),
    // ];
    return [];
    // return FormFieldValue.parse(this.source, this.fields);
  }

  public $ref!: {
    modalInfo: Modal;
  };

  public showModal(record: T, index: number) {
    this.$ref.modalInfo.show();
  }
}
</script>
