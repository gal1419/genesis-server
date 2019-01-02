import State from '../state';
import FirstScene from '../scenes/wait-to-begin';
import InitialScene from '../scenes/regestration';

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
    this._currentState = state;
  }

  public execute(): void {
    this._currentState.execute(this);
  }

  public handleRestRequest(request, response): void {
    this._currentState.handleRestRequest(request, response);
  }

  public handleArduinoMessage(message: string) {
    this._currentState.handleArduinoMessage(message);
  }
}

export default StateManager;
