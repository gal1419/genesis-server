class LogsService {
  logsQueue: string[] = [];

  handleLog(log: string) {
    this.logsQueue.push(log);
    console.log(log);
  }

  getNextLog(): string {
    const nextLog = this.logsQueue.shift();
    return nextLog;
  }
}

export const logsService = new LogsService();
export default logsService;
