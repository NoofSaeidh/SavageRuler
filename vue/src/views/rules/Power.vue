<template>
  <div>
    <ReadOnlyScreen
      :apiDescriptor="apiDescriptor"
      :formFields="formFields"
      :tableFields="tableFields"
      :localizeTypeName="localizeTypeName"
    ></ReadOnlyScreen>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { apiServiceHelper } from '@/api/api-service-helper';
// import { FormField } from '@/types/form';
// import { TableField } from '@/types/table';
// import { Power } from '@/types/power';

import ReadOnlyScreen from '@/components/ReadOnlyScreen.vue';

@Component({
  components: {
    ReadOnlyScreen,
  },
})
export default class Powers extends Vue {
  public tableFields = ['name', 'book', 'points', 'duration', 'distance', 'rank'];
  public formFields = ['name', 'book', 'points', 'duration', 'distance', 'rank', 'text'];
  public apiDescriptor = apiServiceHelper.getDefaultDescriptor('Power');
  public localizeTypeName = 'Power';
}
</script>
