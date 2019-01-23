"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var state_manager_1 = __importDefault(require("../../states-manager/services/state-manager"));
var scenes_service_1 = __importDefault(require("../../states-manager/services/scenes-service"));
var commands_service_1 = __importDefault(require("../../services/commands-service"));
var unity_rest_service_1 = __importDefault(require("../../services/unity-rest-service"));
var apiRouter = express_1.default.Router();
var stateManager = state_manager_1.default.getInstance();
var loadScene = function (req, res, next) {
    var sceneName = req.body.sceneName;
    var scene = scenes_service_1.default.getSceneByName(sceneName);
    if (!scene) {
        res.status(404).json({ msg: "Scene not found" });
        return;
    }
    stateManager.setState(scene);
    stateManager.execute();
    res.status(200).json({ msg: "OK" });
};
var loadSceneGet = function (req, res, next) {
    var sceneName = req.params.scene_name;
    var stateManager = state_manager_1.default.getInstance();
    var scene = scenes_service_1.default.getSceneByName(sceneName);
    if (!scene) {
        res.status(404).json({ msg: "Scene not found" });
        return;
    }
    stateManager.setState(scene);
    stateManager.execute();
    res.status(200).json({ msg: "OK" });
};
/**
 * POST /api/load-scene
 * Start the game
 */
apiRouter.post("/load-scene", loadScene);
apiRouter.get("/load-scene/:scene_name", loadSceneGet);
apiRouter.post("/unity", function (req, res) {
    console.log('got unity');
    stateManager.handleRestRequest(req, res);
});
apiRouter.get("/end-scene", function (req, res) {
    console.log('got end-scene');
    stateManager.endScene(req, res);
});
apiRouter.get("/current-state", function (req, res) {
    stateManager.getCurrentStateName(req, res);
});
apiRouter.get("/scene-names-order", function (req, res) {
    var sceneNames = scenes_service_1.default.getScenesNameByOrder();
    console.log(sceneNames);
    res.status(200).json(sceneNames);
});
apiRouter.get("/arduino/:event", function (req, res) {
    var event = req.params.event;
    console.log('got arduino event from rest: ' + event);
    stateManager.handleArduinoMessage(event);
    res.status(200).json({ msg: "OK" });
});
apiRouter.get("/commands/:command/:user_uniqueness", function (req, res) {
    var command = req.params.command;
    console.log('got command event from rest: ' + command);
    commands_service_1.default.runCommand(req, res);
});
apiRouter.get("/commands", function (req, res) {
    commands_service_1.default.getCommands(req, res);
});
apiRouter.get("/show-code", function (req, res) {
    console.log('got ShowCode event from rest');
    unity_rest_service_1.default.sendTheardUnityMessage("load-scene", "ShowCode");
    res.status(200).json({ msg: "OK" });
});
apiRouter.get("/volume/:command", function (req, res) {
    var command = req.params.command;
    console.log('got volume event from rest:' + command);
    unity_rest_service_1.default.sendPrimaryUnityMessage("load-scene", command);
    res.status(200).json({ msg: "OK" });
});
exports.default = apiRouter;
//# sourceMappingURL=index.js.map