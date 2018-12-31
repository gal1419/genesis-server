import State from '../state';
import { StateManager } from '../services/state-manager';
import scenesService from '../services/scenes-service';
import { ArduinoEvents } from '../constans';

class ChipGame extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  readonly sceneName = 'ChipGame';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    super.setSerialPortListener(this.arduinoListener);
    super.setDefaultRestListener();

    const clue = scenesService.getSceneClue(this.sceneName);
    this.timer = setTimeout(() => {
      super.loadUnityScene(false, clue);
    }, 1000 * 60 * 3);
  };

  arduinoListener = (data) => {
    if (data === ArduinoEvents.FrameChipRemoved) {
      clearTimeout(this.timer);
      super.loadUnityScene(false, 'GenesisAfterRemovingChip');
      super.setDefaultRestListener();
    }
  };
}

export default new ChipGame();
