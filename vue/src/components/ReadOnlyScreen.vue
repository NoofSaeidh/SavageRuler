<template>
  <div>
    <!-- modal dialog -->
    <ReadOnlyModal v-if="selected" :show="showModal" @hide="showModal=false" :title="title">
      <ReadOnlyForm :descriptor="objectDescriptor" :item="selected"></ReadOnlyForm>
    </ReadOnlyModal>

    <!-- TODO: add some animation -->
    <div v-if="loading">Loading...</div>

    <!-- TODO: interactive error (in ajax class ??) -->
    <div v-else-if="error">{{error}}</div>

    <div v-else>
      <!-- single item -->
      <div v-if="showTable">
        <ShortTable v-if="items" :items="items" :descriptor="objectDescriptor" :onRowClicked="rowClicked"></ShortTable>
      </div>

      <!-- grid -->
      <div v-else>
        <ReadOnlyForm v-if="selected" :descriptor="objectDescriptor" :item="selected"></ReadOnlyForm>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';

import { Entity } from '@/types/entity';
import { ApiServiceDescriptor } from '@/types/services';
import { baseAjax } from '@/api/ajax';

import ShortTable from './ShortTable.vue';
import ReadOnlyForm from './ReadOnlyForm.vue';
import ReadOnlyModal from './ReadOnlyModal.vue';
import { apiServiceHelper } from '@/api/api-service-helper';
import { ViewObjectDescriptor } from '@/types/view-object';

@Component({
  components: {
    ShortTable,
    ReadOnlyForm,
    ReadOnlyModal,
  },
})
export default class ReadOnlyScreen<T extends Entity<TKey>, TKey> extends Vue {
  @Prop() apiDescriptor!: ApiServiceDescriptor;
  @Prop() objectDescriptor!: ViewObjectDescriptor<T>;

  selected: T | null = null;
  items: T[] | null = null;
  title: string | null = null;
  loading: boolean = true;
  error: string | null = null;
  showModal: boolean = false;
  showTable: boolean = true;

  async created() {
    await this.load(this.$route);
  }

  async load(route: Route) {
    try {
      if (route.params.id) {
        this.showTable = false;
        await this.fetchSelected(route.params.id);
      }
      else {
        this.showTable = true;
        await this.fetchItems();
      }
    }
    catch (error) {
      this.error = error;
    }
    this.loading = false;
  }

  async fetchItems() {
    if (!this.apiDescriptor.getAllUrl) {
      throw new Error('This component cannot be presented, because it must have url for fetch all');
    }
    // todo: handle large lists?
    this.items = (await baseAjax.requestList<T>(this.apiDescriptor.getAllUrl)).result.items;
  }

  async fetchSelected(id: string) {
    // todo: some handle
    if (!this.apiDescriptor.getUrl) {
      throw new Error('This component cannot be presented, because it must have url for fetch id');
    }
    this.selected = (await baseAjax.request<T>(apiServiceHelper.buildUrl(this.apiDescriptor.getUrl, id))).result;
  }

  rowClicked(record: T, index: number, event: MouseEvent) {
    this.selected = record;
    this.title = record[this.objectDescriptor.titleKey];
    // show selected item in modal on click
    // or as common screen when click with alt
    // or in new window with ctrl
    // todo: handle different on mobile
    if (event.altKey || event.ctrlKey) {
      const href = this.$router.resolve(
        { path: record.id.toString(), append: true }).href;
      if (event.altKey) {
        this.$router.push(href);
      }
      else {
        window.open(href);
      }
    }
    else {
      this.showModal = true;
    }
  }

  @Watch('$route') async routeChanged(newRoute: Route, oldRoute: Route) {
    await this.load(newRoute);
  }
}
</script>
