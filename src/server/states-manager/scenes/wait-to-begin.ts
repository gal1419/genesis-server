import State from '../state';
import { StateManager } from '../services/state-manager';

class WaitToBegin extends State {
  readonly sceneName = 'WaitToBegin';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    // super.loadUnityScene(false);
  };
}

export default new WaitToBegin();
