import State from '../state';
import { StateManager } from '../services/state-manager';

class DefensiveMechanismActivated extends State {
  readonly sceneName = 'DefensiveMechanismActivated';

  manager: StateManager;

  execute = (manager: StateManager): void => {
    this.manager = manager;
    super.loadUnityScene(false);
  };
}

export default new DefensiveMechanismActivated();
