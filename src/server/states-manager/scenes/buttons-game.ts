import State from '../state';
import { StateManager } from '../services/state-manager';
import { ArduinoEvents } from '../constans';
import scenesService from '../services/scenes-service';

class ButtonsGame extends State {
  manager: StateManager;

  readonly sceneName = 'ButtonsGame';

  constructor() {
    super();
  }

  execute = (manager: StateManager): void => {
    this.manager = manager;
    super.setSerialPortListener(this.arduinoListener);
    super.addDefaultRestListener();

    const clue = scenesService.getSceneClue(this.sceneName);
    setTimeout(() => {
      super.loadUnityScene(false, clue);
    }, 1200);
  };

  arduinoListener(data) {
    if (data === ArduinoEvents.ButtonsGameEvent) {
      super.loadUnityScene(false, 'GenesisAfterColorDrawerOpened');
      super.addDefaultRestListener();
    }
  }
}

export default new ButtonsGame();
