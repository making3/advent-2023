const MAX_CUBES = {
    red: 12,
    green: 13,
    blue: 14,
};
exports.run = (logAnswer, games) => {
    const firstAnswer = games.reduce((acc, [gameNumber, sets]) => {
        const allWork = sets.every((s) => {
            for (const [color, maxValue] of Object.entries(MAX_CUBES)) {
                if (s[color] && s[color] > maxValue) {
                    return false;
                }
            }
            return true;
        });

        if (allWork) {
            acc += gameNumber;
        }
        return acc;
    }, 0);

    logAnswer(firstAnswer);

    const secondAnswer = games.reduce((acc, [, sets]) => {
        const min = sets // [{ r: g: b: }, { r: g: b: }]
            .reduce(
                (acc, s) => {
                    for (const color of Object.keys(s)) {
                        if (s[color] && s[color] > acc[color]) {
                            acc[color] = s[color];
                        }
                    }
                    return acc;
                },
                { red: 0, green: 0, blue: 0 }
            );
        return acc + min.red * min.blue * min.green;
    }, 0);

    logAnswer(secondAnswer);
};

// The Elf would first like to know which games would have been possible
//  if the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes ?

exports.getInput = (readInput) => {
    // 1 bag of red/green/cubes
    return readInput(true).map((gameLine) => {
        const [game, setsLine] = gameLine.split(':').map((a) => a.trim());

        const [, gameNumber] = game.split(' ');
        const sets = setsLine
            .split(';')
            .map((setLine) => {
                return setLine
                    .trim()
                    .split(',')
                    .reduce((set, cubePart) => {
                        const [cubes, cubeColor] = cubePart.trim().split(' ');
                        set[cubeColor] = Number(cubes);
                        return set;
                    }, {});
            })
            .filter(Boolean);
        return [Number(gameNumber), sets];
    });
};

exports.sampleAnswers = [8, 2286];

/*
Game 1: 
Min: 4 red, 2 green, and 6 blue cubes
    3 blue, 4 red
    1 red, 2 green, 6 blue
    2 green

Game 2: 
Min: 1 red, 3 green, and 4 blue cubes

    1 blue, 2 green
    3 green, 4 blue, 1 red
    1 green, 1 blue

*/
