const {GameRowCol, div, gameBody: gameBody1, gameRow, key, keyCol, x, o, noVictory, playGameID} = {
    gameBody: 'game-body',
    gameRow: 'game-row',
    GameRowCol: 'game-row-col',
    key: 'key_',
    keyCol: 'key_col',
    div: 'div',
    o: 'o',
    x: 'x',
    noVictory: 'noVictory',
    playGameID: 'play-game',
}


const playGame = document.getElementById(playGameID);

playGame.addEventListener('submit', function (e){
    e.preventDefault();
    const val = +e.target?.children?.rowCol?.value;
    if(!isNaN(val)){
        createMatrix(val);
    } else {
        alert('please write number');
    }
})


function createMatrix(countRowCol){
    const matrix = [];
    const rowCol = countRowCol;
    for(let i = 0; i < rowCol; i++){
        matrix.push([]);
        for(let j = 0; j < rowCol; j++){
            matrix[i].push('');
        }
    }

    // CREATE HORIZONTAL VICTORY
    const vic = [];
    matrix.forEach((row, index) => {
        const _vic = [];
        row.forEach((col, colIndex) => {
            _vic.push([index, colIndex]);
        })
        vic.push(_vic);
    })


    matrix.forEach((row, index) => {
        const verticalVic = [];
        matrix.forEach((row2, index2) => {
            verticalVic.push([index2, index]);
        })
        vic.push(verticalVic);
    })


    const _vtLeftToRight = [];
    matrix.forEach((row, index) => {
        _vtLeftToRight.push([index, index]);
    })
    vic.push(_vtLeftToRight);



    let count = rowCol - 1;
    const _vtRightToLeft = [];
    matrix.forEach((row, index) => {
        _vtRightToLeft.push([index, count]);
        count--;
    })
    vic.push(_vtRightToLeft);

    const newMatrix = [...matrix];
    startGaming(matrix, vic, newMatrix);
}


function startGaming(_matrix, vic, newMatrix){
    const gameBody = document.getElementsByClassName(gameBody1);
    let Matrix = [..._matrix];
    const victory = vic;

    function victoryGame() {
        for (let i = 0; i < victory.length; i++) {
            const victoryNum = [];
            victory[i].forEach((_vcNumber) => {
                const row = _vcNumber[0];
                const col = _vcNumber[1];
                if(Matrix[row][col] === x){
                    victoryNum.push(x);
                }
                if(Matrix[row][col] === o){
                    victoryNum.push(o);
                }
            })


            const resX = victoryNum.filter((item) => item === x);
            if(resX.length === Matrix.length){
                gameOver(x);
                break;
            }
            const resO = victoryNum.filter((item) => item === o);
            if(resO.length === Matrix.length){
                gameOver(o);
                break;
            }


        }

        let rowNum = 0;
        Matrix.forEach((row, index) => {
            const rowTme = row.reduce((total, _rwo) => {
                return _rwo === x || _rwo === o ? total + 1 : total;
            }, 0);
            rowNum += rowTme;
            index === Matrix.length - 1 && rowNum === 9 && gameOver(noVictory)
        })
    }

    function gameOver(playBoy) {
        Matrix = newMatrix;
        alert('Game Over ' + playBoy);
        PlusPlayerVictory(playBoy);
        updateMatrix(startGame);
        console.log(Matrix, newMatrix)
    }

    updateMatrix(startGame);

    function startGame() {
        const gameRowCol = document.querySelectorAll(`.${GameRowCol}`);
        let gaming = true;
        gameRowCol.forEach((col) => {
            col.addEventListener('click', (e) => {
                if (!gaming) return;
                const parentIndex = +e.target.parentNode.id.replace(key, '');
                const thisIndex = +e.target.id.replace(keyCol, '');
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


                    if(maxStatusRating.length > 0){
                        if(topRating){
                            goToSentLogic(topRating)
                        } else {
                            goToSentLogic(randomStep)
                        }
                    } else {
                        goToSentLogic(randomStep)
                    }

                    // maxStatusRating.length > 0 ?
                    //     topRating ? goToSentLogic(topRating) : goToSentLogic(randomStep)
                    //     : goToSentLogic(randomStep);

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
        }
    }

    function updateMatrix(res) {
        gameBody.item(0).innerHTML = '';
        const width = 100 * Matrix[0].length;
        Matrix.forEach((row, index) => {
            const _elem = document.createElement(div);
            _elem.classList.add(gameRow);
            _elem.id = `${key}${index}`;
            _elem.style.height = `calc(100% / ${row.length})`;
            row.forEach((col, index) => {
                const _colElem = document.createElement(div);
                _colElem.classList.add(GameRowCol);
                _colElem.innerText = col;
                _colElem.id = `${keyCol}${index}`;
                _colElem.style.width = `calc(100% / ${row.length})`;
                _elem.append(_colElem);
            })
            gameBody.item(0).append(_elem);
        })
        gameBody.item(0).style.width =  `${width}px`;
        gameBody.item(0).style.height =  `${width}px`;
        res && res();
    }

    function PlusPlayerVictory(player){
        const playerDom = document.getElementById(`player-${player}`);
        if(player !== noVictory) playerDom.innerText = +playerDom.innerText + 1;
    }

}




