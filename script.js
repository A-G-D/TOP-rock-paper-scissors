const ROCK              = 'rock';
const PAPER             = 'paper';
const SCISSOR           = 'scissor';

const RESULT_WIN        = 'win';
const RESULT_LOSE       = 'lose';
const RESULT_DRAW       = 'draw';

const MAX_SCORE         = 5;

const rockButton        = document.querySelector("#btn-rock");
const paperButton       = document.querySelector("#btn-paper");
const scissorButton     = document.querySelector("#btn-scissor");
const playerNameLabel   = document.querySelector(".player label.name span");
const compNameLabel     = document.querySelector(".computer label.name span");
const playerScoreLabel  = document.querySelector(".player label.score span");
const compScoreLabel    = document.querySelector(".computer label.score span");
const roundLabel        = document.querySelector("#current-round span");
const gameMessageBox    = document.querySelector("#game-message");
const roundHistoryList  = document.querySelector("#rounds-history ul");

let playerScore;
let computerScore;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function printGameMsg(message) {
    gameMessageBox.textContent = message;
}

function printGameResults(win) {
    if (win)
        printGameMsg(`Congratulations! You won against ${computerName}.`);
    else
        printGameMsg(`You lost against ${computerName}. Better luck next time..`);
}

const playerName = function getPlayerName() {
    const name = prompt("Enter your name:");
    return (name == null || name.length == 0)? getPlayerName() : name;
}();

async function getComputerName() {
    let computerName;
    const request = new XMLHttpRequest();
    request.open("GET", "https://randomuser.me/api/?format=json");
    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const response = JSON.parse(this.responseText);
            const name = response.results[0].name;
            computerName = `${name.title} ${name.first} ${name.last}`;
        }
    };
    request.send();

    while (computerName == undefined) await sleep(10);
    return computerName;
};

function initEventHandlers() {
    rockButton.addEventListener("click", () => playRound(ROCK));
    paperButton.addEventListener("click", () => playRound(PAPER));
    scissorButton.addEventListener("click", () => playRound(SCISSOR));
}

async function initNames() {
    playerNameLabel.textContent = playerName;
    computerName = await getComputerName();
    compNameLabel.textContent = computerName;
}

function updateScores(status) {
    if (status === RESULT_WIN)
        ++playerScore;
    else if (status === RESULT_LOSE)
        ++computerScore;
    else if (status == undefined) {
        playerScore = 0;
        computerScore = 0;
    }
    playerScoreLabel.textContent = playerScore;
    compScoreLabel.textContent = computerScore;
}

function promptGameRestart() {
    if (confirm("Play Again?")) {
        while (roundHistoryList.firstElementChild)
            roundHistoryList.firstElementChild.remove();
        updateScores();
        initNewRound(1);
    }
    else
        printGameMsg("Thank you for playing!");
}

let currentRound = 0;
async function initNewRound(round) {
    if (Math.max(playerScore, computerScore) == MAX_SCORE) {
        let winFlag = (playerScore > computerScore);
        printGameResults(winFlag);
        await sleep(2000); 
        promptGameRestart();
        return;
    }

    if (round)
        currentRound = round;
    else
        ++currentRound;
    roundLabel.textContent = `${currentRound}`;

    printGameMsg(`Starting Round ${currentRound}...`);
    await sleep(2000);
    printGameMsg(`Pick Your Hand`);
}

function recordRound(playerSelection, computerSelection, status) {
    let text = `[${currentRound}] ` +
            `${playerName}: ${playerSelection}; ` +
            `${computerName}: ${computerSelection}; ` +
            `(${status})`;
    let node = document.createElement('li');
    node.textContent = text;
    roundHistoryList.appendChild(node);
}

function isTimeToPick() {
    return gameMessageBox.textContent == `Pick Your Hand`;
}

function computerPlay() {
    let i = Math.floor(Math.random()*3); // Random int from 0 - 2
    return (
        (i == 0)? ROCK:
        (i == 1)? PAPER:
        (i == 2)? SCISSOR:
            ''
    );
}

function isValidSelection(selection) {
    selection = selection.toLowerCase();
    return (
        selection == ROCK ||
        selection == PAPER ||
        selection == SCISSOR
    );
}

function compareHand(playerSelection, computerSelection = computerPlay()) {
    let result;
    let message;

    if (playerSelection == computerSelection) {
        result = RESULT_DRAW;
        message = `Draw! ${playerSelection} equals ${computerSelection}`;
    }
    else if ((playerSelection == ROCK && computerSelection == SCISSOR) ||
            (playerSelection == PAPER && computerSelection == ROCK) ||
            (playerSelection == SCISSOR && computerSelection == PAPER)) {
        result = RESULT_WIN;
        message = `You Win! ${playerSelection} beats ${computerSelection}`;
    }
    else {
        result = RESULT_LOSE;
        message = `You Lose! ${computerSelection} beats ${playerSelection}`;
    }
    return {
        "result" : result,
        "message" : message,
        "opponentHand" : computerSelection
    };
}

async function playRound(playerSelection) {
    if (isTimeToPick()) {
        const result = compareHand(playerSelection);
        recordRound(playerSelection, result.opponentHand,
                result.result.toUpperCase());
        printGameMsg(result.message);
        await sleep(2000);
        updateScores(result.result);
        initNewRound();
    }
}

initEventHandlers();
initNames();
updateScores();
initNewRound();