import State from '../state';
import { StateManager } from '../services/state-manager';

class TimerWithGenesis extends State {
  readonly sceneName = 'TimerWithGenesis';

  manager: StateManager;

  execute = (manager: StateManager): void => {
    this.manager = manager;
    super.setDefaultRestListener();
    super.loadUnityScene(true);
  };
}

export default new TimerWithGenesis();
