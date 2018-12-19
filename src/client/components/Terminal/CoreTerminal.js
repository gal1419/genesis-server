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
    output: createPaperRecord(['the profesor disabled this command'])
  };
}

const coreHelpFunction = (state, opts) => {
  return {
    output: createPaperRecord(['resume_core - to recover any problem in the core system', 'restart_core - to restart the core system', 'shutdown_core - to shutdown core system'])
  };
}

class CoreTerminal extends Component {
  commandsData
  constructor(props) {
    super(props);
    localStorage.coockie = localStorage.coockie ? localStorage.coockie : Math.random().toString(36).slice(2);
    this.getCommands();
    this.state = {};
    const customCommandMapping = CommandMapping.create({
      ...defaultCommandMapping,
      core_help: {
        function: coreHelpFunction,
        optDef: {}
      },
      Core_help: {
        function: coreHelpFunction,
        optDef: {}
      },
      resume_core: {
        function: disabledCommandFunction,
        optDef: {}
      },
      Resume_core: {
        function: disabledCommandFunction,
        optDef: {}
      },
      restart_core: {
        function: disabledCommandFunction,
        optDef: {}
      },
      Restart_core: {
        function: disabledCommandFunction,
        optDef: {}
      },
      shutdown_core: {
        function: (state, opts) => {
          if(this.commandsData.shutdown_core) {
            return {
              output: createPaperRecord(['no need to shutdown the core again, move on to other systems'])
            };
          }
          var elem = document.getElementsByClassName('terminalInput');
          elem[0].style.display = 'none';
          this.runCommand('shutdown_core');
          return {
            output: createPaperRecord(['loading'])
          };
        },
        optDef: {}
      },
      Shutdown_core: {
        function: (state, opts) => {
          if(this.commandsData.shutdown_core) {
            return {
              output: createPaperRecord(['no need to shutdown the core again, move on to other systems'])
            };
          }
          var elem = document.getElementsByClassName('terminalInput');
          elem[0].style.display = 'none';
          this.runCommand('shutdown_core');
          return {
            output: createPaperRecord(['loading'])
          };
        },
        optDef: {}
      },
    });
    const textOutput = OutputFactory.makeTextOutput(
      `run core_help to display the help index`
    );
    
    const customOutputs = Outputs.create([textOutput]);
    this.emulatorState = EmulatorState.create({
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

export default CoreTerminal;
