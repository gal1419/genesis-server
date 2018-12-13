import request from 'request-promise';

export type UnityRestListenerType = (request, response) => any;

class UnityRestService {
  private static listenersMap: Map<string, UnityRestListenerType> = new Map();

  sendPrimaryUnityMessage(event: string, body: string) {
    const url = `http://${process.env.PRIMARY_UNITY_IP}:${
      process.env.PRIMARY_UNITY_PORT
    }/${event}/`;
    return this.sendMessage(url, body)
      .then(r => console.log(r))
      .catch(e => console.log(e));
  }

  sendSecondryUnityMessage(event: string, body: string) {
    const url = `http://${process.env.SECONDRY_UNITY_IP}:${
      process.env.SECONDRY_UNITY_PORT
    }/${event}`;
    return this.sendMessage(url, body);
  }

  sendMessage(url: string, body: string) {
    return request.post({
      url,
      body,
      headers: {
        'Content-Type': 'text/html'
      }
    });
  }

  handleIncomingMessage(request, response) {
    console.log(UnityRestService.listenersMap);
    UnityRestService.listenersMap.forEach((value) => {
      value(request, response);
    });
  }

  addListener(listenerId: string, listener: UnityRestListenerType) {
    console.log(UnityRestService.listenersMap);
    UnityRestService.listenersMap.set(listenerId, listener);
    console.log(UnityRestService.listenersMap);
  }

  removeListener(listenerId: string) {
    console.log(UnityRestService.listenersMap);
    UnityRestService.listenersMap.delete(listenerId);
    console.log(UnityRestService.listenersMap);
  }
}

export default new UnityRestService();
