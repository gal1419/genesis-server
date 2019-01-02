import State from '../state';
import { StateManager } from '../services/state-manager';
import scenesService from '../services/scenes-service';
import { ArduinoEvents } from '../constans';

class SwitchesGame extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  isArduinoEventReceived: boolean = false;

  readonly sceneName = 'SwitchesGame';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    const clue = scenesService.getSceneClue(this.sceneName);
    this.timer = setTimeout(() => {
      super.loadUnityScene(false, clue);
    }, 1000 * 60 * 2);

    this.timer = setTimeout(() => {
      super.loadUnityScene(false, 'ChipGameClue');
    }, 1000 * 60 * 4);
  };

  handleArduinoMessage = (data: string) => {
    if (data === ArduinoEvents.CoreDrawerOpened) {
      clearTimeout(this.timer);
      super.loadUnityScene(false, 'GenesisAfterCoreDrawerOpened');
    } else if (data === ArduinoEvents.FrameChipRemoved) {
      super.loadUnityScene(false, 'GenesisAfterRemovingChip');
    }
  };
}

export default new SwitchesGame();
