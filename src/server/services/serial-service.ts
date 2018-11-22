const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

let instance = null;

class SerialService {
  static initialize() {
    if (instance) {
      throw new Error('serial port is already initilized');
    }

    const port = new SerialPort(process.env.SERIAL_PORT, {
      baudRate: 9600
    });

    const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

    instance = parser;

    parser.on('data', (data) => {
      console.log(`Arduino: ${data}`);

      if (data === 'ready') {
        port.write('Kalish is a Rabbit', (err) => {
          if (err) {
            return console.log('Error on write: ', err.message);
          }
          console.log('message written');
        });
      }
    });

    port.on('error', (err) => {
      console.log('Error: ', err.message);
    });
  }

  static getPort() {
    if (!instance) {
      throw new Error('serial port is not initilized');
    }

    return instance;
  }
}

module.exports = SerialService;
