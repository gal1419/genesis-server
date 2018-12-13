import request from 'request-promise';

export type UnityRestListenerType = (request, response) => any;

class UnityRestService {
  private listenersMap: Map<string, UnityRestListenerType> = new Map();

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
    console.log(this.listenersMap);
    this.listenersMap.forEach((value) => {
      value(request, response);
    });
  }

  addListener(listenerId: string, listener: UnityRestListenerType) {
    console.log(this.listenersMap);
    this.listenersMap.set(listenerId, listener);
    console.log(this.listenersMap);
  }

  removeListener(listenerId: string) {
    console.log(this.listenersMap);
    this.listenersMap.delete(listenerId);
    console.log(this.listenersMap);
  }
}

export default new UnityRestService();
