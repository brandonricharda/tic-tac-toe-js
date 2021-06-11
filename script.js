const gameBoard = (function() {
    let positions = new Array(9).fill(null);
    // Collects HTML divs representing board cells
    let cells = document.getElementById("board").children;
    // These are all the possible index combinations in the positions array that would suggest a win
    let winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    
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
                return true;
            } else {
                return false;
            }
        },
        highlightCell: function(cell) {
            cell.style.backgroundColor = "#EDEEC9";
        },
        dimCell: function(cell) {
            cell.style.filter = "brightness(80%)";
        },
        // Determines whether an array represents three equal moves in a row (a win)
        threeInARow: function(array) {
            return array.every(cell => cell.innerHTML == array[0].innerHTML);
        },
        // Where "i" is a cell index, function returns adjacent cell indexes that would need
        // to be occupied for a win
        positionsToCheck: function(i) {
            return winningCombinations.filter(array => array.includes(i));
        }
    }

});

const playerFactory = (name, marker) => {
    return { name, marker };
}

const pairOfPlayers = (function() {
    let markers = ["X", "O"];
    let players = [];
    let playerOneInput = document.getElementById("player-one-name");
    let playerTwoInput = document.getElementById("player-two-name");
    [playerOneInput, playerTwoInput].forEach(function(player, index) {
        if (player.value == "") {
            players.push(playerFactory(`Player ${index + 1}`, markers[index]));
        } else {
            players.push(playerFactory(player.value, markers[index]));
        }
    });
    return { players };
});

const game = (function() {
    let board = gameBoard();
    let players = pairOfPlayers().players;
    // Sets current player to X to start the match
    let currentPlayer = players[0];

    let gameOver = function(i) {
        // Values at each index in the positionsToCheck array will be stored here
        let values = [];
        // Iterate through each positionsToCheck array
        board.positionsToCheck(i).forEach(function (array) {
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
        return values.filter(positions => board.threeInARow(positions) == true);
    }

    let start = function() {
        for (let i = 0; i < board.cells.length; i++) {
            // Adds click event listeners to board
            board.cells[i].addEventListener("click", function _listener() {
                // If board.addMove returns true, that means a move was successfully added
                // It would fail if an attempt was made to add a duplicate move
                if (board.addMove(currentPlayer.marker, i)) {
                    // If the gameOver array is empty, that means it contains no arrays representing a win
                    if (gameOver(i).length == 0) {
                        currentPlayer = players.filter(player => player != currentPlayer)[0];
                    } else {
                        console.log("Victory!");
                        // Highlights winning moves
                        gameOver(i)[0].forEach(cell => board.highlightCell(cell));
                        // Loop through all cells
                        for (let x = 0; x < board.cells.length; x++) {
                            // If the cell is not one of the highlighted cells (representing a win)
                            if (board.cells[x].style.backgroundColor != "rgb(237, 238, 201)") {
                                board.dimCell(board.cells[x]);
                            }
                        }
                    }
                }
            });
        }
    };

    // Makes the start button functional
    let configureStartButton = function() {
        let startButton = document.getElementById("start-button");
        startButton.addEventListener("click", function() {
            start();
        });
    }();

})();