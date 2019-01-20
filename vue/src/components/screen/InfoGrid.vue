<template>
  <div>
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
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { Entity } from '@/types/entity';
import { OnRowClicked } from '@/types/delegates';
import { ViewObjectDescriptor } from '@/types/view-object';
import ReadForm from './ReadForm.vue';


// todo: oposite grid: VerboseGrid
@Component({
  components: {
    ReadForm,
  },
})
export default class InfoGrid<T extends Entity<TKey>, TKey> extends Vue {
  @Prop() items!: T[];
  @Prop() descriptor!: ViewObjectDescriptor<T>;
  @Prop() onRowClicked?: OnRowClicked<T>; // if returns true -> prevent default (modal show)
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

    rowClicked(record: T, index: number, event: MouseEvent) {
    if (this.onRowClicked) {
      this.onRowClicked(record, index, event);
    }
  }
}
</script>
