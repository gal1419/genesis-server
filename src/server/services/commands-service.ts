
class CommandsService {
  private commandsInstance;

  initialize() {
    if (this.commandsInstance) {
      throw new Error('commandsInstance is already initilized');
    }

    this.commandsInstance = {};
  }

  runCommand(req, res) {
    const command = req.params.command;
    const userUniqueness = req.params.user_uniqueness;
    this.commandsInstance[command] = {userUniqueness: userUniqueness};
    res.json({ commands: this.commandsInstance })
  }

  getCommands(req, res) {
    res.json({ commands: this.commandsInstance })
  }
}

export const commandService = new CommandsService();
export default commandService;
