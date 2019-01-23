import State from "../state";
import FirstScene from "../scenes/wait-to-begin";
import InitialScene from "../scenes/regestration";
import logsService from "../../services/logs-service";

export class StateManager {
  private static instance: StateManager;
  private _currentState!: State;

  private constructor() {}

  static getInstance() {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  public setState(state: State) {
    if (this._currentState) {
      this._currentState.destroy();
    }
    logsService.handleLog(`setting to state: ${state.getSceneName()}`);
    this._currentState = state;
  }

  public execute(): void {
    this._currentState.execute(this);
  }

  public handleRestRequest(request, response): void {
    this._currentState.handleRestRequest(request, response);
  }

  public endScene(request, response): void {
    this._currentState.moveToNextScene();
    response.status(200).json({ msg: "OK" });
  }

  public getCurrentStateName(request, response): void {
    response
      .status(200)
      .json({ currentStateName: this._currentState.getCurrentStateName() });
  }

  public handleArduinoMessage(message: string) {
    this._currentState.handleArduinoMessage(message);
  }

  public handleCommand(message: string): boolean {
    return this._currentState.handleCommand(message);
  }
}

export default StateManager;
