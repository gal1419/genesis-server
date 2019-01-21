import React, { Component } from 'react';
import axios from 'axios';

class AdminArea extends Component {
  constructor(props) {
    super(props);
    this.state = {currentStateName: 'waiting for server response....'};
  }
  componentDidMount(scene) {
    var intervalId = setInterval(()=> this.timer(), 5000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount(scene) {
    clearInterval(this.state.intervalId);
  }

  timer(scene) {
    axios
    .get(`/api/current-state/`)
    .then((data) => {
      console.log('current-state: ' + data.data.currentStateName)
      this.setState({ currentStateName: data.data.currentStateName });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  excuteScene(scene) {
    axios
    .get(`/api/load-scene/${scene}/`)
    .catch((err) => {
      console.log(err);
    });
  }

  excuteArdiunoEvent(eventName) {
    axios
    .get(`/api/arduino/${eventName}/`)
    .catch((err) => {
      console.log(err);
    });
  }

  endScene() {
    axios
    .get(`/api/end-scene/`)
    .then((data) => {
      console.log('sent: end-scene');
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    return (
    <div>
      <div>
        AdminArea!
      </div>
      <div>
      <button onClick={(e) => this.excuteScene('WaitToBegin')}>
      WaitToBegin
      </button>
      <button onClick={(e) => this.excuteScene('GenesisGreeting')}>
        GenesisGreeting
      </button>
      <button onClick={(e) => this.excuteScene('DefensiveMechanismActivated')}>
      DefensiveMechanismActivated
      </button>
      <button onClick={(e) => this.excuteScene('TimerWithGenesis')}>
      TimerWithGenesis
      </button>
      <button onClick={(e) => this.excuteScene('ButtonsGame')}>
      ButtonsGame
      </button>
      <button onClick={(e) => this.excuteScene('MazeGame')}>
      MazeGame
      </button>
      <button onClick={(e) => this.excuteScene('NumbersGame')}>
      NumbersGame
      </button>
      <button onClick={(e) => this.excuteScene('SwitchesGame')}>
      SwitchesGame
      </button>
      <button onClick={(e) => this.excuteScene('WifiGame')}>
      WifiGame
      </button>
      <button onClick={(e) => this.excuteScene('GenesisMalfunction')}>
      GenesisMalfunction
      </button>
      <button onClick={(e) => this.excuteScene('ScientistEncouragement')}>
      ScientistEncouragement
      </button>
      <button onClick={(e) => this.excuteScene('ColorsGame')}>
      ColorsGame
      </button>
      <button onClick={(e) => this.excuteScene('TextMessage')}>
      TextMessage
      </button>
      <button onClick={(e) => this.excuteScene('GenesisBeforeVR')}>
      GenesisBeforeVR
      </button>
      <button onClick={(e) => this.excuteScene('ScientistBeforeVR')}>
      ScientistBeforeVR
      </button>
      <button onClick={(e) => this.excuteScene('VRGame')}>
      VRGame
      </button>
      <button onClick={(e) => this.excuteScene('EndGame')}>
      EndGame
      </button>
      <button onClick={(e) => this.endScene()}>
        End Scene
      </button>
      </div>
      <div>
        current state name: {this.state.currentStateName}
      </div>
      <button onClick={(e) => this.excuteArdiunoEvent('SnakeDrawerOpened')}>
        SnakeDrawerOpened
      </button>
      <button onClick={(e) => this.excuteArdiunoEvent('GlassesDrawerOpened')}>
        GlassesDrawerOpened
      </button>
      <button onClick={(e) => this.excuteArdiunoEvent('CoreDrawerOpened')}>
        CoreDrawerOpened
      </button>
      <button onClick={(e) => this.excuteArdiunoEvent('FrameChipRemoved')}>
        FrameChipRemoved
      </button>
      <button onClick={(e) => this.excuteArdiunoEvent('VRDrawerOpened')}>
        VRDrawerOpened
      </button>
    </div>);
  }
}

export default AdminArea;
