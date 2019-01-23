import SerialPort from 'serialport';
import Readline from '@serialport/parser-readline';
import _ from 'lodash';
import StateManager from '../states-manager/services/state-manager';
import logsService from './logs-service';

export type ArduinoListenerType = (data: string) => any;

class ArduinoService {
  private serialInstance;

  private stateManager = StateManager.getInstance();

  private parser;

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
      logsService.handleLog(`Data: ${data}`);
      this.stateManager.handleArduinoMessage(data);
    });

    this.serialInstance.on('error', (err) => {
      logsService.handleLog(`Error: ${err.message}`);
    });
  }

  sendMessage(message: string) {
    this.serialInstance.write(message, (err) => {
      if (err) {
        return logsService.handleLog(`Error on write: ${err.message}`);
      }
      logsService.handleLog(`Arduino message written: ${message}`);
    });
  }
}

export default new ArduinoService();
