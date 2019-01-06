<template>
  <div>
    <button type="button" class="btn btn-light" @click="fetchData()">Fetch</button>
    <br>
    <span>{{tmp}}</span>
    <br>
    <b-table striped hover :items="items" :fields="headers"></b-table>
    <br>
    <!-- <span>{{error}}</span> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ServerList, ServerReponseList, ServerReponse } from '../../types/server';
import { AppConsts } from '../../global/app-consts';
import { Power } from '../../types/power';
import ajax, { Ajax } from '@/helpers/ajax';
import BaseVue from '@/base-vue';
import { Table, TableHeader } from '@/types/tables';

const mappedFields: TableHeader[] = [
  {
    key: 'name',
    label: 'Название',
    sortable: true,
  },
  // {
  //   key: 'text',
  //   sortable: false,
  //   label: 'Текст',
  // },
  {
    key: 'book',
    label: 'Книга',
  },
];

@Component({})
export default class Powers extends Vue {
  public items: any[];
  public headers: TableHeader[];
  public tmp: any = null;
  constructor() {
    super();
    this.items = [
      {
        name: 'Test1',
        text: 'some text',
      },
      {
        name: 'Test2',
        text: 'some other text',
      },
    ];
    this.headers = mappedFields;
  }


  public fetchData() {
    ajax.requestApp<ServerReponse<Table>>('/Power/GetTable')
      .then(response => {
        this.items = response.data.result.data;
        this.headers = response.data.result.headers;
      })
      .catch(error => { throw error; });


    // Axios
    //   .get(AppConsts.appUri + '/Power/GetSmth')
    //   .then(r => this.tmp = r.data as string);
  }
}
</script>
