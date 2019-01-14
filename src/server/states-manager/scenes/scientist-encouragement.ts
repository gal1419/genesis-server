import State from '../state';
import { StateManager } from '../services/state-manager';

class ScientistEncouragement extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  commandsMap = new Map();

  isArduinoEventReceived: boolean = true;

  readonly sceneName = 'ScientistEncouragement';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    this.loadUnityScene(false, 'ScientistEncouragement');
  };

}

export default new ScientistEncouragement();
