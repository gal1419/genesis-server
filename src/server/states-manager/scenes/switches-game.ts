import State from '../state';
import { StateManager } from '../services/state-manager';
import scenesService from '../services/scenes-service';
import { ArduinoEvents } from '../constans';

class SwitchesGame extends State {
  manager: StateManager;

  timer1: NodeJS.Timeout;
  timer2: NodeJS.Timeout;

  isArduinoEventReceived: boolean = false;

  readonly sceneName = 'SwitchesGame';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    const clue = scenesService.getSceneClue(this.sceneName);
    this.timer1 = setTimeout(() => {
      super.loadUnityScene(false, clue);
    }, 1000 * 60 * 2);

    this.timer2 = setTimeout(() => {
      super.loadUnityScene(false, 'ChipGameClue');
    }, 1000 * 60 * 4);
  };

  handleArduinoMessage = (data: string) => {
    if (data === ArduinoEvents.CoreDrawerOpened) {
      clearTimeout(this.timer1);
      // super.loadUnityScene(false, 'GenesisAfterCoreDrawerOpened');
    } else if (data === ArduinoEvents.FrameChipRemoved) {
      clearTimeout(this.timer1);
      clearTimeout(this.timer2);
      this.moveToNextScene();
      // super.loadUnityScene(false, 'GenesisAfterRemovingChip');
    }
  };
  destroy = (): void => {
    clearTimeout(this.timer1);
    clearTimeout(this.timer2);
  };
}

export default new SwitchesGame();
