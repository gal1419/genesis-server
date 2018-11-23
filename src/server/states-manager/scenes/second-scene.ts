import State from '../state';
import { StateManager } from '../state-manager';
import SocketService from '../../services/socket-service';
import SerialService from '../../services/serial-service';
import { SceneNumber } from '../scenes-signals';

export default class SecondScene extends State {
  constructor() {
    super();
  }

  execute = (manager: StateManager): void => {
    super.loadScene(SceneNumber.SECOND);
    // manager.setState(null);
  };

  destroy = (): void => {};
}
