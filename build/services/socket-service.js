"use strict";
var instance = null;
var SocketService = /** @class */ (function () {
    function SocketService() {
    }
    SocketService.initialize = function (socket) {
        if (instance) {
            throw new Error('socket is already initilized');
        }
        instance = socket;
        instance.on('connection', function (socket) {
            console.log('connected');
            socket.on('gal', function (data) {
                console.log(data);
                socket.emit('loadScene', { hello: 'Hey there browser!' });
            });
            socket.on('disconnect', function () {
                console.log('Socket disconnected');
            });
        });
    };
    SocketService.getSocket = function () {
        if (!instance) {
            throw new Error('socket is not initilized');
        }
        return instance;
    };
    return SocketService;
}());
module.exports = SocketService;
//# sourceMappingURL=socket-service.js.map