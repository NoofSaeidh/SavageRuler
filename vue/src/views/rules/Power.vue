<template>
  <div>
    <b-table striped hover :items="items" :fields="fields"></b-table>
    <button type="button" class="btn btn-light" @click="fetchData()">Fetch</button>
    <br>
    <span>{{error}}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Axios from 'axios';
import { ServerList, ServerReponseList } from '../../types/abp';
import { AppConsts } from '../../global/app-consts';
import { Power } from '../../types/rules-interfaces';

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
  }
]

@Component({})
export default class Powers extends Vue {
  public items: Power[];
  public fields = mappedFields;
  public error: any;
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
    Axios
      .request<ServerReponseList<Power>>({
        url: AppConsts.appUri + '/Power/GetAll',
      })
      .then(response => (this.items = response.data.result.items))
      .catch(error => (this.error = error));
  }
}
</script>
