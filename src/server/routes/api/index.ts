import express from 'express';
import * as passportConfig from '../../config/passport';
import UnityRestService from '../../services/unity-rest-service';
import StateManager from '../../states-manager/services/state-manager';
import scenesService from '../../states-manager/services/scenes-service';
import commandService from '../../services/commands-service';
import waitToBegin from '../../states-manager/scenes/wait-to-begin';

const apiRouter = express.Router();

const stateManager = StateManager.getInstance();
stateManager.setState(waitToBegin)
const loadScene = (req, res, next) => {
  const { sceneName } = req.body;
  const scene = scenesService.getSceneByName(sceneName);

  if (!scene) {
    res.status(404).json({ msg: 'Scene not found' });
    return;
  }

  stateManager.setState(scene);
  stateManager.execute();
  res.status(200).json({ msg: 'OK' });
};

const loadSceneGet = (req, res, next) => {
  const sceneName  = req.params.scene_name
  const stateManager = StateManager.getInstance();
  const scene = scenesService.getSceneByName(sceneName);

  if (!scene) {
    res.status(404).json({ msg: 'Scene not found' });
    return;
  }

  stateManager.setState(scene);
  stateManager.execute();
  res.status(200).json({ msg: 'OK' });
};

/**
 * POST /api/load-scene
 * Start the game
 */
// apiRouter.post(
//   '/load-scene',
//   passportConfig.isAuthenticated,
//   passportConfig.roleAuthorization(['admin']),
//   loadScene
// );

/**
 * POST /api/load-scene
 * Start the game
 */
apiRouter.post('/load-scene', loadScene);

apiRouter.get('/load-scene/:scene_name', loadSceneGet);

apiRouter.post('/unity', (req, res) => {
  stateManager.handleRestRequest(req, res);
});

apiRouter.get('/commands/:command/:user_uniqueness', (req, res) => {
  commandService.runCommand(req, res);
});
apiRouter.get('/commands', (req, res) => {
  commandService.getCommands(req, res);
});
export default apiRouter;
