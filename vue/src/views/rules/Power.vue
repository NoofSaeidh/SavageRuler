<template>
  <div>
    <b-table striped hover :items="data"></b-table>
    <button type="button" class="btn btn-light" @click="fetchData()">Fetch</button>
    <br/>
    <span>{{error}}</span>
    <span>{{data}}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Axios from 'axios';
import { ServerList, ServerReponseList } from '../../types/abp';
import { AppConsts } from '../../global/app-consts';
import { Power } from '../../types/rules-interfaces';

@Component({})
export default class Powers extends Vue {
  public data: Power[];
  public debug: any;
  public error: any;
  constructor() {
    super();
    this.data = [
      {
        name: 'Test1',
        text: 'some text',
      },
      {
        name: 'Test2',
        text: 'some other text',
      },
    ];
    this.debug = 'test';
  }


  public fetchData() {
    Axios
      .request<ServerReponseList<Power>>({
        url: AppConsts.appUri + '/Power/GetAll',
      })
      .then(response => (this.data = response.data.result.items))
      .catch(error => (this.error = error));
  }
}
</script>
