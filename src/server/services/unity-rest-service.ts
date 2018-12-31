import request from 'request-promise';

export type UnityRestListenerType = (request, response) => any;

class UnityRestService {
  private listenersMap: Map<string, UnityRestListenerType> = new Map();

  sendPrimaryUnityMessage(event: string, body: string) {
    const url = `http://${process.env.PRIMARY_UNITY_IP}:${
      process.env.PRIMARY_UNITY_PORT
    }/${event}/`;
    console.log('sending to unity to url: ' + url + ', body: ' + body);
    return this.sendMessage(url, body)
      .then(r => console.log(r))
      .catch(e => console.log(e));
  }

  sendSecondryUnityMessage(event: string, body: string) {
    const url = `http://${process.env.SECONDRY_UNITY_IP}:${
      process.env.SECONDRY_UNITY_PORT
    }/${event}`;
    console.log('sending to unity to url: ' + url + ', body: ' + body);
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
    this.listenersMap.forEach((value) => {
      value(request, response);
    });
  }

  addListener(listenerId: string, listener: UnityRestListenerType) {
    this.listenersMap.set(listenerId, listener);
  }

  removeListener(listenerId: string) {
    this.listenersMap.delete(listenerId);
  }
}

export default new UnityRestService();
