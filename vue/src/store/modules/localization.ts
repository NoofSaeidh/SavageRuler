import { Mutations, SyncedStore } from 'pipaslot-vuex-typescript';
import { AppConsts } from '@/global/app-consts';
import { Dictionary, Pair } from '@/types/dictionary';

class LocalizationState {
  currentCulture: string = AppConsts.localization.defaultLanguage;
  types: Dictionary<Dictionary<string>> = {};
}
class LocalizationMutation extends Mutations<LocalizationState> {
  changeCulture(input: string) {
    this.state.currentCulture = input;
  }
  defineType(input: Pair<Dictionary<string>>) {
    // have to recreate object to be reactive
    this.state.types = {...this.state.types, [input.key]: input.value};
  }
  clearTypes() {
    this.state.types = {};
  }
}

export class LocalizationModule extends SyncedStore<LocalizationState, LocalizationMutation> {
  localizeType(typeName: string, callback: () => Dictionary<string>): Dictionary<string> {
    let type = this.state.types[typeName];
    if (type) {
      return type;
    }
    type = callback();
    this.mutations.defineType({key: typeName, value: type});
    return type;
  }

  async localizeTypeAsync(typeName: string, callback: () => Promise<Dictionary<string>>): Promise<Dictionary<string>> {
    let type = this.state.types[typeName];
    if (type) {
      return type;
    }
    type = await callback();
    this.mutations.defineType({key: typeName, value: type});
    return type;
  }
}

export default new LocalizationModule(new LocalizationState(), new LocalizationMutation());
