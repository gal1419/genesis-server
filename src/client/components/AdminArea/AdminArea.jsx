import React, { Component } from "react";
import axios from "axios";

class AdminArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scenes: [],
      arduinoEvents: [
        "SnakeDrawerOpened",
        "GlassesDrawerOpened",
        "CoreDrawerOpened",
        "FrameChipRemoved",
        "VRDrawerOpened"
      ],
      volumeCommands: ["VolumeUp", "VolumeDown", "Mute"],
      intervalId: null,
      currentStateName: "Waiting for server response...."
    };
  }

  componentDidMount() {
    const intervalId = setInterval(() => this.timer(), 5000);

    axios
      .get("/api/scene-names-order")
      .then(scenes => {
        this.setState({
          intervalId,
          scenes: scenes.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    const { intervalId } = this.state;
    clearInterval(intervalId);
  }

  excuteScene = scene => {
    axios.get(`/api/load-scene/${scene}/`).catch(err => {
      console.log(err);
    });
  };

  excuteArdiunoEvent = eventName => {
    axios.get(`/api/arduino/${eventName}/`).catch(err => {
      console.log(err);
    });
  };

  excuteVolumeCommand = command => {
    axios
      .get(`/api/volume/${command}/`)
      .catch(err => {
        console.log(err);
      });
  };

  excuteShowCodeCommand = () => {
    axios.get(`/api/show-code`).catch(err => {
      console.log(err);
    });
  };

  endScene = () => {
    axios
      .get("/api/end-scene/")
      .then(() => {
        console.log("sent: end-scene");
      })
      .catch(err => {
        console.log(err);
      });
  };

  timer() {
    axios
      .get("/api/current-state/")
      .then(data => {
        console.log(`current-state: ${data.data.currentStateName}`);
        this.setState({ currentStateName: data.data.currentStateName });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { scenes, arduinoEvents, volumeCommands } = this.state;

    return (
      <div>
        <div className="header-area">
          Current State: {this.state.currentStateName}
        </div>
        <div className="scenes-area">
          {scenes.map(scene => (
            <button
              className="admin-button admin-button-scene"
              onClick={e => this.excuteScene(scene)}
            >
              {scene}
            </button>
          ))}
        </div>

        <div className="arduino-events-area">
          {arduinoEvents.map(event => (
            <button
              className="admin-button admin-button-arduino-event"
              onClick={e => this.excuteArdiunoEvent(event)}
            >
              {event}
            </button>
          ))}
        </div>

        <div className="volume-command-area">
          {volumeCommands.map(cmd => (
            <button
              className="admin-button admin-button-volume-command
              "
              onClick={e => this.excuteVolumeCommand(cmd)}
            >
              {cmd}
            </button>
          ))}
          <button
            className="admin-button admin-button-volume-command
              "
            onClick={e => this.excuteShowCodeCommand()}
          >
            ShowCode
          </button>
          <button
            className="admin-button admin-button-volume-command
              "
            onClick={e => this.endScene()}
          >
            EndScene
          </button>
        </div>
      </div>
    );
  }
}

export default AdminArea;
