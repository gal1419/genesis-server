import request from "request-promise";
import logsService from "./logs-service";

class UnityRestService {
  sendPrimaryUnityMessage(event: string, body: string) {
    const url = `http://${process.env.PRIMARY_UNITY_IP}:${
      process.env.PRIMARY_UNITY_PORT
    }/${event}/`;
    logsService.handleLog(
      "sending to unity 1 to url: " + url + ", body: " + body
    );
    return this.sendMessage(url, body)
      .then(r => logsService.handleLog(r))
      .catch(e => logsService.handleLog(e.message));
  }

  sendSecondryUnityMessage(event: string, body: string) {
    const url = `http://${process.env.SECONDRY_UNITY_IP}:${
      process.env.SECONDRY_UNITY_PORT
    }/${event}/`;
    logsService.handleLog("sending to unity 2 to url: " + url + ", body: " + body);
    return this.sendMessage(url, body);
  }

  sendTheardUnityMessage(event: string, body: string) {
    const url = `http://${process.env.THIRD_UNITY_IP}:${
      process.env.THIRD_UNITY_PORT
    }/${event}/`;
    logsService.handleLog("sending to unity 3 to url: " + url + ", body: " + body);
    return this.sendMessage(url, body);
  }

  sendFaceRecognitionMessage(event: string) {
    const url = `http://${process.env.PRIMARY_UNITY_IP}/Temporary_Listen_Addresses/${event}/`;
    logsService.handleLog("Sending to face recognition service: " + url);
    this.sendMessage(url, '');
  }

  sendMessage(url: string, body: string) {
    return request.post({
      url,
      body,
      headers: {
        "Content-Type": "text/html"
      }
    });
  }
}

export default new UnityRestService();
