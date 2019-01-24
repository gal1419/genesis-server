import _ from "lodash";
import waitToBegin from "../scenes/wait-to-begin";
import State from "../state";
import defensiveMechanismActivated from "../scenes/defensive-mechanism-activated";
import buttonsGame from "../scenes/buttons-game";
import mazeGame from "../scenes/maze-game";
import numbersGame from "../scenes/numbers-game";
import switchesGame from "../scenes/switches-game";
import wifiGame from "../scenes/wifi-game";
import textMessage from "../scenes/text-message";
import scientistEncouragement from "../scenes/scientist-encouragement";
import colorsGame from "../scenes/colors-game";
import timerWithGenesis from "../scenes/timer-with-genesis";
import genesisGreeting from "../scenes/genesis-greeting";
import genesisBeforeVR from "../scenes/genesis-before-vr";
import scientistBeforeVR from "../scenes/scientist-before-vr";
import vrGame from "../scenes/vr-game";
import endGame from "../scenes/end-game";

interface sceneOrder {
  name: string;
  value: State;
  clue?: string;
}

class ScenesService {
  order: sceneOrder[] = [
    {
      name: "WaitToBegin",
      value: waitToBegin
    },
    {
      name: "GenesisGreeting",
      value: genesisGreeting
    },
    // {
    //   name: "DefensiveMechanismActivated",
    //   value: defensiveMechanismActivated
    // },
    {
      name: "TimerWithGenesis",
      value: timerWithGenesis
    },
    {
      name: "ButtonsGame",
      value: buttonsGame,
      clue: "ButtonsGameClue"
    },
    {
      name: "MazeGame",
      value: mazeGame,
      clue: "MazeGameClue"
    },
    {
      name: "NumbersGame",
      value: numbersGame,
      clue: "NumbersGameClue"
    },
    {
      name: "SwitchesGame",
      value: switchesGame,
      clue: "SwitchesGameClue"
    },
    {
      name: "WifiGame",
      value: wifiGame
    },
    {
      name: "ScientistEncouragement",
      value: scientistEncouragement
    },
    {
      name: "ColorsGame",
      value: colorsGame
    },
    {
      name: "TextMessage",
      value: textMessage,
      clue: "TextMessageClue"
    },
    {
      name: "GenesisBeforeVR",
      value: genesisBeforeVR
    },
    {
      name: "ScientistBeforeVR",
      value: scientistBeforeVR
    },
    {
      name: "VRGame",
      value: vrGame
    },
    {
      name: "EndGame",
      value: endGame
    }
  ];

  constructor() {}

  getOrder() {
    return this.order;
  }

  getScenesNameByOrder() {
    return this.order.map(scene => scene.name);
  }

  getNextSceneByName(currentSeceneName: string) {
    const currentSceneIndex = _.findIndex(
      this.order,
      scene => scene.name === currentSeceneName
    );
    return currentSceneIndex === this.order.length - 1
      ? this.order[0].value
      : this.order[currentSceneIndex + 1].value;
  }

  getSceneByName(currentSeceneName: string): State {
    return (
      _.find(this.order, scene => scene.name === currentSeceneName).value ||
      undefined
    );
  }

  getSceneClue(currentSeceneName: string): string {
    const currentScene = _.find(
      this.order,
      scene => scene.name === currentSeceneName
    );
    return currentScene.clue;
  }
}

export default new ScenesService();
