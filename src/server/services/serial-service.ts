import SerialPort from 'serialport';
import Readline from '@serialport/parser-readline';
import _ from 'lodash';

export type SerialPortListenerType = (data: string) => any;

class SerialPortService {
  private serialInstance;

  private parser;

  private listenersMap: Map<string, SerialPortListenerType> = new Map();

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
      this.listenersMap.forEach((value) => {
        value(data);
      });
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

  addListener(listenerId: string, listener: SerialPortListenerType) {
    this.listenersMap.set(listenerId, listener);
  }

  removeListener(listenerId: string) {
    this.listenersMap.delete(listenerId);
  }
}

export default new SerialPortService();
