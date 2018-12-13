import _ from 'lodash';
import regestration from '../scenes/regestration';
import waitToBegin from '../scenes/wait-to-begin';
import startGame from '../scenes/start-game';
import State from '../state';
import defensiveMechanismActivated from '../scenes/defensive-mechanism-activated';
import buttonsGame from '../scenes/buttons-game';
import buttonsGameClue from '../scenes/buttons-game-clue';

interface sceneOrder {
  name: string;
  value: State;
  clue?: string;
}

class ScenesService {
  order: sceneOrder[] = [
    {
      name: 'Regestration',
      value: regestration
    },
    {
      name: 'WaitToBegin',
      value: waitToBegin
    },
    {
      name: 'GenesisGreeting',
      value: startGame
    },
    {
      name: 'DefensiveMechanismActivated',
      value: defensiveMechanismActivated
    },
    {
      name: 'ButtonsGame',
      value: buttonsGame,
      clue: 'ButtonsGameClue'
    }
  ];

  clues = [
    {
      name: 'ButtonsGameClue',
      value: buttonsGameClue
    }
  ];

  constructor() {}

  getOrder() {
    return this.order;
  }

  getNextSceneByName(currentSeceneName: string) {
    const currentSceneIndex = _.findIndex(this.order, scene => scene.name === currentSeceneName);
    return currentSceneIndex === this.order.length - 1
      ? this.order[0].value
      : this.order[currentSceneIndex + 1].value;
  }

  getSceneByName(currentSeceneName: string): State {
    return _.find(this.order, scene => scene.name === currentSeceneName).value || undefined;
  }

  getSceneClue(currentSeceneName: string): string {
    const currentScene = _.find(this.order, scene => scene.name === currentSeceneName);
    return currentScene.clue;
  }
}

export default new ScenesService();
