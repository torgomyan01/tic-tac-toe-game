const {GameRowCol, div, gameBody: gameBody1, gameRow, key, keyCol, x, o, noVictory} = {
    gameBody: 'game-body',
    gameRow: 'game-row',
    GameRowCol: 'game-row-col',
    key: 'key_',
    keyCol: 'key_col',
    div: 'div',
    o: 'o',
    x: 'x',
    noVictory: 'noVictory'
}
const gameBody = document.getElementsByClassName(gameBody1);

let Matrix = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];

const victory = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
]

function victoryGame() {
    for (let i = 0; i < victory.length; i++) {
        const victoryNum = [];
        victory[i].map((_vcNumber) => {
            const row = _vcNumber[0];
            const col = _vcNumber[1];
            Matrix[row][col] === x && victoryNum.push(x);
            Matrix[row][col] === o && victoryNum.push(o);
        })
        if (victoryNum[0] === x && victoryNum[1] === x && victoryNum[2] === x) {
            gameOver(x);
            break;
        }
        if (victoryNum[0] === o && victoryNum[1] === o && victoryNum[2] === o) {
            gameOver(o);
            break;
        }
    }

    let rowNum = 0;
    Matrix.map((row, index) => {
        const rowTme = row.reduce((total, _rwo) => {
            return _rwo === x || _rwo === o ? total + 1 : total;
        }, 0);
        rowNum += rowTme;
        index === Matrix.length - 1 && rowNum === 9 && gameOver(noVictory)
    })
}

function gameOver(playBoy) {
    Matrix = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ];
    alert('Game Over ' + playBoy);
    PlusPlayerVictory(playBoy);
    updateMatrix(startGame);
}

updateMatrix(startGame);

function startGame() {
    const gameRowCol = document.querySelectorAll(`.${GameRowCol}`);
    let gaming = true;
    gameRowCol.forEach((col) => {
        col.addEventListener('click', (e) => {
            if (!gaming) return;
            const parentIndex = Number(e.target.parentNode.id.replace(key, ''));
            const thisIndex = Number(e.target.id.replace(keyCol, ''));
            if (Matrix[parentIndex][thisIndex] !== '') return;

            Matrix[parentIndex][thisIndex] = x;
            e.target.innerText = x;
            gaming = false;
            setTimeout(() => {
                const thisVictory = [];
                victory.map((_vc) => {
                    let victoryRating = 0;
                    const victoryGame = [];
                    _vc.map((rowCol) => {
                        const row = rowCol[0];
                        const col = rowCol[1];
                        switch (Matrix[row][col]) {
                            case x:
                                victoryGame.push(x);
                                victoryRating += 1;
                                break;
                            case o:
                                victoryGame.push(o);
                                break;
                            default:
                                victoryGame.push('');
                        }
                    })
                    thisVictory.push({
                        vc: _vc,
                        victoryGame: victoryGame,
                        rating: victoryRating
                    })
                })

                const maxStatusRating = thisVictory.filter((rating) => rating.rating === 2);
                const minStatusRating = thisVictory.filter((rating) => rating.rating === 1);

                const topRating = maxStatusRating.find((TopRt) => TopRt.victoryGame.some((_vg) => _vg === ''));
                const randomStep = minStatusRating.find((TopRt) => TopRt.victoryGame.some((_vg) => _vg === ''));

                maxStatusRating.length > 0 ?
                    topRating ? goToSentLogic(topRating) : goToSentLogic(randomStep)
                    : goToSentLogic(randomStep);

                victoryGame();
                updateMatrix(startGame);
                gaming = true;
            }, 1000)

        })
    })
}


function goToSentLogic(randomStep) {
    if (randomStep) {
        for (let i = 0; i < randomStep.victoryGame.length; i++) {
            if (randomStep.victoryGame[i] === '') {
                const newStepPosition = randomStep.vc[i];
                Matrix[newStepPosition[0]][newStepPosition[1]] = o;
                break;
            }
        }
    } else {

    }
}

function updateMatrix(res) {
    gameBody.item(0).innerHTML = '';
    Matrix.map((row, index) => {
        const _elem = document.createElement(div);
        _elem.classList.add(gameRow);
        _elem.id = `${key}${index}`;
        row.map((col, index) => {
            const _colElem = document.createElement(div);
            _colElem.classList.add(GameRowCol);
            _colElem.innerText = col;
            _colElem.id = `${keyCol}${index}`;
            _elem.append(_colElem);
        })
        gameBody.item(0).append(_elem);
    })
    res && res();
}

function PlusPlayerVictory(player){
    const playerDom = document.getElementById(`player-${player}`);
    if(player !== noVictory) playerDom.innerText = Number(playerDom.innerText) + 1;
}





