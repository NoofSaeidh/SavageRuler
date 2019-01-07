<template>
  <div>
    <ShortTable
      appName="Power"
      v-bind:includeFields="['name', 'book', 'points', 'duration', 'distance', 'rank']"
    ></ShortTable>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ShortTable from '@/components/ShortTable.vue';
import { Power } from '@/types/power';

@Component({
  components: {
    ShortTable,
  },
})
export default class Powers extends Vue {
}
</script>
