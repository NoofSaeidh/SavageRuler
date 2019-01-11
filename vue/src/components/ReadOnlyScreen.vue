<template>
  <div>
    <ReadOnlyModal v-if="selected" :show="showModal" @hide="showModal=false"  >
      Some Text
      <ReadOnlyForm :fields="localizedFormFields" :item="selected"></ReadOnlyForm>
    </ReadOnlyModal>
    <!-- TODO: add some animation -->
    <div v-if="loading">Loading...</div>
    <!-- TODO: interactive error (in ajax class ??) -->
    <div v-else-if="error">{{error}}</div>
    <div v-else-if="items">
      <ShortTable :items="items" :fields="localizedTableFields" :onRowClicked="rowClicked"></ShortTable>
    </div>
    <!-- TODO: ensures never happen, and delete? -->
    <div v-else>Something went wrong!</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { ViewField, TableField, FormField } from '@/types/view-field';
import { Entity } from '@/types/entity';
import { ApiServiceDescriptor } from '@/types/services';
import { localizationHelper } from '@/helpers/localization-helper';
import { baseAjax } from '@/api/ajax';

import ShortTable from './ShortTable.vue';
import ReadOnlyForm from './ReadOnlyForm.vue';
import ReadOnlyModal from './ReadOnlyModal.vue';

@Component({
  components: {
    ShortTable,
    ReadOnlyForm,
    ReadOnlyModal,
  },
})
export default class ReadOnlyScreen<T extends Entity<TKey>, TKey> extends Vue {
  @Prop() apiDescriptor!: ApiServiceDescriptor;
  // not localized
  @Prop() formFields!: Array<FormField | string> | null;
  @Prop() tableFields!: Array<TableField | string> | null;
  // for localization
  @Prop() localizeTypeName!: string | null;

  selected: T | null = null;
  items: T[] | null = null;
  localizedFormFields: FormField[] | null = null;
  localizedTableFields: TableField[] | null = null;

  loading: boolean = true;
  error: string | null = null;
  showModal: boolean = false;

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
      this.localizedFormFields = this.toFields(this.formFields);
      await localizationHelper.localizeLabels(this.localizeTypeName, this.localizedFormFields);
    }
    if (this.tableFields) {
      this.localizedTableFields = this.toFields(this.tableFields);
      await localizationHelper.localizeLabels(this.localizeTypeName, this.localizedTableFields);
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
