import State from './state';
import FirstScene from './scenes/first-scene';

export class StateManager {
  private currentState: State;

  constructor() {
    this.currentState = new FirstScene();
  }

  public setState(state: State): void {
    this.currentState.destroy();
    this.currentState = state;
  }

  public execute(): void {
    this.currentState.execute(this);
  }
}
