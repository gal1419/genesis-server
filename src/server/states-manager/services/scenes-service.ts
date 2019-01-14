import _ from 'lodash';
import regestration from '../scenes/regestration';
import waitToBegin from '../scenes/wait-to-begin';
import startGame from '../scenes/genesis-greeting';
import State from '../state';
import defensiveMechanismActivated from '../scenes/defensive-mechanism-activated';
import buttonsGame from '../scenes/buttons-game';
import buttonsGameClue from '../scenes/buttons-game-clue';
import mazeGame from '../scenes/maze-game';
import numbersGame from '../scenes/numbers-game';
import switchesGame from '../scenes/switches-game';
import chipGame from '../scenes/chip-game';
import wifiGame from '../scenes/wifi-game';
import textMessage from '../scenes/text-message';
import scientistEncouragement from '../scenes/scientist-encouragement';
import genesisMalfunction from '../scenes/genesis-malfunction';
import colorsGame from '../scenes/colors-game';
import timerWithGenesis from '../scenes/timer-with-genesis';
import genesisGreeting from '../scenes/genesis-greeting';
import genesisBeforeVR from '../scenes/genesis-before-vr';
import scientistBeforeVR from '../scenes/scientist-before-vr';
import vrGame from '../scenes/vr-game';
import endGame from '../scenes/end-game';

interface sceneOrder {
  name: string;
  value: State;
  clue?: string;
}

class ScenesService {
  order: sceneOrder[] = [
    // {
    //   name: 'Regestration',
    //   value: regestration
    // },
    {
      name: 'WaitToBegin',
      value: waitToBegin
    },
    {
      name: 'GenesisGreeting',
      value: genesisGreeting
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
      value: mazeGame,
      clue: 'MazeGameClue'
    },
    {
      name: 'NumbersGame',
      value: numbersGame,
      clue: 'NumbersGameClue'
    },
    {
      name: 'SwitchesGame',
      value: switchesGame,
      clue: 'ChipGameClue'
    },
    // {
    //   name: 'ChipGame',
    //   value: chipGame
    // },
    {
      name: 'WifiGame',
      value: wifiGame
    },
    {
      name: 'GenesisMalfunction',
      value: genesisMalfunction
    },
    {
      name: 'ScientistEncouragement',
      value: scientistEncouragement
    },
    {
      name: 'ColorsGame',
      value: colorsGame
    },
    {
      name: 'TextMessage',
      value: textMessage,
      clue: 'TextMessageClue'
    },
    {
      name: 'GenesisBeforeVR',
      value: genesisBeforeVR,
    },
    {
      name: 'ScientistBeforeVR',
      value: scientistBeforeVR,
    },
    {
      name: 'VRGame',
      value: vrGame,
    },
    {
      name: 'EndGame',
      value: endGame,
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
