#!/usr/bin/env node
// ShipWatch - One-hand CLI for supply chain monitoring

const { renderDashboard, renderDisruption, renderRoutes, renderPackages, renderHelp } = require('./renderer.js');

const args = process.argv.slice(2);
const command = args[0] || 'dashboard';

// Non-interactive mode (single command)
switch (command) {
  case 'dashboard':
  case 'd':
    console.log(renderDashboard());
    break;
  case 'routes':
  case 'r':
    console.log(renderRoutes());
    break;
  case 'track':
  case 't':
    console.log(renderPackages());
    break;
  case 'help':
  case '?':
    console.log(renderHelp());
    break;
  case '1': case '2': case '3': case '4': case '5':
    console.log(renderDisruption(parseInt(command) - 1));
    break;
  case 'interactive':
  case 'i':
    startInteractive();
    break;
  default:
    console.log(renderDashboard());
    console.log('\nUsage: shipwatch [d|r|t|1-5|?|i]');
    break;
}

function startInteractive() {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  process.stdout.write('\x1b[2J\x1b[H'); // Clear screen
  console.log(renderDashboard());

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  process.stdin.on('data', function(key) {
    process.stdout.write('\x1b[2J\x1b[H'); // Clear screen

    switch (key) {
      case 'd':
        console.log(renderDashboard());
        break;
      case 'r':
        console.log(renderRoutes());
        break;
      case 't':
        console.log(renderPackages());
        break;
      case '?':
        console.log(renderHelp());
        break;
      case '1': case '2': case '3': case '4': case '5':
        console.log(renderDisruption(parseInt(key) - 1));
        break;
      case 'q':
      case '\u0003': // Ctrl+C
        process.stdout.write('\x1b[2J\x1b[H');
        console.log('ShipWatch closed. Stay safe out there. 🚢');
        process.exit(0);
        break;
      default:
        console.log(renderDashboard());
        break;
    }
  });
}
