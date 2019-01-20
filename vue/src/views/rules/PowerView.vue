<template>
  <div>
    <TheScreen
      :apiDescriptor="apiDescriptor"
      :objectDescriptor="objectDescriptor"
      :id="id"
      :inModal="inModal"
    ></TheScreen>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { apiServiceHelper } from '@/api/api-service-helper';
import { ViewObjectDescriptor } from '@/types/view-object';
import { Power } from '@/types/power';
import { PowerDescriptor } from '@/descriptors/power';
import { localizationHelper } from '@/helpers/localization-helper';

import TheScreen from '@/components/screen/TheScreen.vue';

@Component({
  components: {
    TheScreen,
  },
})
export default class PowerView extends Vue {
  @Prop() id?: number;
  @Prop() inModal?: boolean;

  objectDescriptor: ViewObjectDescriptor<Power> = PowerDescriptor;
  apiDescriptor = apiServiceHelper.getDefaultDescriptor('Power');

  async created() {
    await localizationHelper.checkOrLocalizeDescriptor(this.objectDescriptor);
  }
}
</script>
