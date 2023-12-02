const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const compileTemplate = require('lodash/template');

const argv = yargs(hideBin(process.argv))
    .usage(
        '$0 <day>',
        'Creates a new advent of code puzzle entry (script, input, sample files)',
        (yargs) => {
            yargs.positional('day', {
                describe: 'the day to run',
                type: 'number',
            });
        },
        (argv) => {
            argv.day = `day${argv.day}`;
            console.log(`Running ${argv.day}\n`);
        }
    )
    .option('array', {
        default: false,
        describe: 'if true, reads data as an array',
        type: 'boolean',
    })
    .version(false)
    .example('$0 5', 'create day 5')
    .example(
        '$0 5 --array',
        'create day 5 and read the input as an array'
    ).argv;

const { day, array } = argv;

const dayDirpath = path.join(__dirname, day);
fs.mkdirSync(dayDirpath);

fs.writeFileSync(path.join(dayDirpath, 'SAMPLE'), '', 'utf-8');
fs.writeFileSync(path.join(dayDirpath, 'INPUT'), '', 'utf-8');

const dayTemplate = fs.readFileSync(path.join(__dirname, 'template'));
const compiled = compileTemplate(dayTemplate);
fs.writeFileSync(
    path.join(dayDirpath, 'index.js'),
    compiled({ isArray: array }),
    'utf-8'
);

console.log(chalk.green(`Created day ${day} at ${dayDirpath}`));
