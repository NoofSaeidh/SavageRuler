<template>
  <div>
    <ReadOnlyModal v-if="selected" :show="showModal" @hide="showModal=false" :title="title">
      <ReadOnlyForm :fields="formFields" :item="selected"></ReadOnlyForm>
    </ReadOnlyModal>
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

import { ViewField, TableField, FormField } from '@/types/view-field';
import { Entity } from '@/types/entity';
import { ApiServiceDescriptor } from '@/types/services';
import { localizationHelper } from '@/helpers/localization-helper';
import { baseAjax } from '@/api/ajax';

import ShortTable from './ShortTable.vue';
import ReadOnlyForm from './ReadOnlyForm.vue';
import ReadOnlyModal from './ReadOnlyModal.vue';
import { fieldsHelper } from '@/helpers/fields-helper';

@Component({
  components: {
    ShortTable,
    ReadOnlyForm,
    ReadOnlyModal,
  },
})
export default class ReadOnlyScreen<T extends Entity<TKey>, TKey> extends Vue {
  @Prop() apiDescriptor!: ApiServiceDescriptor;
  // should be already localized
  @Prop() formFields!: FormField[] | null;
  @Prop() tableFields!: TableField[] | null;

  selected: T | null = null;
  items: T[] | null = null;
  title: string | null = null;

  titleKey: string | undefined;

  loading: boolean = true;
  error: string | null = null;
  showModal: boolean = false;

  async created() {
    try {
      await this.fetchItems();
    }
    catch (error) {
      this.error = error;
    }
    this.loading = false;
    if (this.formFields) {
      this.titleKey = fieldsHelper.getTitleKey(this.formFields);
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
    if (this.titleKey) {
      this.title = record[this.titleKey];
    }
    this.showModal = true;
  }
}
</script>
