import State from '../state';
import { StateManager } from '../services/state-manager';

class StartGame extends State {
  readonly sceneName = 'StartGame';

  constructor() {
    super();
  }

  execute = (manager: StateManager): void => {
    super.setRestListener(this.sceneName, this.restListener);
    super.loadUnityScene(this.sceneName, true);
  };

  restListener(request, response) {
    console.log(request);
    console.log(response);
  }

  destroy = (): void => {};
}

export default new StartGame();
