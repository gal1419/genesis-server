import State from '../state';
import { StateManager } from '../services/state-manager';

class ColorsGame extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  commandsMap = new Map();

  isArduinoEventReceived: boolean = true;

  readonly sceneName = 'ColorsGame';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    this.loadUnityScene(true, 'ColorsGame');
  };

}

export default new ColorsGame();
