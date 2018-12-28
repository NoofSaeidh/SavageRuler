<template>
  <div>
    <h1>Test It!</h1>
    <p>{{message}}</p>
    <a @click="onClick()">click me</a>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

// The @Component decorator indicates the class is a Vue component
@Component({
  // All component options are allowed in here
  template: '<button @click="onClick">Click!</button>',
})
export default class Powers extends Vue {
  // Initial data can be declared as instance properties
  public message: string = 'Hello!';

  // Component methods can be declared as instance methods
  public onClick(): void {
    window.alert(this.message);
  }
}
</script>
