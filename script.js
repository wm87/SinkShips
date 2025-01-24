// Spielfeldgröße und Schiffeinstellungen
const boardSize = 10;
let cntShipElements = 0;
const gameBoard = document.getElementById("game-board");
const message = document.getElementById("message");

const ships = [
    { size: Math.floor(Math.random() * 3) + 3 },
    { size: Math.floor(Math.random() * 3) + 3 },
    { size: Math.floor(Math.random() * 3) + 3 },
    { size: Math.floor(Math.random() * 3) + 3 },
    { size: Math.floor(Math.random() * 3) + 3 }
];

ships.forEach(element => {
    cntShipElements += element["size"];
});

let board = [];

for (let i = 0; i < 10; i++) {
    board[i] = [];
    for (let j = 0; j < 10; j++) {
        board[i][j] = "";
    }
}

function getPossiblePosition(x, y, len, direction) {

    if (direction === "h") {

        minX = (x - 1 < 0) ? 0 : x - 1;
        minY = (y - 1 < 0) ? 0 : y - 1;
        maxX = (x + 1 >= boardSize) ? boardSize : x + 2;
        maxY = (y + len + 1 >= boardSize) ? boardSize : y + len + 1;

        for (let i = minX; i < maxX; i++) {
            for (let j = minY; j < maxY; j++) {
                if (board[i][j] === "X") {
                    return false;
                }
            }
        }

        console.log(`horizontal: x: ${x + 1}, y: ${y + 1}, len: ${len}`);

        for (let i = x; i < x + 1; i++) {
            for (let j = y; j < y + len; j++) {
                board[i][j] = "X";
            }
        }
    }

    if (direction === "v") {

        minX = (x - 1 < 0) ? 0 : x - 1;
        minY = (y - 1 < 0) ? 0 : y - 1;
        maxX = (x + len + 1 >= boardSize) ? boardSize : x + len + 1;
        maxY = (y + 1 >= boardSize) ? boardSize : y + 1;

        for (let i = minX; i < maxX; i++) {
            for (let j = minY; j <= maxY; j++) {
                if (board[i][j] === "X") {
                    return false;
                }
            }
        }

        console.log(`vertical: x: ${x + 1}, y: ${y + 1}, len: ${len}`);

        for (let i = x; i < x + len; i++) {
            for (let j = y; j < y + 1; j++) {
                board[i][j] = "X";
            }
        }
    }

    return true;
}

// Schiffe positionieren
do {
    const rdnDir = Math.random() < 0.5 ? "h" : "v";
    const rdnPosX = Math.floor(Math.random() * boardSize);
    const rdnPosY = Math.floor(Math.random() * boardSize);

    if (rdnDir === "h" &&
        (rdnPosY + ships[0]["size"]) < boardSize) {

        if (getPossiblePosition(rdnPosX, rdnPosY, ships[0]["size"], "h")) {
            ships.shift();
        }
    }

    if (rdnDir === "v" &&
        (rdnPosX + ships[0]["size"]) < boardSize) {

        if (getPossiblePosition(rdnPosX, rdnPosY, ships[0]["size"], "v")) {
            ships.shift();
        }
    }

} while (ships.length > 0);


// Spielfeld zeichnen
for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.x = i;
        cell.dataset.y = j;
        //cell.textContent = board[i][j];
        gameBoard.appendChild(cell);
    }
}

// Klick-Event für Zellen
let hits = 0;
gameBoard.addEventListener("click", (e) => {
    const cell = e.target;
    if (!cell.classList.contains("cell") || cell.classList.contains("hit") || cell.classList.contains("miss")) {
        return;
    }

    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);

    if (board[x][y] === "X") {
        cell.classList.add("hit");
        message.textContent = "Treffer!";
        hits++;
    } else {
        cell.classList.add("miss");
        message.textContent = "Daneben!";
    }

    if (hits === cntShipElements) {
        message.textContent = "Du hast alle Schiffe versenkt!";
        gameBoard.style.pointerEvents = "none";
    }
});
