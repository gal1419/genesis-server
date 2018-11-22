"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SerialPort = require('serialport');
var Readline = require('@serialport/parser-readline');
var serialInstance = null;
var SerialService = /** @class */ (function () {
    function SerialService() {
    }
    SerialService.initialize = function () {
        if (serialInstance) {
            throw new Error('serial port is already initilized');
        }
        var port = new SerialPort(process.env.SERIAL_PORT, {
            baudRate: 9600
        });
        var parser = port.pipe(new Readline({ delimiter: '\r\n' }));
        serialInstance = parser;
        parser.on('data', function (data) {
            console.log("Arduino: " + data);
            if (data === 'ready') {
                port.write('Kalish is a Rabbit', function (err) {
                    if (err) {
                        return console.log('Error on write: ', err.message);
                    }
                    console.log('message written');
                });
            }
        });
        port.on('error', function (err) {
            console.log('Error: ', err.message);
        });
    };
    SerialService.getPort = function () {
        if (!serialInstance) {
            throw new Error('serial port is not initilized');
        }
        return serialInstance;
    };
    return SerialService;
}());
exports.default = SerialService;
//# sourceMappingURL=serial-service.js.map