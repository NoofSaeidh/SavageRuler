<template>
  <div class="post">
    <div class="loading" v-if="loading">Loading...</div>

    <div v-if="error" class="error">{{ error.message }}</div>

    <div v-if="items" class="content">
      <b-table striped hover :items="items" :fields="headers"></b-table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ServerList, ServerReponseList, ServerReponse, ServerError } from '@/types/server';
import { AppConsts } from '@/global/app-consts';
import ajax, { Ajax } from '@/helpers/ajax';
import { Power } from '@/types/power';

interface Field {
  key: string;
  label: string;
  sortable?: boolean;
}

@Component({
  props: {
    appName: String,
  },
})
export default class Table<T> extends Vue {
  public items: T[] | null;
  public headers: Field[] | null;
  // public tmp: any = null;
  public loading = false;
  public error: ServerError | null = null;

  constructor() {
    super();
    this.items = null;
    this.headers = null;
  }

  public created() {
    this.fetchLabels();
    this.fetchData();
  }

  public fetchLabels() {
    // todo: handle somehow different
    ajax
      .requestApp<object>('/' + this.$props.appName + '/GetLocalizedProperties')
      .then(response => {
        this.headers = Object
          .entries(response.data.result)
          .map(([name, value]) => ({ key: name, label: value, sortable: true }));
      })
      .catch(error => { this.error = error; });
  }

  public fetchData() {
    this.error = this.items = null;
    this.loading = true;
    ajax
      .requestAppList<T>('/' + this.$props.appName + '/GetAll')
      .then(response => {
        this.items = response.data.result.items;
      }, response => {
        this.error = (response.response.data as ServerReponse<any>).error;
      })
      .finally(() => { this.loading = false; });
  }
}
</script>
