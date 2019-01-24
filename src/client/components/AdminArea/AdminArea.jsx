import React, { Component } from "react";
import axios from "axios";

class AdminArea extends Component {
  constructor(props) {
    super(props);

    this.minutesInput = React.createRef();

    this.state = {
      scenes: [],
      minutes: 30,
      logs: [],
      arduinoEvents: [
        "SnakeDrawerOpened",
        "GlassesDrawerOpened",
        "CoreDrawerOpened",
        "FrameChipRemoved",
        "VRDrawerOpened"
      ],
      volumeCommands: ["VolumeUp", "VolumeDown", "Mute"],
      currentStateInterval: null,
      currentStateName: "Waiting for server response...."
    };
  }

  componentDidMount() {
    const currentStateInterval = setInterval(
      () => this.getCurrentState(),
      5000
    );
    const logsInterval = setInterval(() => this.getNextLog(), 500);

    axios
      .get("/api/scene-names-order")
      .then(scenes => {
        this.setState({
          currentStateInterval,
          scenes: scenes.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    const { currentStateInterval } = this.state;
    clearInterval(currentStateInterval);
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
    axios.get(`/api/volume/${command}/`).catch(err => {
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

  getCurrentState() {
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

  getNextLog() {
    axios
      .get("/api/logs/")
      .then(response => {
        if (response.data) {
          this.setState(prevState => {
            return {
              logs: [...prevState.logs, response.data.msg]
            };
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  onMinutesChange(event) {
    this.setState({
      minutes: event.target.value
    });
  }

  resetTimer() {
    axios.get(`/api/reset-timer/${this.state.minutes}`).catch(err => {
      console.log(err);
    });
  }

  render() {
    const { scenes, arduinoEvents, volumeCommands, logs, minutes } = this.state;

    return (
      <div>
        <div className="header-area">
          Current State: {this.state.currentStateName}
        </div>
        <div className="scenes-area">
          {scenes.map(scene => (
            <button
              key={scene}
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
              key={event}
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
              key={cmd}
              className="admin-button admin-button-volume-command"
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
            className="admin-button admin-button-volume-command"
            onClick={e => this.endScene()}
          >
            EndScene
          </button>
          <div>
            <input
              type="number"
              name="minutes"
              className="admin-button"
              min="0"
              max="30"
              value={minutes}
              ref={minutesInput => {
                this.minutesInput = minutesInput;
              }}
              onChange={this.onMinutesChange.bind(this)}
            />
            <button
              className="admin-button admin-button-volume-command"
              onClick={e => this.resetTimer()}
            >
              Reset Timer
            </button>
          </div>
        </div>

        <div className="logs-area">
          {logs.map((log, index) => {
            return <div key={index}>{log}</div>;
          })}
        </div>
      </div>
    );
  }
}

export default AdminArea;
