<template>
  <div>
    <!-- TODO: localize -->
    <b-modal
      v-model="show"
      title="Error!"
      header-bg-variant="danger"
      header-text-variant="light"
    >
      <p v-text="error.message" />
      <div v-if="error.details">
        <hr>
        <p
          class="text-muted"
          v-text="error.details"
        />
      </div>
      <div
        slot="modal-footer"
        class="w-100"
      >
        <b-btn
          size="sm"
          class="float-right"
          variant="secondary"
          @click="goBack"
        >
          <font-awesome-icon icon="arrow-left" />
          Go Back
        </b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ServerError } from '@/types/server';

@Component({})
export default class BaseError extends Vue {
  @Prop() error?: ServerError;

  show: boolean = !!this.error;
  goBack() {
    this.show = false;
    this.$router.back();
  }
}
</script>
