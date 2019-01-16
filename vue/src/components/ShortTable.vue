<template>
  <div class="post">
    <b-table
      small
      striped
      hover
      :items="items"
      :fields="fields"
      @row-clicked="onRowClicked"
    ></b-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Entity } from '@/types/entity';
import { OnRowClicked } from '@/types/delegates';
import { ViewObjectDescriptor } from '@/types/view-object';

@Component({})
export default class ShortTable<T extends Entity<TKey>, TKey> extends Vue {
  @Prop() public items!: T[];
  @Prop() public descriptor!: ViewObjectDescriptor<T>;
  // todo: make conditional??
  @Prop() public onRowClicked?: OnRowClicked<T>;

  get fields() {
    return this.descriptor.tableFields;
  }
}
</script>
