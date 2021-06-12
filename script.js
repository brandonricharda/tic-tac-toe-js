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
        dimAllCells: function() {
            for (let i = 0; i < cells.length; i++) {
                if (cells[i].style.backgroundColor != "rgb(144, 224, 239)") {
                    this.dimCell(cells[i]);
                }
            }
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
            let values = [];
            this.positionsToCheck(i).forEach(function (array) {
                let smallerArray = [];
                array.forEach(function(index) {
                    smallerArray.push(cells[index]);
                });
                values.push(smallerArray);
            });
            return values.filter(positions => this.threeInARow(positions) == true);
        },
        tie: function() {
            let values = [];
            for (i = 0; i < cells.length; i++) {
                values.push(cells[i].innerHTML);
            }
            return values.every(value => value != "");
        },
        deactivate: function() {
            for (let i = 0; i < cells.length; i++) {
                cells[i].style.pointerEvents = "none";
            }
        },
        reset: function() {
            for (let i = 0; i < cells.length; i++) {
                cells[i].style = "initial";
                cells[i].innerHTML = "";
                positions[i] = null;
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

const controls = (function() {
    let container = document.getElementById("controls");
    let playerOneInput = document.getElementById("player-one-name");
    let playerTwoInput = document.getElementById("player-two-name");
    let startButton = document.getElementById("start-button");

    return {
        startButton,
        playerOneInput,
        playerTwoInput,
        toggleDefaultInputs: function(mode) {
            if (mode == "hide") {
                [playerOneInput, playerTwoInput, startButton].forEach(element => element.style.display = "none");
            } else if (mode == "show") {
                [playerOneInput, playerTwoInput, startButton].forEach(element => element.style.display = "block");
            }
        },
        toggleGameplayControls: function(mode) {
            if (mode == "show") {
                let restartButton = document.createElement("button");
                restartButton.innerHTML = "Restart";
                restartButton.setAttribute("id", "restart-button");
                container.appendChild(restartButton);
            } else if (mode == "hide") {
                let restartButton = document.getElementById("restart-button");
                restartButton.remove();
            }
        }
    }
    
});

const communications = (function() {
    let message = document.getElementById("main-message");

    return {
        updateMessage: function(player, mode) {
            if (mode == "switch" || mode == "startMatch") {
                message.innerHTML = `${player}'s Turn`;
            } else if (mode == "gameOver") {
                message.innerHTML = `${player} Wins`;    
            } else if (mode == "tie") {
                message.innerHTML = "It's a Tie. Hit Restart";    
            } else if (mode == "splash") {
                message.innerHTML = "Get Started";
            }
        }
    }

});

const game = (function() {

    let board = gameBoard();
    let opponents = null;
    let currentPlayer = null;
    let controller = controls();
    let message = communications();

    let tieSequence = function(player) {
        board.deactivate();
        message.updateMessage(player, "tie");
        board.dimAllCells();
    }

    let switchTurns = function(player) {
        currentPlayer = opponents.switch(player);
        message.updateMessage(currentPlayer.name, "switch");
    }

    let gameOverSequence = function(player, i) {
        board.winnerFound(i)[0].forEach(cell => board.highlightCell(cell));
        for (let x = 0; x < board.cells.length; x++) {
            if (board.cells[x].style.backgroundColor != "rgb(144, 224, 239)") {
                board.dimCell(board.cells[x]);
            }
        }
        board.deactivate();
        message.updateMessage(currentPlayer.name, "gameOver");
    }

    let identifyNextStep = function(currentPlayer, i) {
        if (board.addMove(currentPlayer.marker, i)) {
            if (board.winnerFound(i).length == 0) {
                if (board.tie()) {
                    tieSequence(currentPlayer.name);
                } else {
                    switchTurns(currentPlayer);
                }
            } else {
                gameOverSequence(currentPlayer, i);
            }
        }
    }

    let setControlsForGameStart = function() {
        controller.toggleDefaultInputs("hide");
        controller.toggleGameplayControls("show");
    }

    let setMessageForGameStart = function() {
        message.updateMessage(currentPlayer.name, "switch");
    }

    let activateRestartButton = function() {
        let restartButton = document.getElementById("restart-button");
        restartButton.addEventListener("click", function() {
            board.reset();
            opponents = pairOfPlayers();
            currentPlayer = opponents.players[0];
            setMessageForGameStart();
        });
    }

    let start = function() {
        opponents = pairOfPlayers();
        currentPlayer = opponents.players[0];
        setControlsForGameStart();
        setMessageForGameStart();
        activateRestartButton();
        activateBoard();
    }

    let activateBoard = function() {
        for (let i = 0; i < board.cells.length; i++) {
            board.cells[i].addEventListener("click", function() {
                identifyNextStep(currentPlayer, i);
            });
        }
    }

    controller.startButton.addEventListener("click", function() {
        start();
    });

})();