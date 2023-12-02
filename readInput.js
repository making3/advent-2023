const fs = require('fs');
const path = require('path');

function readInput(day, shouldUseSample = false) {
    const inputPath = path.resolve(
        __dirname,
        day,
        shouldUseSample ? 'SAMPLE' : 'INPUT'
    );
    return fs.readFileSync(inputPath, 'utf-8');
}
exports.readInput = readInput;

exports.readInputArray = (day, shouldUseSample = false) => {
    return readInput(day, shouldUseSample).split(/[\r\n]/);
};
