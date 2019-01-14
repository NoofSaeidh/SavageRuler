import { Mutations, Store, SyncedStore } from 'pipaslot-vuex-typescript';

class LocalizationState {
  currentCulture: string = '';
}
class LocalizationMutation extends Mutations<LocalizationState> {
  changeCulture(input: string) {
    this.state.currentCulture = input;
  }
}

export class LocalizationModule extends SyncedStore<LocalizationState, LocalizationMutation> {
}

export default new LocalizationModule(new LocalizationState(), new LocalizationMutation());
