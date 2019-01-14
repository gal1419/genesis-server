import State from '../state';
import { StateManager } from '../services/state-manager';

class ScientistBeforeVR extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  commandsMap = new Map();

  isArduinoEventReceived: boolean = true;

  readonly sceneName = 'ScientistBeforeVR';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    this.loadUnityScene(false, 'ScientistBeforeVR');
  };

}

export default new ScientistBeforeVR();
