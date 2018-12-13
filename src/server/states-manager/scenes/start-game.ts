import State from '../state';
import { StateManager } from '../services/state-manager';

class StartGame extends State {
  readonly sceneName = 'GenesisGreeting';

  manager: StateManager;

  execute = (manager: StateManager): void => {
    this.manager = manager;
    super.setDefaultRestListener();
    super.loadUnityScene(true);
  };
}

export default new StartGame();
