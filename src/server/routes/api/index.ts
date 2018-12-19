import express from 'express';
import * as passportConfig from '../../config/passport';
import UnityRestService from '../../services/unity-rest-service';
import StateManager from '../../states-manager/services/state-manager';
import scenesService from '../../states-manager/services/scenes-service';
import commandService from '../../services/commands-service';

const apiRouter = express.Router();

const loadScene = (req, res, next) => {
  const { sceneName } = req.body;
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

apiRouter.post('/unity', (req, res) => {
  UnityRestService.handleIncomingMessage(req, res);
});

apiRouter.get('/commands/:command/:user_uniqueness', (req, res) => {
  commandService.runCommand(req, res);
});
apiRouter.get('/commands', (req, res) => {
  commandService.getCommands(req, res);
});
export default apiRouter;
