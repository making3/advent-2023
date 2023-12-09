function isValidSeed(seedNum, seeds) {
    for (let i = 0; i < seeds.length; i += 2) {
        const seedStart = seeds[i];
        const seedRange = seeds[i + 1];

        if (seedNum > seedStart) {
            const diff = seedNum - seedStart;
            if (diff <= seedRange) {
                return true;
            }
        }
    }

    return false;
}

// Seed 79, soil 81, fertilizer 81, water 81, light 74, temperature 78, humidity 78, location 82.
//      82 -> 78 -> 74 -> 81 -> 81 -> 81 -> 79

// Seed 14, soil 14, fertilizer 53, water 49, light 42, temperature 42, humidity 43, location 43.
// Seed 55, soil 57, fertilizer 57, water 53, light 46, temperature 82, humidity 82, location 86.
// Seed 13, soil 13, fertilizer 52, water 41, light 34, temperature 34, humidity 35, location 35.
function getSeedFromLocation(location, arrays) {
    let curr = location;

    for (let i = arrays.length - 1; i >= 0; i--) {
        const mappedEntry = arrays[i].find(([, dest]) => curr >= dest);
        if (mappedEntry) {
            const [src, dest, len] = mappedEntry;
            const dist = curr - dest;
            if (dist <= len) {
                curr = src + dist;
            }
        }
    }

    return curr;
}

exports.run = (logAnswer, [seeds, arrays]) => {
    const results = seeds.map((seed) => {
        let i = seed;

        for (const arr of arrays) {
            const f = arr.find(([src]) => i >= src);
            if (f) {
                const [src, dest, len] = f;
                const dist = i - src;
                if (dist <= len) {
                    i = dest + dist;
                }
            }
        }
        return i;
    });

    logAnswer(Math.min(...results));

    let i = 0;
    let isValid = false;
    // console.time('total');
    do {
        // console.time(`i ${i}`);
        const seedNum = getSeedFromLocation(i, arrays);
        // console.timeEnd(`i ${i}`);

        // console.time('isValid');
        isValid = isValidSeed(seedNum, seeds); // the slow part?!
        // console.timeEnd('isValid');
        // console.log('loc', i, isValid);
        // console.log('');
        if (!isValid) {
            i = i + 1;
        }
    } while (!isValid);

    console.timeEnd('total'); // 0.623ms sample
    logAnswer(i);
};

exports.getInput = (readInput) => {
    const [seedLine, ...lines] = readInput(true);

    const seeds = seedLine
        .split(':')
        .map((s) => s.trim())
        .filter(Boolean)[1]
        .split(' ')
        .map((s) => Number(s));

    const maps = [];
    let current = null;
    lines.forEach((line) => {
        if (!line) {
            if (current) {
                current.sort((a, b) => b[1] - a[1]);
            }
            current = null;
            return;
        }

        // The first line has a destination range start of 50,
        //  a source range start of 98, and a range length of 2
        if (/[A-Za-z]/.test(line[0])) {
            current = [];
            maps.push(current);
        } else if (current) {
            const [dest, source, len] = line.split(' ').map((n) => Number(n));

            current.push([source, dest, len]);
        }
    });
    current.sort((a, b) => b[0] - a[0]);

    return [seeds, maps];
};

exports.sampleAnswers = [35, 46];
