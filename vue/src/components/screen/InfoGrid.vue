<template>
  <div>
    <!-- modal dialog -->
    <ReadModal
      v-if="!!selected"
      :show="!!selected"
      :title="title"
      @hide="index=-1"
      @keydown.native.left="swipeModal('left')"
      @keydown.native.right="swipeModal('right')"
    >
      <ReadForm
        :descriptor="descriptor"
        :item="selected"
      />
    </ReadModal>

    <b-table
      class="post"
      small
      striped
      hover
      :items="items"
      :fields="fields"
      @row-clicked="rowClicked"
    ></b-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Entity } from '@/types/entity';
import { OnRowClicked } from '@/types/delegates';
import { ViewObjectDescriptor } from '@/types/view-object';
import { Direction } from '@/types/direction';
import ReadForm from './ReadForm.vue';
import ReadModal from './ReadModal.vue';


// todo: oposite grid: VerboseGrid
@Component({
  components: {
    ReadForm,
    ReadModal,
  },
})
export default class InfoGrid<T extends Entity<TKey>, TKey> extends Vue {
  @Prop() items!: T[];
  @Prop() descriptor!: ViewObjectDescriptor<T>;
  @Prop() onRowClicked?: OnRowClicked<T, boolean>; // if returns true -> prevent default (modal show)
  index: number = -1;

  get selected(): T | null {
    if (this.index < 0 || this.index >= this.items!.length)
      return null;
    return this.items![this.index];
  }

  get title(): string | null {
    const i = this.selected;
    if (i === null) {
      return null;
    }
    return i[this.descriptor.titleKey];
  }

  get fields() {
    return this.descriptor.tableFields;
  }

  swipeModal(direction: Direction) {
    let newIndex: number;
    switch (direction) {
      case 'left':
        newIndex = this.index - 1;
        break;
      case 'right':
        newIndex = this.index + 1;
        break;
      default:
        return;
    }
    if (newIndex < 0 || newIndex >= this.items!.length) {
      return;
    }
    this.index = newIndex;
  }

  rowClicked(record: T, index: number, event: MouseEvent) {
    if (this.onRowClicked) {
      const prevent = this.onRowClicked(record, index, event);
      if (prevent) return;
    }
    this.index = index;
  }
}
</script>
