function isNumChar(c) {
    return /\d/.test(c);
}

function isSymbol(c) {
    return c && /[^\.\d]/.test(c);
}

function isGear(c) {
    return /\*/.test(c);
}

function charHasSymbolNear(input, x, y) {
    const combos = [
        [x, y + 1],
        [x, y - 1],
        [x + 1, y],
        [x - 1, y],
        [x + 1, y - 1],
        [x + 1, y + 1],
        [x - 1, y - 1],
        [x - 1, y + 1],
    ];
    /*
        0xxx0
        0x5x0
        0xxx0
    */
    return combos.some(([cx, cy]) => isSymbol(input?.[cx]?.[cy]));
}

function getNumberAt(input, x, y, numMap) {
    if (!isNumChar(input[x]?.[y])) {
        return null;
    }

    let start = y;
    let end = y;
    while (isNumChar(input[x]?.[start - 1])) {
        start--;
    }

    while (isNumChar(input[x]?.[end])) {
        end++;
    }

    const result = input[x].slice(start, end);
    if (result?.length) {
        const n = Number(result.join(''));
        if (!numMap.get(start)) {
            numMap.set(start, new Set());
        }

        const numSet = numMap.get(start);
        if (numSet.has(end)) {
            return null;
        }
        numSet.add(end);

        return n;
    }

    return null;
}

// Careful of:
/*
      ..53.53..
      ....*....
      .........
*/
function getNumbersNext(input, x, y) {
    const numMap = new Map();
    const combos = [
        [x, y + 1],
        [x, y - 1],
        [x + 1, y],
        [x - 1, y],
        [x + 1, y - 1],
        [x + 1, y + 1],
        [x - 1, y - 1],
        [x - 1, y + 1],
    ];

    const nums = [];
    for (const [cx, cy] of combos) {
        if (!numMap.has(cx)) {
            numMap.set(cx, new Map());
        }
        const n = getNumberAt(input, cx, cy, numMap.get(cx));
        if (n) {
            nums.push(n);
        }
    }
    return nums;
}

exports.run = (logAnswer, input) => {
    let currentHasSymbolNear = false;
    let currentNumber = '';
    let total = 0;

    for (let x = 0; x < input.length; x++) {
        for (let y = 0; y < input[x].length; y++) {
            const c = input[x][y];

            if (isNumChar(c)) {
                currentNumber += c;

                if (!currentHasSymbolNear) {
                    currentHasSymbolNear = charHasSymbolNear(input, x, y);
                }
            } else {
                if (currentHasSymbolNear && currentNumber.length) {
                    total += Number(currentNumber);
                }
                currentHasSymbolNear = false;
                currentNumber = '';
            }
        }

        if (currentHasSymbolNear && currentNumber.length) {
            total += Number(currentNumber);
        }
        currentHasSymbolNear = false;
        currentNumber = '';
    }

    if (currentHasSymbolNear && currentNumber.length) {
        total += Number(currentNumber);
    }
    currentHasSymbolNear = false;
    currentNumber = '';

    logAnswer(total);

    total = 0;
    for (let x = 0; x < input.length; x++) {
        for (let y = 0; y < input[x].length; y++) {
            const c = input[x][y];
            if (!isGear(c)) {
                continue;
            }

            const nums = getNumbersNext(input, x, y);
            if (nums.length === 2) {
                total += nums[0] * nums[1];
            }
        }
    }

    // 6721056 = too low :(
    // 37519793 = too low too lmao
    // 73083448 = STILL TOO LOW
    logAnswer(total);
};

exports.getInput = (readInput) => {
    return readInput(true).map((line) => line.split(''));
};

exports.sampleAnswers = [4361, 467835];
