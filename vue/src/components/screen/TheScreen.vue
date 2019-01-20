<template>
  <div class="mb-5">
    <!-- TODO: add some animation -->
    <div v-if="loading">Loading...</div>

    <BaseError
      v-else-if="error"
      :error="error"
    />

    <div v-else>
      <!-- grid -->
      <div v-if="displayMode==='GRID'">
        <InfoGrid
          v-if="items"
          :items="items"
          :descriptor="objectDescriptor"
          :onRowClicked="rowClicked"
        />
      </div>

      <!-- single item -->
      <div
        v-else
        class="container-fluid"
      >
        <ReadForm
          v-if="displayMode==='SINGLE'"
          :showTitle="true"
          :descriptor="objectDescriptor"
          :item="selected"
          :cssClasses="{labels: 'col-md-3 col-lg-2 col-sm-4 col-xs-12'}"
        />
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
import { apiServiceHelper } from '@/api/api-service-helper';
import { ViewObjectDescriptor } from '@/types/view-object';

import BaseError from '../base/BaseError.vue';
import InfoGrid from './InfoGrid.vue';
import ReadForm from './ReadForm.vue';
import { ServerError } from '@/types/server';

type DisplayMode = 'GRID' | 'SINGLE' | 'MODAL';

@Component({
  components: {
    InfoGrid,
    ReadForm,
    BaseError,
  },
})
export default class TheScreen<T extends Entity<TKey>, TKey> extends Vue {
  @Prop() apiDescriptor!: ApiServiceDescriptor;
  @Prop() objectDescriptor!: ViewObjectDescriptor<T>;
  @Prop() id?: number;
  @Prop() inModal?: boolean;

  selected: T | null = null;
  items: T[] | null = null;
  loading: boolean = true;
  error: ServerError | null = null;

  private selectedId: number | null = null;

  async created() {
    await this.encsureLoaded();
  }

  @Watch('id')
  @Watch('inModal')
  async itemChanged() {
    await this.encsureLoaded();
  }

  get displayMode(): DisplayMode {
    if (this.id === undefined) {
      return 'GRID';
    }
    if (this.inModal) {
      return 'MODAL';
    }
    return 'SINGLE';
  }


  async encsureLoaded() {
    if (this.inModal === true || this.id === undefined) {
      await this.fetchItems();
    }

    if (this.id !== undefined && this.selectedId !== this.id) {
      await this.fetchSelected(this.id);
    }
  }


  async fetchItems() {
    if (!this.apiDescriptor.getAllUrl) {
      throw new Error('This component cannot be presented, because it must have url for fetch all');
    }
    // todo: handle large lists?
    this.loading = true;
    try {
      this.items = (await baseAjax.requestList<T>(this.apiDescriptor.getAllUrl)).result.items;
    }
    catch (error) {
      this.handleError(error);
    }
    this.loading = false;
  }

  async fetchSelected(id: number) {
    // todo: some handle
    if (!this.apiDescriptor.getUrl) {
      throw new Error('This component cannot be presented, because it must have url for fetch id');
    }
    this.loading = true;
    try {
      this.selected = (await baseAjax.request<T>(apiServiceHelper.buildUrl(this.apiDescriptor.getUrl, id))).result;
      this.selectedId = id;
    }
    catch (error) {
      this.handleError(error);
    }
    this.loading = false;
  }

  rowClicked(record: T, index: number, event: MouseEvent) {
    if (event.altKey || event.ctrlKey) {
      const href = this.$router.resolve(
        { path: record.id.toString(), append: true }).href;
      if (event.altKey) {
        this.$router.push(href);
      }
      else {
        window.open(href);
      }
      return true;
    }
    return false;
  }

  private handleError(error: any) {
    const parsed = baseAjax.tryParseError(error);
    if (parsed) {
      this.error = parsed;
    }
    else {
      this.$logUnhandled(error);
    }
  }
}
</script>
