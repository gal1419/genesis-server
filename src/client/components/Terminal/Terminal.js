/**
 * this component is not in use, it was intended to force different users to run different command so one user cannot run all command
 * 
 */
import React, { Component } from 'react';
import { ReactTerminal, ReactOutputRenderers } from 'react-terminal-component';
import {
  EmulatorState, CommandMapping, defaultCommandMapping, OutputFactory, Outputs
} from 'javascript-terminal';
import axios from 'axios';

const PAPER_TYPE = 'paper';

const paperStyles = {
};
const COMMAND_RUN_BEFOR_ERROR_MSG = 'command run before, run another command'
const USER_RUN_COMMAND_BEFOR_ERROR_MSG = 'you run a command before, other commands should be run from other device'

const PaperOutput = ({ content }) => {
  let lines = [];
  for (let i = 0; i < content.lines.length; i++) {
    lines.push(<div key={i}>
      {
        content.lines[i]
      }
    </div>)
  }
  return (lines);
};

const createPaperRecord = (lines) => new OutputFactory.OutputRecord({
  type: PAPER_TYPE,
  content: {
    lines: lines,
  }
});

class Terminal extends Component {
  commandsData
  constructor(props) {
    super(props);
    // localStorage.coockie = Math.random().toString(36).slice(2);
    localStorage.coockie = localStorage.coockie ? localStorage.coockie : Math.random().toString(36).slice(2);
    this.getCommands();
    this.state = {};
    const customCommandMapping = CommandMapping.create({
      ...defaultCommandMapping,
      '--help': {
        function: (state, opts) => {
          const input = opts.join(' ');

          return {
            output: createPaperRecord(['shut_down_core_1 - to shut down core 1', 'shut_down_core_2 - to shut down core 2', 'shut_down_core_3 - to shut down core 3'])
          };
        },
        optDef: {}
      },
      shut_down_core_1: {
        function: (state, opts) => {
          const input = opts.join(' ');
          let output = '';
          if(this.didUserRunCommandBefore()){
            output = USER_RUN_COMMAND_BEFOR_ERROR_MSG;
          } else {
            output = this.commandsData['shut_down_core_1'] ? COMMAND_RUN_BEFOR_ERROR_MSG : this.runCommand('shut_down_core_1', 1);
          }
          
          return {
            output: createPaperRecord([output])
          };
        },
        optDef: {}
      },
      shut_down_core_2: {
        function: (state, opts) => {
          const input = opts.join(' ');
          let output = '';
          if(this.didUserRunCommandBefore()){
            output = USER_RUN_COMMAND_BEFOR_ERROR_MSG;
          } else {
            output = this.commandsData['shut_down_core_2'] ? COMMAND_RUN_BEFOR_ERROR_MSG : this.runCommand('shut_down_core_2', 2);
          }
          
          return {
            output: createPaperRecord([output])
          };
        },
        optDef: {}
      },
      shut_down_core_3: {
        function: (state, opts) => {
          const input = opts.join(' ');
          let output = '';
          if(this.didUserRunCommandBefore()){
            output = USER_RUN_COMMAND_BEFOR_ERROR_MSG;
          } else {
            output = this.commandsData['shut_down_core_3'] ? COMMAND_RUN_BEFOR_ERROR_MSG : this.runCommand('shut_down_core_3', 3);
          }
          
          return {
            output: createPaperRecord([output])
          };
        },
        optDef: {}
      },
    });
    const textOutput = OutputFactory.makeTextOutput(
      `for help run --help`
    );
    
    const customOutputs = Outputs.create([textOutput]);
    this.emulatorState = EmulatorState.create({
      // fs: customFileSystem,
      // environmentVariables: customEnvVariables,
      // history: customHistory,
      outputs: customOutputs,
      commandMapping: customCommandMapping
    });
  }

  runCommand(command, coreNumber) {
    axios
      .get(`/api/commands/${command}/${localStorage.coockie}`)
      .then((data) => {
        this.commandsData = data.data.commands;
      })
      .catch((err) => {
        console.log(err);
      });
      return 'you started shut down of cure ' + coreNumber;
  }

  didUserRunCommandBefore() {
    return this.getUserUniqueness('shut_down_core_1') === localStorage.coockie ||
    this.getUserUniqueness('shut_down_core_2') === localStorage.coockie ||
    this.getUserUniqueness('shut_down_core_3') === localStorage.coockie
  }

  getUserUniqueness (command) {
    return this.commandsData[command] && this.commandsData[command].userUniqueness;
  }

  getCommands() {
    return axios
      .get(`/api/commands/`)
      .then((data) => {
        this.commandsData = data.data.commands;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <div className="terminal-alert-image-container"><img src="./public/terminal-alert-image.png"></img></div>
        <ReactTerminal
          outputRenderers={{
            ...ReactOutputRenderers,
            [PAPER_TYPE]: PaperOutput
          }}
          emulatorState={this.emulatorState}
        />
      </div>
    );
  }
}

export default Terminal;
