import State from '../state';
import { StateManager } from '../services/state-manager';
import scenesService from '../services/scenes-service';
import UnityRestService from '../../services/unity-rest-service';
import { Constans } from '../constans';

class NumbersGame extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  readonly sceneName = 'NumbersGame';

  // send NumbersGameTimer to primary
  // send NumbersGame to Third

  execute = (manager: StateManager): void => {
    this.manager = manager;

    UnityRestService.sendTheardUnityMessage('load-scene', Constans.LOAD_SCENE + ':NumbersGame');
    super.loadUnityScene(false, 'NumbersGameTimer');

    const clue = scenesService.getSceneClue(this.sceneName);
    this.timer = setTimeout(() => {
      super.loadUnityScene(false, clue);
    }, 1000 * 60 * 3);
  };

  destroy = (): void => {
    clearTimeout(this.timer);
  };
}

export default new NumbersGame();
