import State from "../state";
import { StateManager } from "../services/state-manager";
import arduinoService from "../../services/arduino-service";
import { ArduinoEvents } from "../constans";
import UnityRestService from "../../services/unity-rest-service";
import { Constans } from "../constans";

class TimerWithGenesis extends State {
  readonly sceneName = "TimerWithGenesis";

  manager: StateManager;

  execute = (manager: StateManager): void => {
    this.manager = manager;
    UnityRestService.sendPrimaryUnityMessage("load-scene", "ResetTimer:30");
    UnityRestService.sendSecondryUnityMessage("load-scene", "ResetTimer:30");

    super.loadUnityScene(false);
    UnityRestService.sendSecondryUnityMessage(
      "load-scene",
      Constans.LOAD_SCENE + ":Timer"
    );
  };
}

export default new TimerWithGenesis();
