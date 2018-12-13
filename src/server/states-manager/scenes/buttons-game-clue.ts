import State from '../state';
import { StateManager } from '../services/state-manager';
import { ArduinoEvents } from '../constans';
import scenesService from '../services/scenes-service';

class ButtonsGameClue extends State {
  manager: StateManager;

  readonly sceneName = 'ButtonsGame';

  execute = (manager: StateManager): void => {};

  arduinoListener(data) {}
}

export default new ButtonsGameClue();
