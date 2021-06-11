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
            cell.style.backgroundColor = "#90E0EF";
            cell.style.color = "black";
        },
        dimCell: function(cell) {
            cell.style.filter = "brightness(80%)";
        },
        // Determines whether an array represents three equal moves in a row (a win)
        threeInARow: function(array) {
            return array.every(cell => cell.innerHTML == array[0].innerHTML);
        },
        // Where "i" is a cell index, function returns adjacent cell indexes that would need to be occupied for a win
        positionsToCheck: function(i) {
            return winningCombinations.filter(array => array.includes(i));
        },
        winnerFound: function(i) {
            let values = []
            this.positionsToCheck(i).forEach(function (array) {
                let smallerArray = [];
                array.forEach(function(index) {
                    smallerArray.push(cells[index]);
                });
                values.push(smallerArray);
            });
            return values.filter(positions => this.threeInARow(positions) == true);
        },
        deactivate: function() {
            for (let i = 0; i < cells.length; i++) {
                cells[i].style.pointerEvents = "none";
            }
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
    return {
        players,
        switch: function(currentPlayer) {
            return players.filter(player => player != currentPlayer)[0];
        }
    }
});

const game = (function() {

    let updateCommunications = function(player, mode) {
        let communications = document.getElementById("main-message");
        if (mode == "switch" || mode == "startMatch") {
            communications.innerHTML = `${player}'s Turn`;
        } else if (mode == "gameOver") {
            communications.innerHTML = `${player} Wins`;
        }
    }

    let updateControls = function(mode) {
        let controls = document.getElementById("controls");
        let playerOneName = document.getElementById("player-one-name");
        let playerTwoName = document.getElementById("player-two-name");
        let startButton = document.getElementById("start-button");
        if (mode == "gamePlay") {
            [playerOneName, playerTwoName, startButton].forEach(element => element.style.display = "none");
            let restartButton = document.createElement("button");
            restartButton.innerHTML = "Restart";
            controls.appendChild(restartButton);
            restartButton.addEventListener("click", function() {
                location.reload();
            });
        } else if (mode == "start") {
            let startButton = document.getElementById("start-button");
            startButton.addEventListener("click", function() {
                start();
            });
        }
    }

    let start = function() {
        let opponents = pairOfPlayers();
        // Sets current player to X to start the match
        let currentPlayer = opponents.players[0];
        updateControls("gamePlay");
        updateCommunications(currentPlayer.name, "startMatch");
        // Adds event listeners that lets users click on cells to make moves
        for (let i = 0; i < board.cells.length; i++) {
            board.cells[i].addEventListener("click", function() {
                if (board.addMove(currentPlayer.marker, i)) {
                    if (board.winnerFound(i).length == 0) {
                        currentPlayer = opponents.switch(currentPlayer);
                        updateCommunications(currentPlayer.name, "switch");
                    } else {
                        board.winnerFound(i)[0].forEach(cell => board.highlightCell(cell));
                        for (let x = 0; x < board.cells.length; x++) {
                            if (board.cells[x].style.backgroundColor != "rgb(144, 224, 239)") {
                                board.dimCell(board.cells[x]);
                            }
                        }
                        board.deactivate();
                        updateCommunications(currentPlayer.name, "gameOver");
                    }
                }
            });
        }
    }

    let board = gameBoard();
    updateControls("start");

})();