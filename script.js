const ROCK = 'rock';
const PAPER = 'paper';
const SCISSOR = 'scissor';

const playerName = function getPlayerName() {
    let name = prompt("Enter your name:");
    return (name.length == 0)? getPlayerName() : name; 
}();

function initializeDOM() {
    let playerNameLabel = document.querySelector(".player label.name");
    playerNameLabel.textContent = playerName;
}

function computerPlay() {
    let i = Math.round(Math.random()*2); // Random int from 0 - 2
    return (
        (i == 0)? ROCK:
        (i == 1)? PAPER:
        (i == 2)? SCISSOR:
            ""
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

function playRound(playerSelection, computerSelection) {
    if (playerSelection == computerSelection)
        return `Draw! ${playerSelection} equals ${computerSelection}`;

    if ((playerSelection == ROCK && computerSelection == SCISSOR) ||
        (playerSelection == PAPER && computerSelection == ROCK) ||
        (playerSelection == SCISSOR && computerSelection == PAPER))
        return `You Win! ${playerSelection} beats ${computerSelection}`;

    return `You Lose! ${computerSelection} beats ${playerSelection}`;
}

function game() {
    for (let i = 0; i < 5; ++i) {
        playerSelection = prompt("Pick your hand..").toLowerCase();
        computerSelection = computerPlay();
        result = playRound(playerSelection, computerSelection);
        console.log(result);
    }
    console.log("That's it! Thanks for playing.");
}

initializeDOM();