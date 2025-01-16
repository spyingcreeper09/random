export class CommandCore {
  private commands: string[];
  private coreSize: int;

  constructor (bot: Bot, coreName: string, coreColor: string, SlowMode?: boolean) {
    this.commands = [];
    this.coreSize = (Math.abs(this.toxyz.x - this.xyz.x) + 1) * (Math.abs(this.toxyz.y - this.xyz.y) + 1) * (Math.abs(this.toxyz.z - this.xyz.z) + 1);
  }

  async execute(): Promise<void> {
    const commandsToExecute: string[] = this.commands.splice(0, this.coreSize) // get enough commands to fill the entire core once
    while (commandsToExecute.length > 0) { // iterate through all commands so they can be sent in the same tick (they should be sent in the same tick that is)
        this.client.write("update_command_block", {
            location: this.useBlockxyz,
            command: command.slice(0, 32768),
            mode: 1,
            flags: 0x04 | 0x01
        });
        const coords = indexToCoords(this.i++, this.xyz, this.toxyz);
        this.useBlockxyz = coords;
    }
    await sleep(75); // delay of 75 ms instead of one tick is because if you run this twice within the same tick then you will loose all commands in the previous tick
    if(this.commands.length > 0) this.execute(); // if there are more commands go back through and run them
  }

  async run(command: string | string[]): Promise<void> { // This can be bypassed by simply not awaiting the run command. This isn't the issue.
    if (typeof command === 'string') {
        this.commands.push(command);
        this.execute(); // run the commands because one was added
        return;
    } else if (Array.isArray(command)) {
        this.commands.push.apply(this.commands, command); // this is so you can also use an array instead of just string. Probably useless but i had it in my bot so i just made it here as well
        this.execute(); // run the commands because one was added
        return;
    } else {
        console.log(`Invalid input recieved for run. Expected string or array. Got ${typeof command}`); // error things
        return;
    }
    await sleep(50)
    return;
  }
}
