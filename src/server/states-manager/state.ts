import { StateManager } from './services/state-manager';
import UnityRestService, { UnityRestListenerType } from '../services/unity-rest-service';
import SerialPortService, { SerialPortListenerType } from '../services/serial-service';

import { Constans } from './constans';
import scenesService from './services/scenes-service';

export default abstract class State {
  manager: StateManager;

  abstract readonly sceneName;

  constructor() {}

  loadUnityScene(sendToSecondaryUnity: boolean, alternaticeSceneName?: string) {
    const sceneToLoad = alternaticeSceneName || this.sceneName;
    const message = `${Constans.LOAD_SCENE}:${sceneToLoad}`;
    UnityRestService.sendPrimaryUnityMessage('load-scene', message);

    if (sendToSecondaryUnity) {
      UnityRestService.sendPrimaryUnityMessage(Constans.LOAD_SCENE, message);
    }
  }

  getSceneName() {
    return this.sceneName;
  }

  setSerialPortListener(serialPortListener: SerialPortListenerType) {
    SerialPortService.addListener(this.sceneName, serialPortListener);
  }

  setRestListener(listener: UnityRestListenerType) {
    UnityRestService.addListener(this.sceneName, listener);
  }

  removeRestListener() {
    UnityRestService.removeListener(this.sceneName);
  }

  removeSerialListener() {
    SerialPortService.removeListener(this.sceneName);
  }

  moveToNextScene() {
    const nextScene = scenesService.getNextSceneByName(this.sceneName);
    this.manager.setState(nextScene);
    this.manager.execute();
  }

  addDefaultRestListener() {
    this.setRestListener((request, response) => {
      if (request.body && request.body.SceneEnd === '') {
        this.moveToNextScene();
      }
    });
  }

  abstract execute: (manager: StateManager) => void;

  destroy(): void {
    this.removeRestListener();
    this.removeRestListener();
  }
}
