const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

let serialInstance = null;

class SerialService {
  serialInstance;

  static initialize() {
    if (serialInstance) {
      throw new Error('serial port is already initilized');
    }

    const port = new SerialPort(process.env.SERIAL_PORT, {
      baudRate: 9600
    });

    const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

    serialInstance = parser;

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
    if (!serialInstance) {
      throw new Error('serial port is not initilized');
    }

    return serialInstance;
  }
}

export default SerialService;
