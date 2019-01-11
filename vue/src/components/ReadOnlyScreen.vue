<template>
  <div>
    <div v-if="showModal">
      <!-- <ModalForm :item="item" :fields="formFields" :id="id"></ModalForm> -->
    </div>
    <!-- TODO: add some animation -->
    <div v-if="loading">Loading...</div>
    <!-- TODO: interactive error (in ajax class ??) -->
    <div v-else-if="error">{{error}}</div>
    <div v-else-if="items">
      <ShortTable :items="items" :fields="tableFields" :onRowClicked="rowClicked"></ShortTable>
    </div>
    <!-- TODO: ensures never happen, and delete? -->
    <div v-else>Something went wrong!</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { OnRowClicked } from '@/types/delegates';
import { ViewField, TableField, FormField } from '@/types/view-field';
import { Entity } from '@/types/entity';
import { ApiServiceDescriptor } from '@/types/services';
import { localizationHelper } from '@/helpers/localization-helper';
import { baseAjax } from '@/api/ajax';

import ShortTable from './ShortTable.vue';
import ModalForm from './ModalForm.vue';
import ReadOnlyForm from './ReadOnlyForm.vue';

@Component({
  components: {
    ShortTable,
    ModalForm,
    ReadOnlyForm
  },
})
export default class ReadOnlyScreen<T extends Entity<TKey>, TKey> extends Vue {
  @Prop() apiDescriptor!: ApiServiceDescriptor;
  // not localized
  @Prop() formFields!: Array<FormField | string> | null;
  @Prop() tableFields!: Array<FormField | string> | null;
  // for localization
  @Prop() localizeTypeName!: string | null;

  showModal: boolean = false;
  selected: T | null = null;
  items: T[] | null = null;
  loading: boolean = true;
  error: string | null = null;

  async created() {
    try {
      await this.localizeFields();
      await this.fetchItems();
    }
    catch (error) {
      this.error = error;
    }
    this.loading = false;
  }

  async localizeFields() {
    if (!this.localizeTypeName) {
      return;
    }
    if (this.formFields) {
      await localizationHelper.localizeLabels(this.localizeTypeName, this.toFields(this.formFields));
    }
    if (this.tableFields) {
      await localizationHelper.localizeLabels(this.localizeTypeName, this.toFields(this.tableFields));
    }
  }

  async fetchItems() {
    if (!this.apiDescriptor.getAllUrl) {
      throw new Error('This component cannot be presented, because it must have url for fetch all');
    }
    // todo: handle large lists?
    this.items = (await baseAjax.requestList<T>(this.apiDescriptor.getAllUrl)).result.items;
  }

  rowClicked(record: T, index: number, event: MouseEvent) {
    this.selected = record;
    this.showModal = true;
  }

  // todo: move to helper
  private toFields(items: Array<ViewField | string>): ViewField[] {
    return items.map(field => {
      if (typeof field === 'string') {
        return {
          key: field,
        };
      }
      return field;
    });
  }
}
</script>
