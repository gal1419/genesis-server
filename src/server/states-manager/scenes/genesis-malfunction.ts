import State from '../state';
import { StateManager } from '../services/state-manager';

class GenesisMalfunction extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  commandsMap = new Map();

  isArduinoEventReceived: boolean = true;

  readonly sceneName = 'GenesisMalfunction';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    this.loadUnityScene(false, 'GenesisMalfunction');
  };

}

export default new GenesisMalfunction();
