<template>
  <div>
    {{temp}}
    <br>
    {{formFields}}
    <br>
    <button @click="rowClicked">Click Me!</button>
    <div v-if="showModal">
      <!-- <ModalForm :item="item" :fields="formFields" :id="id"></ModalForm> -->
    </div>
    <div>
      <!-- <ShortTable appName="Power" :includeFields="tableFields" :onRowClicked="rowClicked"></ShortTable> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from 'vue-property-decorator';
import { Power } from '@/types/power';
import { OnRowClicked } from '@/types/delegates';
import { FormField, FormFieldValue } from '@/types/form';
import abpHelper from '@/global/abp-helper';
import localization from '@/api/localization';
import localizationHelper from '@/helpers/localization-helper';
import ShortTable from '@/components/ShortTable.vue';
import ModalForm from '@/components/ModalForm.vue';

@Component({
  components: {
    ShortTable,
    ModalForm,
  },
})
export default class Powers extends Vue {
  public temp: string = '';
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
    localizationHelper.getLocalizedLabels('Power').then(r => this.formFields = r);
    localization.getLocalizedProperties('Power').then(p => this.temp = JSON.stringify(p));
  }
}
</script>
