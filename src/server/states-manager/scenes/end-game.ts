import State from '../state';
import { StateManager } from '../services/state-manager';

class EndGame extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  commandsMap = new Map();

  isArduinoEventReceived: boolean = true;

  readonly sceneName = 'EndGame';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    this.loadUnityScene(false, 'EndGame');
  };

}

export default new EndGame();
