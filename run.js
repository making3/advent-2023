const chalk = require('chalk');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { readInputArray, readInput } = require('./readInput');

const argv = yargs(hideBin(process.argv))
    .usage(
        '$0 <day> <part>',
        'Runs advent of code puzzles',
        (yargs) => {
            yargs
                .positional('day', {
                    describe: 'the day to run',
                    type: 'number',
                })
                .positional('part', {
                    describe: 'the part of the puzzle to filter by',
                    type: 'number',
                });
        },
        (argv) => {
            argv.day = `day${argv.day}`;
            if (argv.part) {
                console.log(`Running ${argv.day} and part ${argv.part} \n`);
            }
            console.log(`Running ${argv.day}\n`);
        }
    )
    .option('s', {
        alias: 'sample',
        default: false,
        describe: 'runs the sample input',
        type: 'boolean',
    })
    .version(false)
    .example('$0 5', 'run day 5 normally')
    .example('$0 5 2', 'run day 5 and part 2 only ')
    .example('$0 5 --sample', 'run day 5 using sample data and answers').argv;

const { day, part, sample } = argv;
const { getInput, run, sampleAnswers } = require(`./${day}`);
const input = getInput((isArray) => {
    if (isArray) {
        return readInputArray(day, sample);
    }

    return readInput(day, sample);
});

let callCount = 0;
function logAnswer(answer) {
    callCount++;

    if (!part || callCount === part) {
        let chalkWrapper =
            sample && sampleAnswers[callCount - 1]
                ? sampleAnswers[callCount - 1] === answer
                    ? chalk.green
                    : chalk.red
                : chalk.white;
        console.log(chalkWrapper(`Part ${callCount}: ${answer}`));
    }
}

run(logAnswer, input);
console.log('');
