// const yaml = require('js-yaml');
const { spawn } = require('child_process');
const nodemon = require('nodemon');
const fs = require('fs');
// const webpack = require('webpack');
const path = require('path');
const EventEmitter = require('events');

// const config = yaml.load(fs.readFileSync('./pnpm-workspaces.yaml', 'utf8'));

const conf = {
  dev: {
    dependencies: ['frontend', 'backend'],
  },
  frontend: {
    path: 'packages/app',
    dependencies: ['rpc', 'config'],
    script: 'dev',
    command: 'webpack',
  },
  backend: {
    path: 'packages/server',
    dependencies: ['repo', 'config'],
    command: 'nodemon',
    script: 'dev',
    args: { exec: 'ts-node', ext: 'js,ts', script: 'src/index.js' },
  },
  rpc: {
    path: 'packages/rpc',
    command: 'nodemon',
    script: 'build',
    args: { exec: 'tsc', ext: 'js,ts' },
  },
  repo: {
    path: 'packages/repo',
    command: 'nodemon',
    script: 'build',
    args: { exec: 'tsc', ext: 'js,ts' },
  },
  config: {
    path: 'config',
    command: 'nodemon',
    script: 'build',
    args: { exec: 'exit 0', ext: 'js,ts' },
  },
};

const events = new EventEmitter();
const dispatch = (event) => console.log(`${event.package}:${event.type}`, event) || events.emit(`${event.package}:${event.type}`, event);
const waitFor = (pkg, type) => new Promise((resolve) => console.log('once', `${pkg}:${type}`) || events.once(`${pkg}:${type}`, (event) => console.log('done') || resolve(event)));
const watch = (pkg, type, fn) => events.on(`${pkg}:${type}`, fn);

const run = async (pkg) => {
  console.log('run', pkg);
  if (conf[pkg].status === 'STARTED') return Promise.resolve();
  const pkgConfig = conf[pkg];
  conf[pkg].status = 'STARTED';

  console.log('Starting deps for', pkg);
  await Promise.all(pkgConfig?.dependencies?.map((dep) => run(dep)) || [Promise.resolve()]);
  pkgConfig?.dependencies?.map((dep) => watch(dep, 'exit', () => {
    dispatch({ type: 'restart', package: dep });
  }));

  console.log('Starting package', pkg);
  if (pkgConfig.command === 'nodemon') {
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(`${pkgConfig.path}/package.json`)));
    const script = packageJson.scripts[pkgConfig.script];
    const args = script ? script.split(' ') : ['echo'];
    const child = spawn('pnpm', ['exec', ...args], {
      cwd: path.resolve(pkgConfig.path),
    });
    child.stdout.on('data', (data) => process.stdout.write(`${pkg}: ${data.toString()}`));
    child.stderr.on('data', (data) => process.stderr.write(`${pkg}: ${data.toString()}`));
    child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      if (code === 0) {
        dispatch({ type: 'exit', package: pkg });
      }
    });

    // watch(pkg, 'restart', () => mon.emit('restart'));
    console.log('Waiting for', pkg, 'to exit');
    await waitFor(pkg, 'exit');
    console.log('Package', pkg, 'exited');
    // watch(pkg, 'exit', () => pmon.emit('restart'))
  }
};

const getReloadQueue = (pkg) => Object.keys(conf).filter((p) => conf[p]?.dependencies?.includes(pkg));

const getDependencies = (pkg) => conf[pkg]?.dependencies?.map((dep) => [...getDependencies(dep), dep]).flat() || [];
const getDependenciesUnique = (pkg) => [...new Set(getDependencies(pkg))];

const startup = () => {
  run('backend');
};

startup();
