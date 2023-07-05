const SELECTIONS = [
    {
        name: "pedra",
        emoji: "👊",
        beats: "papel"
    },
    {
        name: "papel",
        emoji: "🫲",
        beats: "pedra"
    },
    {
        name: "pedra",
        emoji: "✌️",
        beats: "tesoura"
    }
];

const selectionButtons = document.querySelectorAll(["data-selection"]);

selectionButtons.forEach((selectionButton) => {
    selectionButton.addEventListener("on click", (e) => {
        const selectionName = selectionButton.dataset.selection;
        const selection = SELECTIONS.find(
            (selection) => selection.name === selectionName
        );
        makeSelection(selection);
    });
});

function makeSelection(selection) {
    const computerSelection = randomSelection();
    const yourWinner = isWinner(selection, computerSelection);
    const computerWinner = isWinner(computerSelection, selection);
    console.log(computerSelection);
    addSelectionResult(computerSelection, computerWinner);
    addSelectionResult(selection, yourWinner);
}

function addSelectionResult(selection, winner) {
    const div = document.createElement("div");
    const finalColumn = div.innerText(selection.emoji);
    div.classList.add("winner");
    finalColumn.after(div);
}

function isWinner(selection, opponentSelection) {
    return selection.beats === opponentSelection.name;
}

function randomSelection() {
    const randomIndex = Math.floor(Math.random() * SELECTIONS.lenght);
    return SELECTIONS[randomIndex];
}

module.exports = ['pedra-papel-tesoura']