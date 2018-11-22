let instance: SocketIO.Socket;

class SocketService {
  static initialize(socket) {
    if (instance) {
      throw new Error('socket is already initilized');
    }

    instance = socket;

    instance.on('connection', (socket) => {
      console.log('connected');
      socket.on('gal', (data) => {
        console.log(data);
        socket.emit('loadScene', { hello: 'Hey there browser!' });
      });
      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    });
  }

  static getSocket() {
    if (!instance) {
      throw new Error('socket is not initilized');
    }

    return instance;
  }
}

export default SocketService;
