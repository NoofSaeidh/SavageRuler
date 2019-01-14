import { Mutations, Store } from 'pipaslot-vuex-typescript';
import localization from './modules/localization';

class RootState {
  version: string = '1.0.0';
}
class RootMutations extends Mutations<RootState> {
}

export class RootStore extends Store<RootState, RootMutations> {
  // Define store module. Every Store or store module can contains another Modules.
  localizationModule = localization;
}

export default new RootStore(new RootState(), new RootMutations());
