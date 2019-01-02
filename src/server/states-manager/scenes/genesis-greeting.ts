import State from '../state';
import { StateManager } from '../services/state-manager';
import arduinoService from '../../services/arduino-service';
import { ArduinoEvents } from '../constans';

class GenesisGreeting extends State {
  readonly sceneName = 'GenesisGreeting';

  manager: StateManager;

  execute = (manager: StateManager): void => {
    this.manager = manager;
    super.loadUnityScene(true);
    arduinoService.sendMessage(ArduinoEvents.BLUE);
  };
}

export default new GenesisGreeting();
