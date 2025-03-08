#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';

import { toValeAST } from './lib.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the version from package.json
const packageJsonPath = path.join(__dirname, '../package.json');
const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const program = new Command();

program
    .version(version)
    .description('CLI to convert MDX to HTML while preserving JSX and expressions.')
    .argument('[file]', 'path to the MDX file to read')
    .action((file) => {
        if (file) {
            if (fs.existsSync(file) && fs.statSync(file).isFile()) {
                fs.readFile(file, 'utf8', (err, doc) => {
                    if (err) {
                        console.error("Error reading the file:", err.message);
                        process.exit(1);
                    }
                    console.log(toValeAST(doc));
                });
            } else {
                console.error('File does not exist or the path is incorrect.');
                process.exit(1);
            }
        } else {
            let input = '';
            process.stdin.setEncoding('utf8');
            process.stdin.on('data', (chunk) => {
                input += chunk;
            });
            process.stdin.on('end', () => {
                console.log(toValeAST(input));
            });
        }
    });

program.parse(process.argv);
