import State from '../state';
import { StateManager } from '../services/state-manager';
import scenesService from '../services/scenes-service';
import { ArduinoEvents } from '../constans';
import UnityRestService from '../../services/unity-rest-service';
import { Constans } from '../constans';

class TextMessage extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  commandsMap = new Map();

  isArduinoEventReceived: boolean = true;

  readonly sceneName = 'TextMessage';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    const clue = scenesService.getSceneClue(this.sceneName);
    this.timer = setTimeout(() => {
      super.loadUnityScene(false, clue);
    }, 1000 * 60 * 1);
    UnityRestService.sendSecondryUnityMessage('load-scene', Constans.LOAD_SCENE + ':Timer');
    this.loadUnityScene(false, 'TextMessage');
  };

  handleArduinoMessage = (data: string) => {
    if (data === ArduinoEvents.VRDrawerOpened) {
      clearTimeout(this.timer);
      this.moveToNextScene();
    }
  };
  destroy = (): void => {
    clearTimeout(this.timer);
  };

}

export default new TextMessage();
