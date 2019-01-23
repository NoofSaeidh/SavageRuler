<template>
  <div>
    <!-- TODO: custom modal with centered title -->
    <b-modal
      v-model="showModal"
      id="loginModal"
      title="Login"
      hide-footer
    >
      <b-form
        class=""
        @submit="onSubmit"
      >
        <!-- TODO: localize -->
        <b-form-group
          id="userGroup"
          label="User name:"
          label-for="username"
          class="text-left"
        >
          <b-form-input
            id="username"
            type="text"
            v-model="user"
            required
            placeholder="Enter user name"
          >
          </b-form-input>
        </b-form-group>
        <b-form-group
          id="passwordGroup"
          label="Password:"
          label-for="password"
          class="text-left"
        >
          <b-form-input
            id="password"
            type="password"
            v-model="password"
            required
            placeholder="Enter password"
          >
          </b-form-input>
        </b-form-group>
        <hr />
        <div class="float-right">
          <b-button
            type="submit"
            variant="primary"
          >Submit</b-button>
          <b-button
            variant="info"
            @click="goBack"
          >Back</b-button>
          <b-button
            variant="info"
            @click="checkLogin"
          >CheckLogin</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Modal } from 'bootstrap-vue';
import { baseAjax } from '@/api/ajax';

@Component({})
export default class LoginDialog extends Vue {
  @Prop() value?: boolean;
  @Prop() show?: boolean;
  user: string = '';
  password: string = '';
  state: boolean | null = null;

  get showModal(): boolean {
    return this.value || this.show || false;
  }

  set showModal(value: boolean) {
    this.$emit('input', value);
    if (value)
      this.$emit('show');
    else
      this.$emit('hide');
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    try {
      await baseAjax.login(this.user, this.password);
      console.log('SUCCESS!');
    }
    catch (error) {
      window.alert(JSON.stringify(error));
    }
  }

  // todo: remove
  async checkLogin() {
    await baseAjax.checkLogin();
  }

  goBack() {
    this.$router.back();
  }
  // todo: should be BvEvent
  // onOk(bvEvt: any) {
  //   console.log('ok');
  //   bvEvt.preventDefault();
  // }
}

</script>
