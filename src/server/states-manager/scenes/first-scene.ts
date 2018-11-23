import State from '../state';
import { StateManager } from '../state-manager';
import SocketService from '../../services/socket-service';
import SerialService from '../../services/serial-service';
import { SceneNumber } from '../scenes-signals';
import SecondScene from './second-scene';

export default class FirstScene extends State {
  constructor() {
    super();
  }

  execute = (manager: StateManager): void => {
    super.loadScene(SceneNumber.FIRST);
    manager.setCurrentState(new SecondScene());
  };

  destroy = (): void => {};
}
