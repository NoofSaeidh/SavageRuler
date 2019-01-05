<template>
  <div>
    <button type="button" class="btn btn-light" @click="fetchData()">Fetch</button>
    <br>
    <span>{{tmp}}</span>
    <br>
    <b-table striped hover :items="items" :fields="fields"></b-table>
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

const mappedFields = [
  {
    key: 'name',
    sortable: true,
    label: 'Название',
  },
  {
    key: 'text',
    sortable: false,
    label: 'Текст',
  },
  {
    book: 'book',
    sortable: true,
    label: 'Книга',
  },
];

@Component({})
export default class Powers extends Vue {
  public items: Power[];
  public fields = mappedFields;
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
  }


  public fetchData() {
    ajax.requestApp<ServerReponseList<Power>>('/Power/GetAll')
      .then(response => (this.items = response.data.result.items))
      .catch(error => { throw error; });


    // Axios
    //   .get(AppConsts.appUri + '/Power/GetSmth')
    //   .then(r => this.tmp = r.data as string);
  }
}
</script>
