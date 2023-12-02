const nums = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
];

exports.run = (logAnswer, input) => {
    let total = 0;

    for (const line of input) {
        let first = null;
        let second = null;

        let k = 0;

        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (/\d/.test(c)) {
                if (!first) {
                    first = c;
                }
                second = c;
                continue;
            }

            if (i < 2) {
                continue;
            }

            k = i - 5;
            if (k < 0) {
                k = 0;
            }
            let word = line.substring(k, i + 1);
            for (k; k <= i; k++) {
                const ii = nums.indexOf(word);

                if (ii > -1) {
                    if (!first) {
                        first = `${ii + 1}`;
                    }
                    second = `${ii + 1}`;
                }
                word = line.substring(k, i + 1);
            }
        }

        total += Number(first + second);
    }
    logAnswer(total);
    logAnswer(total);
};

//combining the first digit and the last digit (in that order) to form a single two-digit number.
//the calibration values of these four lines are 12, 38, 15, and 77. Adding these together produces 142.
// part 2
//In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76.
// Adding these together produces 281.

exports.getInput = (readInput) => {
    return readInput(true);
};

exports.sampleAnswers = [142, 281];
