import State from '../state';
import { StateManager } from '../services/state-manager';
import arduinoService from '../../services/arduino-service';
import { ArduinoEvents } from '../constans';

class EndGame extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  commandsMap = new Map();

  isArduinoEventReceived: boolean = true;

  readonly sceneName = 'EndGame';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    this.loadUnityScene(true, 'EndGame');
    arduinoService.sendMessage(ArduinoEvents.FLASH);
  };

}

export default new EndGame();
