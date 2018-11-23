import { StateManager } from './state-manager';
import { SceneNumber } from './scenes-signals';
import SocketService, { SocketListenerType } from '../services/socket-service';
import SerialPortService, { SerialPortListenerType } from '../services/serial-service';

import { Constans } from './constans';

export default abstract class State {
  constructor() {}

  loadScene(sceneId: SceneNumber) {
    SocketService.sendMessage(Constans.UNITY_SERVER_EVENT, {
      type: Constans.LOAD_SCENE_EVENT,
      message: sceneId.toString()
    });
  }

  private setListeners(serialPortListener: SerialPortListenerType) {
    SerialPortService.addListener(serialPortListener);
  }

  private setSocketListener(event: string, socketListener: SocketListenerType) {
    SocketService.addListener(event, socketListener);
  }

  abstract execute: (manager: StateManager) => void;

  abstract destroy: () => void;
}
