import { StateManager } from './services/state-manager';
import UnityRestService, { UnityRestListenerType } from '../services/unity-rest-service';
import SerialPortService, { SerialPortListenerType } from '../services/serial-service';

import { Constans } from './constans';

export default abstract class State {
  abstract readonly sceneName;

  constructor() {}

  loadUnityScene(sceneName: string, sendToSecondaryUnity: boolean) {
    const message = `${Constans.LOAD_SCENE}:${sceneName}`;
    UnityRestService.sendPrimaryUnityMessage(Constans.LOAD_SCENE, message);

    if (sendToSecondaryUnity) {
      UnityRestService.sendPrimaryUnityMessage(Constans.LOAD_SCENE, sceneName);
    }
  }

  getSceneName() {
    return this.sceneName;
  }

  setSerialPortListener(serialPortListener: SerialPortListenerType) {
    SerialPortService.addListener(serialPortListener);
  }

  setRestListener(listenerId: string, listener: UnityRestListenerType) {
    UnityRestService.addListener(listenerId, listener);
  }

  abstract execute: (manager: StateManager) => void;

  abstract destroy: () => void;
}
