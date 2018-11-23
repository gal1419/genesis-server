import { SceneNumber } from '../states-manager/scenes-signals';

export interface SocketMessage {
  type: string;
  message: string;
}

export type SocketListenerType = () => any;

let instance: SocketIO.Socket;

class SocketService {
  private listenersMap: Map<string, SocketListenerType> = new Map();

  initialize(socket) {
    if (instance) {
      throw new Error('socket is already initilized');
    }

    instance = socket;

    instance.on('connection', socket => {
      console.log('connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  sendMessage(event: string, message: SocketMessage) {
    instance.emit('loadScene', message);
  }

  addListener(event: string, listener: () => void) {
    this.listenersMap.set(event, listener);
    instance.on(event, listener);
  }

  removeListener(event: string) {
    instance.off(event, <any>this.listenersMap.get(event));
  }
}

export default new SocketService();
