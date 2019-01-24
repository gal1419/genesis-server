import State from "../state";
import { StateManager } from "../services/state-manager";
import scenesService from "../services/scenes-service";
import arduinoService from "../../services/arduino-service";
import { ArduinoEvents } from "../constans";
import logsService from "../../services/logs-service";

class SwitchesGame extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;
  isArduinoEventReceived: boolean = false;

  readonly sceneName = "SwitchesGame";

  execute = (manager: StateManager): void => {
    logsService.handleLog("starting SwitchesGame");
    this.manager = manager;
    arduinoService.sendMessage(ArduinoEvents.BLUE);
    const clue = scenesService.getSceneClue(this.sceneName);
    this.timer = setTimeout(() => {
      super.loadUnityScene(false, clue);
    }, 1000 * 2);
  };

  handleArduinoMessage = (data: string) => {
    if (data === ArduinoEvents.CoreDrawerOpened) {
      logsService.handleLog("got CoreDrawerOpened");
      clearTimeout(this.timer);
      // super.loadUnityScene(false, 'GenesisAfterCoreDrawerOpened');
    } else if (data === ArduinoEvents.FrameChipRemoved) {
      logsService.handleLog("got FrameChipRemoved");
      arduinoService.sendMessage(ArduinoEvents.RED);
      this.moveToNextScene();
      // super.loadUnityScene(false, 'GenesisAfterRemovingChip');
    }
  };
  destroy = (): void => {
    clearTimeout(this.timer);
  };
}

export default new SwitchesGame();
