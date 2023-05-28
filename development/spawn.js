const path = require('path');
const { spawn } = require('child_process');

module.exports = function spawnCommand(command, config, eventArgs) {
  let stdio = ['pipe', 'pipe', 'pipe'];

  if (config.options.stdout) {
    stdio = ['pipe', process.stdout, process.stderr];
  }

  const env = { ...process.env, FILENAME: eventArgs[0] };

  const sh = 'sh';
  const shFlag = '-c';
  const spawnOptions = {
    env: { ...env, ...config.env },
    stdio,
  };

  command = [command].flat();

  const args = command.join(' ');
  const child = spawn(sh, [shFlag, args], spawnOptions);

  if (config.required) {
    const emit = {
      stdout(data) {
        bus.emit('stdout', data);
      },
      stderr(data) {
        bus.emit('stderr', data);
      },
    };

    // now work out what to bind to...
    if (config.options.stdout) {
      child.on('stdout', emit.stdout).on('stderr', emit.stderr);
    } else {
      child.stdout.on('data', emit.stdout);
      child.stderr.on('data', emit.stderr);

      bus.stdout = child.stdout;
      bus.stderr = child.stderr;
    }
  }
};
