let grid = [];
const rows = 10;
const cols = 20;
const cellSize = 32;
let players = ['red', 'blue'];
let currentPlayerIndex = 0;
let currentPlayer = players[currentPlayerIndex];
let turnCounter = 0;
let blastOccurred = false;

function setup() {
    createCanvas(cols * cellSize, rows * cellSize + 50);
    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
            grid[i][j] = { count: 0, color: null };
        }
    }
    drawUI();
}

function draw() {
    background(255);
    drawGrid();
}

function drawUI() {
    fill(0);
    textSize(24);
    textAlign(LEFT, TOP);
    text(`Current Player: ${currentPlayer}`, 10, height - 40);
}

function drawGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let x = j * cellSize;
            let y = i * cellSize;
            stroke(0);
            fill(grid[i][j].color || 'white');
            rect(x, y, cellSize, cellSize);
            if (grid[i][j].count > 0) {
                fill(0);
                textSize(16);
                textAlign(CENTER, CENTER);
                text(grid[i][j].count, x + cellSize / 2, y + cellSize / 2);
            }
        }
    }
}

function mousePressed() {
    let i = floor(mouseY / cellSize);
    let j = floor(mouseX / cellSize);
    if (i >= 0 && i < rows && j >= 0 && j < cols) {
        addBubble(i, j);
        document.getElementById("playerTurn").innerHTML = "Current Player : " + players[currentPlayerIndex];
    }
}

function addBubble(i, j) {
    if (grid[i][j].color !== null && grid[i][j].color !== currentPlayer) {
        return;
    }

    grid[i][j].count++;
    grid[i][j].color = currentPlayer;
    if (grid[i][j].count >= getBlastThreshold(i, j)) {
        blast(i, j);
    }
    turnCounter++;
    if (blastOccurred && turnCounter >= players.length && checkWin()) {
        handleWin(currentPlayer);
    } else {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        currentPlayer = players[currentPlayerIndex];
        redraw();
    }
}

function blast(i, j) {
    blastOccurred = true;
    let blastColor = grid[i][j].color;
    grid[i][j].count = 0;
    grid[i][j].color = null;
    let neighbors = getNeighbors(i, j);
    for (let [ni, nj] of neighbors) {
        grid[ni][nj].color = blastColor;
        grid[ni][nj].count++;
        if (grid[ni][nj].count >= getBlastThreshold(ni, nj)) {
            blast(ni, nj);
        }
    }

    if (blastOccurred && turnCounter >= players.length && checkWin()) {
        handleWin(blastColor);
    }
}

function getNeighbors(i, j) {
    let neighbors = [];
    if (i > 0) neighbors.push([i - 1, j]);
    if (i < rows - 1) neighbors.push([i + 1, j]);
    if (j > 0) neighbors.push([i, j - 1]);
    if (j < cols - 1) neighbors.push([i, j + 1]);
    return neighbors;
}

function getBlastThreshold(i, j) {
    if ((i === 0 || i === rows - 1) && (j === 0 || j === cols - 1)) {
        return 2; // Corner cell
    } else if (i === 0 || i === rows - 1 || j === 0 || j === cols - 1) {
        return 3; // Edge cell
    } else {
        return 4; // Center cell
    }
}

function checkWin() {
    let playerColor = null;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j].count > 0) {
                if (playerColor === null) {
                    playerColor = grid[i][j].color;
                } else if (grid[i][j].color !== playerColor) {
                    return false;
                }
            }
        }
    }
    return playerColor !== null;
}

function handleWin(color) {
    setTimeout(() => {
        alert(`${color} wins!`);
        resetGame();
    }, 100);
}

function resetGame() {
    grid = [];
    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
            grid[i][j] = { count: 0, color: null };
        }
    }
    turnCounter = 0;
    blastOccurred = false;
    currentPlayerIndex = 0;
    currentPlayer = players[currentPlayerIndex];
    // loop();
    // redraw();
}