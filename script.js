// var gameBoard = (function() {

//     let board = document.getElementById("board");
//     let cells = board.children;

//     for(let i = 0; i < cells.length; i++) {
//         cells[i].addEventListener("click", function() {
//             console.log(cells[i]);
//         });
//     }

// })();

var gameBoard = (function() {

    let positions = ["X", "O", "X", "O", "X", "O", "X", "O", "X"];

    return {
        printBoard: function() {
            // Selects the HTML board (grid) and its inner divs
            grid = document.getElementById("board");
            cells = grid.children;
            // Transfers markers from positions array to HTML board
            for(let i = 0; i < cells.length; i++) {
                cells[i].innerHTML = positions[i];
            }
        }
    }

})();