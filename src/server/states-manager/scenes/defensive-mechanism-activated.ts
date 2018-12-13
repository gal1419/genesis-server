import State from '../state';
import { StateManager } from '../services/state-manager';

class DefensiveMechanismActivated extends State {
  readonly sceneName = 'DefensiveMechanismActivated';

  manager: StateManager;

  constructor() {
    super();
  }

  execute = (manager: StateManager): void => {
    this.manager = manager;
    super.addDefaultRestListener();
    super.loadUnityScene(true);
  };
}

export default new DefensiveMechanismActivated();
