import State from '../state';
import { StateManager } from '../services/state-manager';
import arduinoService from '../../services/arduino-service';
import { ArduinoEvents } from '../constans';

class TimerWithGenesis extends State {
  readonly sceneName = 'TimerWithGenesis';

  manager: StateManager;

  execute = (manager: StateManager): void => {
    this.manager = manager;
    super.loadUnityScene(true);
    arduinoService.sendMessage(ArduinoEvents.RED);
  };
}

export default new TimerWithGenesis();
