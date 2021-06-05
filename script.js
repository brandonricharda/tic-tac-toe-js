var gameBoard = (function() {

    var positions = ["X", "O", "X", "O", "X", "O", "X", "O", "X"];

    return {
        printBoard: function() {
            // Instead of console.log, we actually need to place the objects in the HTML game board
            console.log(positions);
        }
    }

})();