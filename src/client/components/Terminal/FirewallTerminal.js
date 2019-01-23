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

const firewallHelpFunction = (state, opts) => {
  return {
    output: createPaperRecord(['resume_firewall - to recover any problem in the firewall system', 'restart_firewall - to restart the firewall system', 'shutdown_firewall - to shut down the firewall system'])
  };
}

class FirewallTerminal extends Component {
  commandsData
  constructor(props) {
    super(props);
    localStorage.coockie = localStorage.coockie ? localStorage.coockie : Math.random().toString(36).slice(2);
    this.getCommands();
    this.state = {};
    const customCommandMapping = CommandMapping.create({
      ...defaultCommandMapping,
      firewall_help: {
        function: firewallHelpFunction,
        optDef: {}
      },
      Firewall_help: {
        function: firewallHelpFunction,
        optDef: {}
      },
      resume_firewall: {
        function: disabledCommandFunction,
        optDef: {}
      },
      Resume_firewall: {
        function: disabledCommandFunction,
        optDef: {}
      },
      restart_firewall: {
        function: disabledCommandFunction,
        optDef: {}
      },
      Restart_firewall: {
        function: disabledCommandFunction,
        optDef: {}
      },
      shutdown_firewall: {
        function: (state, opts) => {
          if(this.commandsData.shutdown_firewall) {
            return {
              output: createPaperRecord(['No need to shut down the firewall again, move on to other systems'])
            };
          }
          var elem = document.getElementsByClassName('terminalInput');
          elem[0].style.display = 'none';
          this.runCommand('shutdown_firewall');
          return {
            output: createPaperRecord(['loading'])
          };
        },
        optDef: {}
      },
      Shutdown_firewall: {
        function: (state, opts) => {
          if(this.commandsData.shutdown_firewall) {
            return {
              output: createPaperRecord(['No need to shut down the firewall again, move on to other systems'])
            };
          }
          var elem = document.getElementsByClassName('terminalInput');
          elem[0].style.display = 'none';
          this.runCommand('shutdown_firewall');
          return {
            output: createPaperRecord(['loading'])
          };
        },
        optDef: {}
      },
    });
    const textOutput = OutputFactory.makeTextOutput(
      `run firewall_help to display the help index`
    );
    
    const customOutputs = Outputs.create([textOutput]);
    this.emulatorState = EmulatorState.create({
      outputs: customOutputs,
      commandMapping: customCommandMapping
    });
  }

  runCommand(command, firewallNumber) {
    axios
      .get(`/api/commands/${command}/${localStorage.coockie}`)
      .then((data) => {
        this.commandsData = data.data.commands;
      })
      .catch((err) => {
        console.log(err);
      });
      return '' + firewallNumber;
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

export default FirewallTerminal;
