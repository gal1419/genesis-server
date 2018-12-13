import State from '../state';
import { StateManager } from '../services/state-manager';

class Registration extends State {
  sceneName = 'Registration';

  constructor() {
    super();
  }

  execute = (manager: StateManager): void => {};
}

export default new Registration();
