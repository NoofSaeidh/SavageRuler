<template>
  <div>
    <ReadOnlyScreen
      :apiDescriptor="apiDescriptor"
      :objectDescriptor="objectDescriptor"
    ></ReadOnlyScreen>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { apiServiceHelper } from '@/api/api-service-helper';
import { ViewObjectDescriptor } from '@/types/view-object';
import { Power } from '@/types/power';
import { PowerDescriptor } from '@/descriptors/power';
import { localizationHelper } from '@/helpers/localization-helper';

import ReadOnlyScreen from '@/components/ReadOnlyScreen.vue';

@Component({
  components: {
    ReadOnlyScreen,
  },
})
export default class Powers extends Vue {
  objectDescriptor: ViewObjectDescriptor<Power> = PowerDescriptor;
  apiDescriptor = apiServiceHelper.getDefaultDescriptor('Power');

  async created() {
    await localizationHelper.checkOrLocalizeDescriptor(this.objectDescriptor);
  }
}
</script>
