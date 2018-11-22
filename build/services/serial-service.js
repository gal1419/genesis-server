"use strict";
var SerialPort = require('serialport');
var Readline = require('@serialport/parser-readline');
var instance = null;
var SerialService = /** @class */ (function () {
    function SerialService() {
    }
    SerialService.initialize = function () {
        if (instance) {
            throw new Error('serial port is already initilized');
        }
        var port = new SerialPort(process.env.SERIAL_PORT, {
            baudRate: 9600
        });
        var parser = port.pipe(new Readline({ delimiter: '\r\n' }));
        instance = parser;
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
        if (!instance) {
            throw new Error('serial port is not initilized');
        }
        return instance;
    };
    return SerialService;
}());
module.exports = SerialService;
//# sourceMappingURL=serial-service.js.map