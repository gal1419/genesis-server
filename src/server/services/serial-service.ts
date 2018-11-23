import SerialPort from 'serialport';
import Readline from '@serialport/parser-readline';
import _ from 'lodash';

class SerialPortService {
  private serialInstance;

  private parser;

  private listeners: Array<(data: string) => any> = [];

  initialize() {
    if (this.serialInstance) {
      throw new Error('serial port is already initilized');
    }

    if (!process.env.SERIAL_PORT) {
      throw new Error('SERIAL_PORT was not defined');
    }

    this.serialInstance = new SerialPort(process.env.SERIAL_PORT, {
      baudRate: 9600
    });

    this.parser = this.serialInstance.pipe(new Readline({ delimiter: '\r\n' }));

    this.parser.on('data', (data) => {
      console.log(`Data: ${data}`);

      if (_.isEmpty(this.listeners)) {
        this.listeners.forEach((value) => {
          value(data);
        });
      }
    });

    this.serialInstance.on('error', (err) => {
      console.log('Error: ', err.message);
    });
  }

  sendMessage(message: string) {
    this.serialInstance.write(message, (err) => {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('message written');
    });
  }

  addListener(listener: (data: string) => any) {
    this.listeners.push(listener);
  }

  removeListener(listener: (data: string) => any) {
    _.remove(this.listeners, listener);
  }
}

export default new SerialPortService();
