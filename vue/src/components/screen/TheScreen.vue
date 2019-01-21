<template>
  <div class="mb-5">
    <!-- TODO: add some animation -->
    <div v-if="loading">Loading...</div>

    <BaseError
      v-else-if="error"
      :error="error"
    />

    <div v-else>
      <!-- single item -->
      <div
        v-if="displayMode==='SINGLE'"
        class="container-fluid"
      >
        <span class="row">
          <h5 class="col text-left">
            <button
              class="btn btn-secondary"
              @click="showGrid"
            >
              <font-awesome-icon icon="th" />
              Grid
            </button>
          </h5>
        </span>

        <ReadForm
          v-if="selected"
          :showTitle="true"
          :descriptor="objectDescriptor"
          :item="selected"
          :cssClasses="{labels: 'col-md-3 col-lg-2 col-sm-4 col-xs-12'}"
        />
      </div>

      <!-- grid (displayed for modal too)-->
      <div v-else>
        <InfoGrid
          v-if="items"
          :items="items"
          :descriptor="objectDescriptor"
          :onRowClicked="rowClicked"
        />
      </div>

      <!-- modal dialog -->
      <div v-if="displayMode==='MODAL'">
        <ReadModal
          v-if="selected"
          :show="!!selected"
          @hide="hideModal"
          @keydown.native.left="swipeModal('left')"
          @keydown.native.right="swipeModal('right')"
        >
          <ReadForm
            :descriptor="objectDescriptor"
            :item="selected"
            :cssClasses="{labels: 'col-md-4 col-lg-3'}"
          />
        </ReadModal>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Location } from 'vue-router';

import { Entity } from '@/types/entity';
import { ApiServiceDescriptor } from '@/types/services';
import { baseAjax } from '@/api/ajax';
import { apiServiceHelper } from '@/api/api-service-helper';
import { ViewObjectDescriptor } from '@/types/view-object';
import { Direction } from '@/types/direction';
import { ServerError } from '@/types/server';

import BaseError from '../base/BaseError.vue';
import InfoGrid from './InfoGrid.vue';
import ReadForm from './ReadForm.vue';
import ReadModal from './ReadModal.vue';

type DisplayMode = 'GRID' | 'SINGLE' | 'MODAL';

@Component({
  components: {
    InfoGrid,
    ReadForm,
    BaseError,
    ReadModal,
  },
})
export default class TheScreen<T extends Entity<TKey>, TKey> extends Vue {

  @Prop() apiDescriptor!: ApiServiceDescriptor;
  @Prop() objectDescriptor!: ViewObjectDescriptor<T>;
  @Prop() id?: TKey;
  @Prop() inModal?: boolean;

  selected: T | null = null;
  items: T[] | null = null;
  loading: boolean = true;
  error: ServerError | null = null;
  isInModal: boolean = false;

  private gridIndex: number | null = null;
  private selectedId: TKey | null = null;

  get displayMode(): DisplayMode {
    if (this.selectedId === null) {
      return 'GRID';
    }
    if (this.isInModal) {
      return 'MODAL';
    }
    return 'SINGLE';
  }

  async created() {
    this.isInModal = this.inModal || false;
    this.selectedId = this.id || null;
    await this.ensureFetched();
    if (this.selectedId !== null && this.isInModal !== null) {
      // this.$refs.singleForm.focus();
    }
  }

  mounted() {
    document.addEventListener('keydown', this.onKeyDownGlobal);
  }

  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeyDownGlobal);
  }

  @Watch('id')
  async idChanged(newValue: TKey) {
    this.selectedId = newValue || null;
    await this.ensureFetched();
  }

  @Watch('inModal')
  async inModalChanged(newValue: boolean) {
    this.isInModal = newValue || false;
    await this.ensureFetched();
  }

  async ensureFetched() {
    // to not to fetch everytime
    const mode = this.displayMode;
    if ((mode === 'GRID' || mode === 'MODAL')
      && !this.items) {
      await this.fetchItems();
    }
    if ((mode === 'MODAL' || mode === 'SINGLE')
      && (this.selectedId && (!this.selected || this.selected.id !== this.selectedId))) {
      await this.fetchSelected();
    }
  }

  showItem(record: T, mode: 'MODAL_PUSH' | 'MODAL_REPLACE' | 'SINGLE' | 'WINDOW') {
    const location: Location = {
      query: {
        id: String(record.id),
      },
    };
    if (mode === 'WINDOW') {
      window.open(this.$router.resolve(location).href);
    }
    else if (mode === 'SINGLE') {
      this.selected = record;
      this.$router.push(location);
    }
    else if (mode === 'MODAL_PUSH') {
      location.query!.inModal = 'true';
      // this will speed up (because no need additional load)
      this.selected = record;
      this.$router.push(location);
    }
    else if (mode === 'MODAL_REPLACE') {
      location.query!.inModal = 'true';
      // this will speed up (because no need additional load)
      this.selected = record;
      this.$router.replace(location);
    }
    else {
      this.$logUnhandled(`unexpected mode ${mode}`);
    }
  }

  showGrid() {
    this.$router.push({ query: {} });
  }

  rowClicked(record: T, index: number, event: MouseEvent) {
    this.gridIndex = index;
    if (event.ctrlKey) {
      this.showItem(record, 'WINDOW');
    }
    // changes to elemens watches will do
    else if (event.altKey) {
      this.showItem(record, 'SINGLE');
    }
    else {
      this.showItem(record, 'MODAL_PUSH');
    }
  }

  swipeModal(direction: Direction) {
    // todo: find in grid (and add filtering with swiping on that)
    if (this.gridIndex === null) return;
    let newIndex: number;
    switch (direction) {
      case 'left':
        newIndex = this.gridIndex - 1;
        break;
      case 'right':
        newIndex = this.gridIndex + 1;
        break;
      default:
        return;
    }
    if (newIndex < 0 || newIndex >= this.items!.length) {
      return;
    }
    this.gridIndex = newIndex;
    this.showItem(this.items![this.gridIndex], 'MODAL_REPLACE');
  }

  hideModal() {
    this.$router.push({
      query: {},
    });
  }

  private onKeyDownGlobal(event: KeyboardEvent) {
    if (this.displayMode === 'SINGLE' && event.key === 'Escape') {
      this.showGrid();
    }
  }


  private async fetchItems() {
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

  private async fetchSelected() {
    // todo: some handle
    if (!this.apiDescriptor.getUrl) {
      throw new Error('This component cannot be presented, because it must have url for fetch id');
    }
    if (this.selectedId === null) {
      return;
    }
    this.loading = true;
    try {
      // todo: another convert to string?
      this.selected = (await baseAjax.request<T>(apiServiceHelper.buildUrl(this.apiDescriptor.getUrl, this.selectedId + ''))).result;
    }
    catch (error) {
      this.handleError(error);
    }
    this.loading = false;
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
