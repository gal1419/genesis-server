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
    this.resetCommandsMap();
    commandService.resetCommandsInstance();
    this.loadUnityScene(false, "WifiGame");
  };

  resetCommandsMap = (): void => {
    this.commandsMap.set("shutdown_core", {
      didRun: false,
      valueToUnity: 0
    });
    this.commandsMap.set("shutdown_kernel", {
      didRun: false,
      valueToUnity: 1
    });
    this.commandsMap.set("shutdown_firewall", {
      didRun: false,
      valueToUnity: 2
    });
  };
  handleCommand(data: string) {
    logsService.handleLog(`Command received: ${data}`);
    let commandObj = this.commandsMap.get(data);
    if (!commandObj.didRun) {
      UnityRestService.sendPrimaryUnityMessage(
        "load-scene",
        "RebootAndHack:" + commandObj.valueToUnity
      );
      commandObj.didRun = true;
      this.commandsMap.set(data, commandObj);
      return true;
    }
  }
}

export default new WifiGame();
