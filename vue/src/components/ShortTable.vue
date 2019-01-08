<template>
  <div class="post">
    <div class="loading" v-if="loading">Loading...</div>

    <div v-if="error" class="error">{{ error.message }}</div>

    <div v-if="items" class="content">
      <b-table small striped hover :items="items" :fields="headers" @row-clicked="onRowClicked" ></b-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide } from 'vue-property-decorator';
import { ServerList, ServerReponseList, ServerReponse, ServerError } from '@/types/server';
import { Tabler } from '@/api/tabler';
import { TableField } from '@/types/table';
import { Entity } from '@/types/entity';
import { OnRowClicked } from '@/types/delegates';

@Component({})
export default class ShortTable<T extends Entity<TKey>, TKey> extends Vue {
  @Prop() public appName!: string;
  @Prop() public includeFields!: string[] | null;
  @Prop() public excludeFields!: string[] | null;
  // todo: make conditional??
  @Prop() public onRowClicked?: OnRowClicked<T>;

  public items: T[] | null = null;
  public headers: TableField[] | null = null;
  public loading = false;
  public error: ServerError | null = null;

  @Provide() private tabler: Tabler<T> = new Tabler<T>(
    '/' + this.appName + '/GetAll',
    '/' + this.appName + '/GetLocalizedProperties');



  public created() {
    this.fetchLabels();
    this.fetchData();
  }

  public async fetchLabels() {
    let headers = await this.tabler.getCachedFields();
    if (!headers) {
      // todo: ??
      return;
    }
    if (this.excludeFields) {
      headers = headers.filter(h => !this.excludeFields!.some(e => e === h.key));
    }
    if (this.includeFields) {
      headers = headers.filter(h => this.includeFields!.some(e => e === h.key));
    }
    this.headers = headers;
  }

  public async fetchData() {
    this.error = this.items = null;
    this.loading = true;
    try {
      this.items = await this.tabler.getData();
    } catch (error) {
      this.error = (error.response.data as ServerReponse<any>).error;
    } finally {
      this.loading = false;
    }
  }
}
</script>
