
import StateManager from '../states-manager/services/state-manager';

class CommandsService {
  private commandsInstance;
  private stateManager = StateManager.getInstance();

  initialize() {
    if (this.commandsInstance) {
      throw new Error('commandsInstance is already initilized');
    }

    this.commandsInstance = {};
  }

  runCommand(req, res) {
    const command = req.params.command;
    const userUniqueness = req.params.user_uniqueness;
    const result = this.stateManager.handleCommand(command);
    if(result) {
      // this.commandsInstance[command] = {userUniqueness: userUniqueness};
    }
    res.json({ commands: this.commandsInstance })
  }

  getCommands(req, res) {
    res.json({ commands: this.commandsInstance })
  }

  resetCommandsInstance() {
    this.commandsInstance = {};
  }
}

export const commandService = new CommandsService();
export default commandService;
