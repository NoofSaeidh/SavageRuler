<template>
  <div>
    <div class="greeting">Hello {{name}} / {{counter}}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from 'vue-property-decorator';

@Component({})
export default class Reactive extends Vue {
  @Prop() name!: string;
  @Prop() counter!: number;
}
</script>

<style>
.greeting {
  font-size: 20px;
}
</style>