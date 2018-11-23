import State from './state';
import FirstScene from './scenes/first-scene';
import InitialScene from './scenes/initial-state';

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
    this._currentState.destroy();
    this._currentState = state;
  }

  public execute(): void {
    this._currentState.execute(this);
  }
}

export default StateManager;
