import State from '../state';
import { StateManager } from '../services/state-manager';

class WaitToBegin extends State {
  readonly sceneName = 'WaitToBegin';

  execute = (manager: StateManager): void => {
    super.loadUnityScene(false);
  };
}

export default new WaitToBegin();
