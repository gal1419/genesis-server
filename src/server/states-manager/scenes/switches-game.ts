import State from '../state';
import { StateManager } from '../services/state-manager';
import scenesService from '../services/scenes-service';
import { ArduinoEvents } from '../constans';

class NumbersGame extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  readonly sceneName = 'SwitchesGame';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    super.setSerialPortListener(this.arduinoListener);

    const clue = scenesService.getSceneClue(this.sceneName);
    this.timer = setTimeout(() => {
      super.loadUnityScene(false, clue);
    }, 1000 * 60 * 2);
  };

  arduinoListener = (data) => {
    if (data === ArduinoEvents.CoreDrawerOpened) {
      clearTimeout(this.timer);
      super.loadUnityScene(false, 'GenesisAfterCoreDrawerOpened');
    }
  };
}

export default new NumbersGame();
