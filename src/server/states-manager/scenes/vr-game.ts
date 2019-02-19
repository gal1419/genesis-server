import State from '../state';
import { StateManager } from '../services/state-manager';
import unityRestService from '../../services/unity-rest-service';

class VRGame extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  commandsMap = new Map();

  isArduinoEventReceived: boolean = true;

  readonly sceneName = 'VRGame';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    this.loadUnityScene(false, 'VRGame');
    unityRestService.sendFaceRecognitionMessage('stop');
  };

}

export default new VRGame();
