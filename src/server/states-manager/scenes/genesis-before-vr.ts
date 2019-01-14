import State from '../state';
import { StateManager } from '../services/state-manager';

class GenesisBeforeVR extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  commandsMap = new Map();

  isArduinoEventReceived: boolean = true;

  readonly sceneName = 'GenesisBeforeVR';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    this.loadUnityScene(false, 'GenesisBeforeVR');
  };

}

export default new GenesisBeforeVR();
