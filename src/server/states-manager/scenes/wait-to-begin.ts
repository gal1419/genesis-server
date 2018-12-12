import State from '../state';
import { StateManager } from '../services/state-manager';

class WaitToBegin extends State {
  readonly sceneName = 'WaitToBegin';

  constructor() {
    super();
  }

  execute = (manager: StateManager): void => {
    super.loadUnityScene(this.sceneName, false);
  };

  destroy = (): void => {};
}

export default new WaitToBegin();
