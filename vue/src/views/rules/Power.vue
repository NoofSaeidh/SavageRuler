<template>
  <div>
    <Table appName="Power"></Table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Table from '@/components/Table.vue';
import { Power } from '@/types/power';

@Component({
  components: {
    Table,
  },
})
export default class Powers extends Vue {

}
</script>
