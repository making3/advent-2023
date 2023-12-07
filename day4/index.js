exports.run = (logAnswer, cards) => {
    let total = 0;

    function getPointsForCard([a, winningNumbers, myNumbers]) {
        const won = myNumbers.filter((n) => winningNumbers.has(n));
        if (won.length === 1) {
            return 1;
        }
        if (won.length === 2) {
            return 2;
        }
        return Math.pow(won.length - 1, 2) - 1;
    }

    for (const card of cards) {
        total = total + getPointsForCard(card);
    }
    logAnswer(total);

    total = 0;
    const cardPoints = new Map();
    const cardReferenceMap = cards.reduce((acc, c) => {
        acc.set(c[0], c);
        return acc;
    }, new Map());

    function getTotalPointsForGivenCard(card) {
        if (!card) {
            return 0;
        }
        const [cardNumber, winning, myNumbers] = card;
        if (!cardPoints.get(cardNumber)) {
            const points = myNumbers.filter((n) => winning.has(n)).length;
            let accumulated = 0;
            for (let i = 0; i < points; i++) {
                accumulated += getTotalPointsForGivenCard(
                    cardReferenceMap.get(cardNumber + i + 1)
                );
            }
            cardPoints.set(cardNumber, points + accumulated);
        }

        return cardPoints.get(cardNumber);
    }

    total = cards.length;
    for (const card of cards) {
        total += getTotalPointsForGivenCard(card);
    }
    logAnswer(total);
};

exports.getInput = (readInput) => {
    return readInput(true).map((c) => {
        const [cardName, numbers] = c.split(':');

        const [, cardNumber] = cardName
            .split(' ')
            .map((o) => o.trim())
            .filter(Boolean);
        const [winningNumbers, myNumbers] = numbers.split('|').map((n, i) => {
            if (i === 0) {
                return new Set(
                    n
                        .split(' ')
                        .map((o) => Number(o))
                        .filter(Boolean)
                );
            }
            return n
                .split(' ')
                .map((o) => Number(o))
                .filter(Boolean);
        });
        return [Number(cardNumber.trim()), winningNumbers, myNumbers];
    });
};

exports.sampleAnswers = [13, 30];
