import State from './state';
import FirstScene from './scenes/first-scene';
import InitialScene from './scenes/initial-state';

export class StateManager {
  private currentState: State;

  constructor() {
    this.currentState = new InitialScene();
  }

  public setState(state: State): void {
    this.currentState.destroy();
    this.currentState = state;
  }

  public execute(): void {
    this.currentState.execute(this);
  }
}
