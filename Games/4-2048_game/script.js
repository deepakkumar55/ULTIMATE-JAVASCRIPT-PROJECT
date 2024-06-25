document.addEventListener("DOMContentLoaded", () => {
    const gridDisplay = document.querySelector("#grid");
    const scoreDisplay = document.querySelector("#score");
    let squares = [];
    let score = 0;

    // Create the playing board
    function createBoard() {
        for (let i = 0; i < 16; i++) {
            let square = document.createElement("div");
            square.classList.add("grid-cell");
            square.innerHTML = 0;
            gridDisplay.appendChild(square);
            squares.push(square);
        }
        generate();
        generate();
    }

    // Generate a new number in a random empty square
    function generate() {
        let randomNumber = Math.floor(Math.random() * squares.length);
        if (squares[randomNumber].innerHTML == 0) {
            squares[randomNumber].innerHTML = 2;
            squares[randomNumber].setAttribute('data-value', 2);
            checkForGameOver();
        } else generate();
    }

    // Swipe right
    function moveRight() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML;
                let totalTwo = squares[i + 1].innerHTML;
                let totalThree = squares[i + 2].innerHTML;
                let totalFour = squares[i + 3].innerHTML;
                let row = [
                    parseInt(totalOne),
                    parseInt(totalTwo),
                    parseInt(totalThree),
                    parseInt(totalFour)
                ];

                let filteredRow = row.filter(num => num);
                let missing = 4 - filteredRow.length;
                let zeros = Array(missing).fill(0);
                let newRow = zeros.concat(filteredRow);

                squares[i].innerHTML = newRow[0];
                squares[i + 1].innerHTML = newRow[1];
                squares[i + 2].innerHTML = newRow[2];
                squares[i + 3].innerHTML = newRow[3];
                updateTileData(i, i + 1, i + 2, i + 3);
            }
        }
    }

    // Swipe left
    function moveLeft() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML;
                let totalTwo = squares[i + 1].innerHTML;
                let totalThree = squares[i + 2].innerHTML;
                let totalFour = squares[i + 3].innerHTML;
                let row = [
                    parseInt(totalOne),
                    parseInt(totalTwo),
                    parseInt(totalThree),
                    parseInt(totalFour)
                ];

                let filteredRow = row.filter(num => num);
                let missing = 4 - filteredRow.length;
                let zeros = Array(missing).fill(0);
                let newRow = filteredRow.concat(zeros);

                squares[i].innerHTML = newRow[0];
                squares[i + 1].innerHTML = newRow[1];
                squares[i + 2].innerHTML = newRow[2];
                squares[i + 3].innerHTML = newRow[3];
                updateTileData(i, i + 1, i + 2, i + 3);
            }
        }
    }

    // Swipe down
    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML;
            let totalTwo = squares[i + 4].innerHTML;
            let totalThree = squares[i + 8].innerHTML;
            let totalFour = squares[i + 12].innerHTML;
            let column = [
                parseInt(totalOne),
                parseInt(totalTwo),
                parseInt(totalThree),
                parseInt(totalFour)
            ];

            let filteredColumn = column.filter(num => num);
            let missing = 4 - filteredColumn.length;
            let zeros = Array(missing).fill(0);
            let newColumn = zeros.concat(filteredColumn);

            squares[i].innerHTML = newColumn[0];
            squares[i + 4].innerHTML = newColumn[1];
            squares[i + 8].innerHTML = newColumn[2];
            squares[i + 12].innerHTML = newColumn[3];
            updateTileData(i, i + 4, i + 8, i + 12);
        }
    }

    // Swipe up
    function moveUp() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML;
            let totalTwo = squares[i + 4].innerHTML;
            let totalThree = squares[i + 8].innerHTML;
            let totalFour = squares[i + 12].innerHTML;
            let column = [
                parseInt(totalOne),
                parseInt(totalTwo),
                parseInt(totalThree),
                parseInt(totalFour)
            ];

            let filteredColumn = column.filter(num => num);
            let missing = 4 - filteredColumn.length;
            let zeros = Array(missing).fill(0);
            let newColumn = filteredColumn.concat(zeros);

            squares[i].innerHTML = newColumn[0];
            squares[i + 4].innerHTML = newColumn[1];
            squares[i + 8].innerHTML = newColumn[2];
            squares[i + 12].innerHTML = newColumn[3];
            updateTileData(i, i + 4, i + 8, i + 12);
        }
    }

    // Combine numbers in row
    function combineRow() {
        for (let i = 0; i < 15; i++) {
            if (squares[i].innerHTML === squares[i + 1].innerHTML && squares[i].innerHTML != 0) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
                squares[i].innerHTML = combinedTotal;
                squares[i + 1].innerHTML = 0;
                score += combinedTotal;
                scoreDisplay.innerHTML = `Score: ${score}`;
                squares[i].setAttribute('data-value', combinedTotal);
                squares[i + 1].setAttribute('data-value', 0);
            }
        }
        checkForWin();
    }

    // Combine numbers in column
    function combineColumn() {
        for (let i = 0; i < 12; i++) {
            if (squares[i].innerHTML === squares[i + 4].innerHTML && squares[i].innerHTML != 0) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 4].innerHTML);
                squares[i].innerHTML = combinedTotal;
                squares[i + 4].innerHTML = 0;
                score += combinedTotal;
                scoreDisplay.innerHTML = `Score: ${score}`;
                squares[i].setAttribute('data-value', combinedTotal);
                squares[i + 4].setAttribute('data-value', 0);
            }
        }
        checkForWin();
    }

    // Assign functions to keycodes
    function control(e) {
        if (e.keyCode === 39) {
            keyRight();
        } else if (e.keyCode === 37) {
            keyLeft();
        } else if (e.keyCode === 38) {
            keyUp();
        } else if (e.keyCode === 40) {
            keyDown();
        }
    }
    document.addEventListener("keyup", control);

    function keyRight() {
        moveRight();
        combineRow();
        moveRight();
        generate();
    }

    function keyLeft() {
        moveLeft();
        combineRow();
        moveLeft();
        generate();
    }

    function keyDown() {
        moveDown();
        combineColumn();
        moveDown();
        generate();
    }

    function keyUp() {
        moveUp();
        combineColumn();
        moveUp();
        generate();
    }

    function checkForWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 2048) {
                scoreDisplay.innerHTML = "You win!";
                document.removeEventListener("keyup", control);
            }
        }
    }

    function checkForGameOver() {
        let zeros = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) {
                zeros++;
            }
        }
        if (zeros === 0) {
            scoreDisplay.innerHTML = "Game Over!";
            document.removeEventListener("keyup", control);
        }
    }

    function updateTileData(...indices) {
        indices.forEach(index => {
            squares[index].setAttribute('data-value', squares[index].innerHTML);
        });
    }

    createBoard();
});
