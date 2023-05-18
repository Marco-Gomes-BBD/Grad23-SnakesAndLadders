let dice = document.querySelector('.dice');
const rollBtn = document.querySelector('#roll-btn');

const prng = new Math.seedrandom('Hello');
const rollDistribution = [0, 0, 0, 0, 0, 0];

const randomRoll = () => {
    const random = getRandomInt(prng, 1, 7);
    rollDistribution[random - 1] += 1;
    return random;
};

const animateDie = (random) => {
    dice = document.querySelector('.dice');
    dice.style.animation = 'rolling 4s';
    const dieRotations = {
        1: 'rotateX(0deg) rotateY(0deg)',
        2: 'rotateX(-90deg) rotateY(0deg)',
        3: 'rotateX(0deg) rotateY(90deg)',
        4: 'rotateX(0deg) rotateY(-90deg)',
        5: 'rotateX(90deg) rotateY(0deg)',
        6: 'rotateX(180deg) rotateY(0deg)',
    };

    setTimeout(() => {
        dice.style.transform = dieRotations[random];
        dice.style.animation = 'none';
    }, 4050);
};

const rollDie = () => {
    const random = randomRoll();
    animateDie(random);
};

rollBtn.addEventListener('click', rollDie);
