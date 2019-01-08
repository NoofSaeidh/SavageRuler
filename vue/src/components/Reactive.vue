<template>
  <div>
    <div class="greeting">Hello {{name}}{{exclamationMarks}}</div>
    <button @click="decrement">-</button>
    <button @click="increment">+</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: ['value'],
  model:{
      prop: 'value',
  },
  data() {
    return {
      enthusiasm: this.value.counter,
      name: this.value.name,
    };
  },
  methods: {
    increment() { this.enthusiasm++; },
    decrement() {
      if (this.enthusiasm > 1) {
        this.enthusiasm--;
      }
    },
  },
  computed: {
    exclamationMarks(): string {
      return Array(this.enthusiasm + 1).join('!');
    }
  },
});
</script>

<style>
.greeting {
  font-size: 20px;
}
</style>