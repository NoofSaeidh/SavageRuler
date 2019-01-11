<template>
  <div>
    <ReadOnlyScreen
      :apiDescriptor="apiDescriptor"
      :formFields="formFields"
      :tableFields="tableFields"
    ></ReadOnlyScreen>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { apiServiceHelper } from '@/api/api-service-helper';
import { fieldsHelper } from '@/helpers/fields-helper';
import { FormField, TableField } from '@/types/view-field';
// import { Power } from '@/types/power';

import ReadOnlyScreen from '@/components/ReadOnlyScreen.vue';

@Component({
  components: {
    ReadOnlyScreen,
  },
})
export default class Powers extends Vue {
  tableFieldsDefinition = ['name', 'book', 'points', 'duration', 'distance', 'rank'];
  formFieldsDefinition = ['name', 'book', 'points', 'duration', 'distance', 'rank', 'text'];
  apiDescriptor = apiServiceHelper.getDefaultDescriptor('Power');
  localizationTypeName = 'Power';

  tableFields: TableField[] = fieldsHelper.buildFields(
    this.tableFieldsDefinition,
    'name',
    {
      sortable: true,
    },
  );

  formFields: TableField[] = fieldsHelper.buildFields(
    this.formFieldsDefinition,
    'name',
  );

  async created() {
    await fieldsHelper.localizeFields(this.localizationTypeName, this.tableFields, this.formFields);
  }
}
</script>
