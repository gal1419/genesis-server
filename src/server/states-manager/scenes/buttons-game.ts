import State from '../state';
import { StateManager } from '../services/state-manager';
import { ArduinoEvents } from '../constans';
import scenesService from '../services/scenes-service';

class ButtonsGame extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  readonly sceneName = 'ButtonsGame';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    super.setSerialPortListener(this.arduinoListener);
    super.setDefaultRestListener();

    const clue = scenesService.getSceneClue(this.sceneName);
    this.timer = setTimeout(() => {
      super.loadUnityScene(false, clue);
    }, 1000 * 60 * 2);
  };

  arduinoListener(data) {
    if (data === ArduinoEvents.ButtonsGameEvent) {
      clearTimeout(this.timer);
      super.loadUnityScene(false, 'GenesisAfterColorDrawerOpened');
      super.setDefaultRestListener();
    }
  }
}

export default new ButtonsGame();
