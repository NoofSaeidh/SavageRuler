import Vue from 'vue';
import { Component } from 'vue-property-decorator';

// @ts-ignore
@Component
export default class CounterComponent extends Vue {
    currentcount: number = 0;

    incrementCounter() {
        this.currentcount++;
    }
}
