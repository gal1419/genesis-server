import React, { Component } from 'react';
import { ReactTerminal } from 'react-terminal-component';
// import {
//   EnvironmentVariables, FileSystem, History,
//   Outputs,
// } from 'javascript-terminal';
import {
  EmulatorState,
  CommandMapping,
  defaultCommandMapping,
  OutputFactory
} from 'javascript-terminal';

class MainArea extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    const customCommandMapping = CommandMapping.create({
      ...defaultCommandMapping,
      hack: {
        function: (state, opts) => {
          const input = opts.join(' ');
          console.log(input);

          return {
            output: OutputFactory.makeTextOutput('you starting hack to Halnet')
          };
        },
        optDef: {}
      }
    });
    this.emulatorState = EmulatorState.create({
      // fs: customFileSystem,
      // environmentVariables: customEnvVariables,
      // history: customHistory,
      // outputs: customOutputs,
      commandMapping: customCommandMapping
    });
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <ReactTerminal emulatorState={this.emulatorState} />
      </div>
    );
  }
}

export default MainArea;
