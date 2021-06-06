var gameBoard = (function() {
    let positions = new Array(9).fill(null);
    let cells = document.getElementById("board").children;
    
    return {
        positions,
        cells,
        // Iterates through positions array and prints the results on the HTML display
        print: function() {
            for (let i = 0; i < cells.length; i++) { cells[i].innerHTML = positions[i] }
        },
        // Adds move to positions array if spot is empty
        addMove: function(marker, cell) {
            if (positions[cell] == null) {
                positions[cell] = marker;
                this.print();
            } else {
                console.log("This spot is already taken!");
            }
        }
    }

});

const playerFactory = (name, marker) => {
    // Makes player name and marker available to other modules
    return { name, marker };
}

const game = (function() {
    let board = gameBoard();
    let players = [playerFactory("Player 1", "X"), playerFactory("Player 2", "O")];
    // Sets current player to X to start the match
    let currentPlayer = players[0];
    // Adds event listeners to board
    for (let i = 0; i < board.cells.length; i++) {
        board.cells[i].addEventListener("click", function() {
            board.addMove(currentPlayer.marker, i);
            // Switch currentPlayer status to opposite player
            currentPlayer = players.filter(player => player != currentPlayer)[0];
        });
    }
});