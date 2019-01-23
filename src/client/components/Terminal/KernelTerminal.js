import React, { Component } from 'react';
import { ReactTerminal, ReactOutputRenderers } from 'react-terminal-component';
import {
  EmulatorState, CommandMapping, defaultCommandMapping, OutputFactory, Outputs
} from 'javascript-terminal';
import axios from 'axios';

const PAPER_TYPE = 'paper';

const shouldReturnLoadingBarDiv = (content) => content.lines.length === 1 && content.lines[0] === 'loading'
const PaperOutput = ({ content }) => {
  if(shouldReturnLoadingBarDiv(content)) {
    return <div className="load-bar">
            <div className="bar"></div>
          </div>
  }
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

const disabledCommandFunction = (state, opts) => {
  return {
    output: createPaperRecord(['The professor disabled this command, choose better'])
  };
}

const kernelHelpFunction = (state, opts) => {
  return {
    output: createPaperRecord(['resume_kernel - to recover any problem in the kernel system', 'restart_kernel - to restart the kernel system', 'shutdown_kernel - to shut down the kernel system'])
  };
}

class KernelTerminal extends Component {
  commandsData
  constructor(props) {
    super(props);
    localStorage.coockie = localStorage.coockie ? localStorage.coockie : Math.random().toString(36).slice(2);
    this.getCommands();
    this.state = {};
    const customCommandMapping = CommandMapping.create({
      ...defaultCommandMapping,
      kernel_help: {
        function: kernelHelpFunction,
        optDef: {}
      },
      Kernel_help: {
        function: kernelHelpFunction,
        optDef: {}
      },
      resume_kernel: {
        function: disabledCommandFunction,
        optDef: {}
      },
      Resume_kernel: {
        function: disabledCommandFunction,
        optDef: {}
      },
      restart_kernel: {
        function: disabledCommandFunction,
        optDef: {}
      },
      Restart_kernel: {
        function: disabledCommandFunction,
        optDef: {}
      },
      shutdown_kernel: {
        function: (state, opts) => {
          if(this.commandsData.shutdown_kernel) {
            return {
              output: createPaperRecord(['No need to shut down the kernel again, move on to other systems'])
            };
          }
          var elem = document.getElementsByClassName('terminalInput');
          elem[0].style.display = 'none';
          this.runCommand('shutdown_kernel');
          return {
            output: createPaperRecord(['loading'])
          };
        },
        optDef: {}
      },
      Shutdown_kernel: {
        function: (state, opts) => {
          if(this.commandsData.shutdown_kernel) {
            return {
              output: createPaperRecord(['No need to shut down the kernel again, move on to other systems'])
            };
          }
          var elem = document.getElementsByClassName('terminalInput');
          elem[0].style.display = 'none';
          this.runCommand('shutdown_kernel');
          return {
            output: createPaperRecord(['loading'])
          };
        },
        optDef: {}
      },
    });
    const textOutput = OutputFactory.makeTextOutput(
      `run kernel_help to display the help index`
    );
    
    const customOutputs = Outputs.create([textOutput]);
    this.emulatorState = EmulatorState.create({
      outputs: customOutputs,
      commandMapping: customCommandMapping
    });
  }

  runCommand(command, kernelNumber) {
    axios
      .get(`/api/commands/${command}/${localStorage.coockie}`)
      .then((data) => {
        this.commandsData = data.data.commands;
      })
      .catch((err) => {
        console.log(err);
      });
      return '' + kernelNumber;
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
        <div className="terminal-alert-image-container"><img src="./public/terminal-alert.png"></img></div>
        <ReactTerminal
          outputRenderers={{
            ...ReactOutputRenderers,
            [PAPER_TYPE]: PaperOutput
          }}
          promptSymbol='C:\Users\genesis>‍'
          emulatorState={this.emulatorState}
        />
      </div>
    );
  }
}

export default KernelTerminal;
