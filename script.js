let spots = {
    1: '', 2: '', 3: '',
    4: '', 5: '', 6: '',
    7: '', 8: '', 9: ''
};
let turn = 0;
let aiChoice = 'O';
let userChoice = 'X';
let playing = true;

function makeMove(spot) {
    if (playing && spots[spot] === '') {
        spots[spot] = checkTurn(turn);
        document.getElementById('spot' + spot).innerText = spots[spot];
        turn++;
        if (checkForWin(spots)) {
            playing = false;
            document.getElementById('status').innerText = checkTurn(turn - 1) + ' Wins!';
        } else if (turn > 8) {
            playing = false;
            document.getElementById('status').innerText = 'No Winner!';
        } else {
            aiMove();
        }
    }
}

function checkTurn(turn) {
    return turn % 2 === 0 ? userChoice : aiChoice;
}

function checkForWin(spots) {
    const winningCombinations = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],
        [1, 4, 7], [2, 5, 8], [3, 6, 9],
        [1, 5, 9], [3, 5, 7]
    ];
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return spots[a] && spots[a] === spots[b] && spots[a] === spots[c];
    });
}

function aiMove() {
    if (!playing) return;

    // Check for immediate win or block opportunity
    let bestMove = findImmediateWinOrBlock();
    if (bestMove === -1) {
        let bestScore = -Infinity;

        for (let i = 1; i <= 9; i++) {
            if (spots[i] === '') {
                spots[i] = aiChoice;
                let score = minimax(spots, 0, false, -Infinity, Infinity);
                spots[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
    }

    if (bestMove) {
        spots[bestMove] = aiChoice;
        document.getElementById('spot' + bestMove).innerText = aiChoice;
        turn++;
        if (checkForWin(spots)) {
            playing = false;
            document.getElementById('status').innerText = aiChoice + ' Wins!';
        } else if (turn > 8) {
            playing = false;
            document.getElementById('status').innerText = 'No Winner!';
        }
    }
}

// Check for immediate win or block moves
function findImmediateWinOrBlock() {
    for (let combination of [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],
        [1, 4, 7], [2, 5, 8], [3, 6, 9],
        [1, 5, 9], [3, 5, 7]
    ]) {
        const [a, b, c] = combination;
        if (spots[a] === aiChoice && spots[a] === spots[b] && spots[c] === '') return c;
        if (spots[a] === aiChoice && spots[a] === spots[c] && spots[b] === '') return b;
        if (spots[b] === aiChoice && spots[b] === spots[c] && spots[a] === '') return a;
        if (spots[a] === userChoice && spots[a] === spots[b] && spots[c] === '') return c;
        if (spots[a] === userChoice && spots[a] === spots[c] && spots[b] === '') return b;
        if (spots[b] === userChoice && spots[b] === spots[c] && spots[a] === '') return a;
    }
    return -1;
}

// Minimax with Alpha-Beta Pruning
function minimax(spots, depth, isMaximizing, alpha, beta) {
    if (checkForWin(spots)) {
        return isMaximizing ? -1 : 1;
    }
    if (turn > 8) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 1; i <= 9; i++) {
            if (spots[i] === '') {
                spots[i] = aiChoice;
                turn++;
                let score = minimax(spots, depth + 1, false, alpha, beta);
                spots[i] = '';
                turn--;
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break;
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 1; i <= 9; i++) {
            if (spots[i] === '') {
                spots[i] = userChoice;
                turn++;
                let score = minimax(spots, depth + 1, true, alpha, beta);
                spots[i] = '';
                turn--;
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, score);
                if (beta <= alpha) break;
            }
        }
        return bestScore;
    }
}

function resetGame() {
    spots = {
        1: '', 2: '', 3: '',
        4: '', 5: '', 6: '',
        7: '', 8: '', 9: ''
    };
    turn = 0;
    playing = true;
    document.getElementById('status').innerText = '';
    for (let i = 1; i <= 9; i++) {
        document.getElementById('spot' + i).innerText = '';
    }
}
