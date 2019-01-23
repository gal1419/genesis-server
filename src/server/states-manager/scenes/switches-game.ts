import State from "../state";
import { StateManager } from "../services/state-manager";
import scenesService from "../services/scenes-service";
import arduinoService from "../../services/arduino-service";
import { ArduinoEvents } from "../constans";
import logsService from "../../services/logs-service";

class SwitchesGame extends State {
  manager: StateManager;

  timer1: NodeJS.Timeout;
  timer2: NodeJS.Timeout;

  isArduinoEventReceived: boolean = false;

  readonly sceneName = "SwitchesGame";

  execute = (manager: StateManager): void => {
    logsService.handleLog("starting SwitchesGame");
    this.manager = manager;
    arduinoService.sendMessage(ArduinoEvents.BLUE);
    const clue = scenesService.getSceneClue(this.sceneName);
    this.timer1 = setTimeout(() => {
      super.loadUnityScene(false, clue);
    }, 1000 * 60 * 2);

    this.timer2 = setTimeout(() => {
      super.loadUnityScene(false, "ChipGameClue");
    }, 1000 * 60 * 4);
  };

  handleArduinoMessage = (data: string) => {
    if (data === ArduinoEvents.CoreDrawerOpened) {
      logsService.handleLog("got CoreDrawerOpened");
      clearTimeout(this.timer1);
      // super.loadUnityScene(false, 'GenesisAfterCoreDrawerOpened');
    } else if (data === ArduinoEvents.FrameChipRemoved) {
      logsService.handleLog("got FrameChipRemoved");
      arduinoService.sendMessage(ArduinoEvents.RED);
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
