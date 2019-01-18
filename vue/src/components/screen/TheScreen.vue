<template>
  <div>

    <!-- TODO: add some animation -->
    <div v-if="loading">Loading...</div>

    <!-- TODO: interactive error (in ajax class ??) -->
    <div v-else-if="error">{{error}}</div>

    <div v-else >
      <!-- grid -->
      <div v-if="showTable">
        <InfoGrid
          v-if="items"
          :items="items"
          :descriptor="objectDescriptor"
          :onRowClicked="rowClicked"
        ></InfoGrid>
      </div>

      <!-- single item -->
      <div v-else
           class="container-fluid">
        <ReadForm
          v-if="selected"
          :showTitle="true"
          :descriptor="objectDescriptor"
          :item="selected"
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

import InfoGrid from './InfoGrid.vue';
import ReadForm from './ReadForm.vue';

@Component({
  components: {
    InfoGrid,
    ReadForm,
  },
})
export default class TheScreen<T extends Entity<TKey>, TKey> extends Vue {
  @Prop() apiDescriptor!: ApiServiceDescriptor;
  @Prop() objectDescriptor!: ViewObjectDescriptor<T>;

  selected: T | null = null;
  items: T[] | null = null;
  loading: boolean = true;
  error: string | null = null;
  showTable: boolean = true;

  async created() {
    await this.load(this.$route);
  }

  @Watch('$route') async routeChanged(newRoute: Route, oldRoute: Route) {
    await this.load(newRoute);
  }

  async load(route: Route) {
    try {
      if (route.params.id) {
        await this.fetchSelected(route.params.id);
        this.showTable = false;
      }
      else {
        await this.fetchItems();
        this.showTable = true;
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
}
</script>
