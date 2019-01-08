<template>
  <div>
    {{id}}
    <div v-if="showModal">
      <ModalForm :item="item" :fields="formFields" :id="id"></ModalForm>
    </div>
    <div>
      <ShortTable appName="Power" :includeFields="tableFields" :onRowClicked="rowClicked"></ShortTable>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from 'vue-property-decorator';
import { Power } from '@/types/power';
import { OnRowClicked } from '@/types/delegates';
import { FormField, FormFieldValue } from '@/types/form';
import ShortTable from '@/components/ShortTable.vue';
import ModalForm from '@/components/ModalForm.vue';

@Component({
  components: {
    ShortTable,
    ModalForm,
  },
})
export default class Powers extends Vue {
  public id: number = 0;
  public showModal = false;
  public formFields: FormField[] = [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'book',
      label: 'Book',
    },
  ];
  public tableFields = ['name', 'book', 'points', 'duration', 'distance', 'rank'];
  public item!: Power;


  public rowClicked(record: Power, index: number, event: MouseEvent) {
    this.item = record;
    this.showModal = true;
    this.id = index;
  }
}
</script>
