"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var serialport_1 = __importDefault(require("serialport"));
var parser_readline_1 = __importDefault(require("@serialport/parser-readline"));
var SerialPortService = /** @class */ (function () {
    function SerialPortService() {
        this.listenersMap = new Map();
    }
    SerialPortService.prototype.initialize = function () {
        var _this = this;
        if (this.serialInstance) {
            throw new Error('serial port is already initilized');
        }
        if (!process.env.SERIAL_PORT) {
            throw new Error('SERIAL_PORT was not defined');
        }
        this.serialInstance = new serialport_1.default(process.env.SERIAL_PORT, {
            baudRate: 9600
        });
        this.parser = this.serialInstance.pipe(new parser_readline_1.default({ delimiter: '\r\n' }));
        this.parser.on('data', function (data) {
            console.log("Data: " + data);
            _this.listenersMap.forEach(function (value) {
                value(data);
            });
        });
        this.serialInstance.on('error', function (err) {
            console.log('Error: ', err.message);
        });
    };
    SerialPortService.prototype.sendMessage = function (message) {
        this.serialInstance.write(message, function (err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('message written');
        });
    };
    SerialPortService.prototype.addListener = function (listenerId, listener) {
        this.listenersMap.set(listenerId, listener);
    };
    SerialPortService.prototype.removeListener = function (listenerId) {
        this.listenersMap.delete(listenerId);
    };
    return SerialPortService;
}());
exports.default = new SerialPortService();
//# sourceMappingURL=serial-service.js.map