import State from "../state";
import { StateManager } from "../services/state-manager";
import UnityRestService from "../../services/unity-rest-service";
import commandService from "../../services/commands-service";
import logsService from "../../services/logs-service";

class WifiGame extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  commandsMap = new Map();

  isArduinoEventReceived: boolean = true;

  readonly sceneName = "WifiGame";

  constructor() {
    super();
  }

  execute = (manager: StateManager): void => {
    this.manager = manager;
    this.loadUnityScene(false, "WifiGame");
  };

  handleCommand(data: string) {
    logsService.handleLog(`Command received: ${data}`);

    if (data === "shutdown_core") {
      [0, 1, 2].forEach(value => {
        UnityRestService.sendPrimaryUnityMessage(
          "load-scene",
          `RebootAndHack:${value}`
        );
      });
    }
    return true;
  }
}

export default new WifiGame();
