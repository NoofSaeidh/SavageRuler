<template>
  <div>
    <b-modal
      v-model="showModal"
      ok-only
      header-class="text-center d-block"
      hide-header
      hide-footer
      centered
      size="lg"
    >
      <slot></slot>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Modal } from 'bootstrap-vue';

@Component({})
export default class ReadModal extends Vue {
  @Prop() show!: boolean;

  private $_show = false;

  created() {
    this.$_show = this.show;
  }

  get showModal() {
    return this.$_show;
  }
  set showModal(value: boolean) {
    this.$_show = value;
    if (!this.$_show) {
      this.hide();
    }
  }

  hide() {
    this.$emit('hide');
  }
}
</script>
