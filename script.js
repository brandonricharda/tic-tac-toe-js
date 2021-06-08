var gameBoard = (function() {
    let positions = new Array(9).fill(null);
    let cells = document.getElementById("board").children;
    // These are all the possible index combinations in the positions array that would suggest a win
    let winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    
    return {
        positions,
        cells,
        winningCombinations,
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

    // See if all elements in array are equal
    let threeInARow = (array) => array.every(cell => cell.innerHTML == array[0].innerHTML);

    let gameOver = function(i) {
        // Select all combinations from board's winningCombinations array that contain i
        let positionsToCheck = board.winningCombinations.filter(array => array.includes(i));
        // Values at each index in the positionsToCheck array will be stored here
        let values = [];
        // Iterate through each positionsToCheck array
        positionsToCheck.forEach(function (array) {
            // This variable will collect all values at index in the current loop array
            let smallerArray = []
            array.forEach(function(index) {
                smallerArray.push(board.cells[index]);
            });
            values.push(smallerArray);
        });
        // Once the values array has been populated with the smaller chunks in the above loop
        // We can check to see whether any arrays exist containing three equal values
        // If the method returns an empty array, that means the game is not over
        return values.filter(positions => threeInARow(positions) == true);
    }

    // Sets current player to X to start the match
    let currentPlayer = players[0];

    // Adds event listeners to board
    for (let i = 0; i < board.cells.length; i++) {
        board.cells[i].addEventListener("click", function() {
            // Makes a move in the position the user clicked on
            board.addMove(currentPlayer.marker, i);
            // 
            if (gameOver(i).length == 0) {
                currentPlayer = players.filter(player => player != currentPlayer)[0];
            } else {
                console.log("Victory!");
                // Highlights winning moves
                gameOver(i)[0].forEach(function(cell) {
                    cell.style.backgroundColor = "#EDEEC9";
                });
            }
        });
    }

});