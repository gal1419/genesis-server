import State from '../state';
import { StateManager } from '../state-manager';

export default class InitialScene extends State {
  constructor() {
    super();
  }

  execute = (manager: StateManager): void => {};

  destroy = (): void => {};
}
