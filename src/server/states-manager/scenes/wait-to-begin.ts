import State from '../state';
import { StateManager } from '../services/state-manager';
import arduinoService from '../../services/arduino-service';
import { ArduinoEvents } from '../constans';
import UnityRestService from '../../services/unity-rest-service';
import { Constans } from '../constans';

class WaitToBegin extends State {
  readonly sceneName = 'WaitToBegin';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    UnityRestService.sendPrimaryUnityMessage('load-scene', Constans.LOAD_SCENE + ':WaitToBegin');
    UnityRestService.sendSecondryUnityMessage('load-scene', Constans.LOAD_SCENE + ':WaitToBegin');
    UnityRestService.sendTheardUnityMessage('load-scene', Constans.LOAD_SCENE + ':ConsoleBlinking');
    arduinoService.sendMessage(ArduinoEvents.BLUE);
    // super.loadUnityScene(false);
  };
}

export default new WaitToBegin();
