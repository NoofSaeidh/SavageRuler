<template>
  <div>
    <b-modal
      :ref="refId"
      ok-only
      @hide="hide"
      header-class="text-center d-block"
      hide-header-close
      size="lg"
    >
      <div v-if="title" slot="modal-title" class="modal-title text-center d-block">
        <b v-text="title"></b>
      </div>

      <slot></slot>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Modal } from 'bootstrap-vue';

@Component({})
export default class ReadOnlyModal extends Vue {
  private static $uniqueId: number = 0;

  @Prop() show!: boolean;
  @Prop() title?: string;

  refId = 'modalReadOnlyForm_' + ReadOnlyModal.$uniqueId++;

  $refs!: {
    [index: string]: Modal,
  };

  mounted() {
    this.showChanged(this.show);
  }

  @Watch('show') showChanged(newValue: boolean) {
    if (newValue) {
      this.$refs[this.refId].show();
    }
    else {
      this.$refs[this.refId].hide();
    }
  }

  hide() {
    this.$emit('hide');
  }
}
</script>
