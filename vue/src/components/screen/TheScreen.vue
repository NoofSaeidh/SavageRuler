<template>
  <div class="container-fluid">
    <!-- modal dialog -->
    <ReadModal
      v-if="selected"
      :show="showModal"
      :title="title"
      @hide="showModal=false"
      @keydown.native.left="swipeLeftModal"
      @keydown.native.right="swipeRightModal"
    >
      <ReadForm :descriptor="objectDescriptor" :item="selected"/>
    </ReadModal>

    <!-- TODO: add some animation -->
    <div v-if="loading">Loading...</div>

    <!-- TODO: interactive error (in ajax class ??) -->
    <div v-else-if="error">{{error}}</div>

    <div v-else>
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
      <div v-else>
        <ReadForm v-if="selected" :descriptor="objectDescriptor" :item="selected"/>
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
import ReadModal from './ReadModal.vue';

@Component({
  components: {
    InfoGrid,
    ReadForm,
    ReadModal,
  },
})
export default class TheScreen<T extends Entity<TKey>, TKey> extends Vue {
  @Prop() apiDescriptor!: ApiServiceDescriptor;
  @Prop() objectDescriptor!: ViewObjectDescriptor<T>;

  selected: T | null = null;
  selectedIndex: number | null = null;
  items: T[] | null = null;
  title: string | null = null;
  loading: boolean = true;
  error: string | null = null;
  showModal: boolean = false;
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
    this.selectedIndex = index;
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

  swipeLeftModal() {
    let index = this.selectedIndex || 0;
    index--;
    if (index < 0) {
      index = 0;
    }
    this.selectedIndex = index;
    this.selected = this.items![index];
    this.title = this.selected[this.objectDescriptor.titleKey];
  }

  swipeRightModal() {
    let index = this.selectedIndex || 0;
    index++;
    if (index >= this.items!.length) {
      index = this.items!.length - 1;
    }
    this.selectedIndex = index;
    this.selected = this.items![index];
    this.title = this.selected[this.objectDescriptor.titleKey];
  }

  swipeLeft() {
    console.log('sl');

  }

  swipeRight() {
    console.log('sr');
  }

  async arrowPressed(event: KeyboardEvent) {
    console.log(event.key + ' - ' + event.keyCode);
    if (event.keyCode < 37 || event.keyCode > 40) {
      return;
    }
    let index = this.selectedIndex || 1;
    switch (event.keyCode) {
      // swipe to the side
      case 37 /* left */:
        if (!this.showModal) {
          this.showTable = false;
        }
        if (index > 1) {
          index--;
        }
        break;

      case 39 /* right */:
        if (!this.showModal) {
          this.showTable = false;
        }
        // todo: check max index
        index++;
        break;

      // // show table
      // case 38 /* up */:
      //   if (this.showModal) {
      //     this.showModal = false;
      //   }
      //   if (!this.showTable) {
      //     this.showTable = true;
      //   }

      //   break;

      // // show single element
      // case 40 /* down */:
      //   if (!this.showModal) {
      //     this.showTable = false;
      //   }
      //   break;
    }

    if (this.items == null) {
      await this.fetchItems();
    }
    if (index >= this.items!.length) {
      index = this.items!.length - 1;
    }

    this.selectedIndex = index;
    this.selected = this.items![index];
    this.title = this.selected[this.objectDescriptor.titleKey];
  }
}
</script>
