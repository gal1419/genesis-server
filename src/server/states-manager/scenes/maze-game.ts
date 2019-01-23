import State from '../state';
import { StateManager } from '../services/state-manager';
import scenesService from '../services/scenes-service';
import { ArduinoEvents } from '../constans';

class MazeGame extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  isArduinoEventReceived: boolean = false;

  readonly sceneName = 'MazeGame';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    this.isArduinoEventReceived = false;
    super.loadUnityScene(false);
    const clue = scenesService.getSceneClue(this.sceneName);
    this.timer = setTimeout(() => {
      super.loadUnityScene(false, clue);
    }, 1000 * 60 * 2);
  };

  handleArduinoMessage(data: string) {
    if (data === ArduinoEvents.GlassesDrawerOpened && !this.isArduinoEventReceived) {
      this.isArduinoEventReceived = true;
      clearTimeout(this.timer);
      super.loadUnityScene(false, 'GenesisAfterMazeDrawerOpened');
    }
  }
  destroy = (): void => {
    clearTimeout(this.timer);
  };
}

export default new MazeGame();
