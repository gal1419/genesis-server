import _ from 'lodash';
import regestration from '../scenes/regestration';
import waitToBegin from '../scenes/wait-to-begin';
import startGame from '../scenes/start-game';
import State from '../state';
import defensiveMechanismActivated from '../scenes/defensive-mechanism-activated';
import buttonsGame from '../scenes/buttons-game';
import buttonsGameClue from '../scenes/buttons-game-clue';
import mazeGame from '../scenes/maze-game';
import numbersGame from '../scenes/numbers-game';
import switchesGame from '../scenes/switches-game';
import chipGame from '../scenes/chip-game';
import timerWithGenesis from '../scenes/timer-with-genesis';

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
      name: 'TimerWithGenesis',
      value: timerWithGenesis
    },
    {
      name: 'ButtonsGame',
      value: buttonsGame,
      clue: 'ButtonsGameClue'
    },
    {
      name: 'MazeGame',
      value: mazeGame
    },
    {
      name: 'NumbersGame',
      value: numbersGame,
      clue: 'NumbersGameClue'
    },
    {
      name: 'SwitchesGame',
      value: switchesGame,
      clue: 'SwitchesGameClue'
    },    
    {
      name: 'ChipGame',
      value: chipGame,
    },
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
