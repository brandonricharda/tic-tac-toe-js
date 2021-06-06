var gameBoard = (function() {

    let boardArray = new Array(9).fill(null);
    // Selects the HTML board (grid) and its inner divs
    let cells = document.getElementById("board").children;

    return {
        // Accepts a positions array parameter
        printBoard: function() {
            // Transfers markers from positions array to HTML board
            for(let i = 0; i < cells.length; i++) { cells[i].innerHTML = boardArray[i]; }
        },
        // Accepts player marker ("X" || "O") and cell (0-8) as parameters
        addMove: function(marker, cell) {
            if (boardArray[cell] != null) {
                console.log("This spot has been taken!");
            } else {
                boardArray[cell] = marker;
                this.printBoard();
            }
        },
        // Adds event listeners to cells (instantly executes on load)
        _addListeners: function() {
            // Iterates through cells and adds click event listeners
            for(let i = 0; i < cells.length; i++) {
                cells[i].addEventListener("click", function() {
                    gameBoard.addMove("X", i);
                });
            }
        }()
    }

})();

const playerFactory = (name, marker) => {
    
};