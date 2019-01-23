<template>
  <div>
    <LoginDialog v-model="showDialog" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LoginDialog from '@/components/auth/LoginDialog.vue';

@Component({
  components: {
    LoginDialog,
  },
})

// todo: refactor
export default class AuthView extends Vue {
  show: boolean = true;
  get showDialog(): boolean {
    return this.show;
  }
  set showDialog(value: boolean) {
    if (value === false) {
      this.$router.back();
    }
    this.show = value;
  }
}

</script>
