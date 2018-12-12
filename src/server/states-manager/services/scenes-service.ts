import _ from 'lodash';
import regestration from '../scenes/regestration';
import waitToBegin from '../scenes/wait-to-begin';
import startGame from '../scenes/start-game';
import State from '../state';

interface sceneOrder {
  name: string;
  value: State;
  clue?: State;
}

class ScenesService {
  order: sceneOrder[] = [
    {
      name: 'regestration',
      value: regestration
    },
    {
      name: 'waitToBegin',
      value: waitToBegin
    },
    {
      name: 'startGame',
      value: startGame
    }
  ];

  constructor() {}

  getOrder() {
    return this.order;
  }

  getNextScene(currentSeceneName: string) {
    const currentSceneIndex = _.findIndex(this.order, scene => scene.name === currentSeceneName);
    return currentSceneIndex === this.order.length - 1
      ? this.order[0].value
      : this.order[currentSceneIndex + 1].value;
  }

  getSceneByName(currentSeceneName: string): State | undefined {
    return _.find(this.order, scene => scene.name === currentSeceneName).value || undefined;
  }

  getSceneClue(currentSeceneName: string): State | undefined {
    const currentScene = _.find(this.order, scene => scene.name === currentSeceneName);
    return currentScene ? currentScene.clue : undefined;
  }
}

export default new ScenesService();
