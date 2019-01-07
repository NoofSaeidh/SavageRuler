<template>
  <div class="post">
    <div class="loading" v-if="loading">Loading...</div>

    <div v-if="error" class="error">{{ error.message }}</div>

    <div v-if="items" class="content">
      <b-table small striped hover :items="items" :fields="headers"></b-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide } from 'vue-property-decorator';
import { ServerList, ServerReponseList, ServerReponse, ServerError } from '@/types/server';
import { AppConsts } from '@/global/app-consts';
import { Tabler } from '@/api/tabler';
import { Power } from '@/types/power';
import { Field } from '@/types/table';

@Component({})
export default class ShortTable<T> extends Vue {
  @Prop() public appName!: string;
  @Prop() public includeFields!: string[] | null;
  @Prop() public excludeFields!: string[] | null;
  public items: T[] | null = null;
  public headers: Field[] | null = null;
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
      const exclude = this.excludeFields;
      headers = headers.filter(h => !exclude.some(e => e === h.key));
    }
    if (this.includeFields) {
      const include = this.includeFields;
      headers = headers.filter(h => include.some(e => e === h.key));
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
