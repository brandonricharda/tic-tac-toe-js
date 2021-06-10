const gameBoard = (function() {
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
                return true;
            } else {
                return false;
            }
        }
    }

});

const playerFactory = (name, marker) => {
    return { name, marker };
}

const game = (function() {
    let board = gameBoard();
    // Selects player name input fields
    let playerOneInput = document.getElementById("player-one-name");
    let playerTwoInput = document.getElementById("player-two-name");
    // This array will contain the player objects created for the game
    let players = [];
    let markers = ["X", "O"];
    // For playerOne and playerTwo...
    [playerOneInput, playerTwoInput].forEach(function(player, index) {
        // If the player name input value is blank...
        if (player.value == "") {
            // Just name the player Player {index + 1} (which will be Player 1 or Player 2)
            players.push(playerFactory(`Player ${index + 1}`, markers[index]));
        } else {
            // If the player's name input is filled, name the player accordingly
            players.push(playerFactory(player.value, markers[index]));
        }
    });

    // Sets current player to X to start the match
    let currentPlayer = players[0];

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
                        highlightWinner(gameOver(i)[0]);
                    }
                    board.cells[i].removeEventListener("click", _listener, true);
                }
            });
        }
    };

    let end = function() {

    }

    // Makes the start button functional
    let configureStartButton = function() {
        let startButton = document.getElementById("start-button");
        startButton.addEventListener("click", function() {
            start();
        });
    }();

    let highlightWinner = function(cells) {
        cells.forEach(function(cell) {
            cell.style.backgroundColor = "#EDEEC9";
        });
    }

})();