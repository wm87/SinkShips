"use strict";

$(document).ready(function () {
    // Spielfeldgröße und Schiffeinstellungen
    const boardSize = 10;
    let cntShips = 0;
    const $gameBoard = $("#game-board");
    const $message = $("#message");

    let maxTries = 20;
    let rdnDir = "", rdnPosX = "", rdnPosY = "";

    const board = Array.from({ length: 10 }, () => Array(10).fill(""));
    const ships = Array.from({ length: 8 }, () => ({ size: Math.floor(Math.random() * 3) + 3 }));

    function getPossiblePosition(x, y, len, direction) {
        if (direction === "h") {
            const minX = (x - 1 < 0) ? 0 : x - 1;
            const minY = (y - 1 < 0) ? 0 : y - 1;
            const maxX = (x + 1 >= boardSize) ? boardSize : x + 2;
            const maxY = (y + len + 1 >= boardSize) ? boardSize : y + len + 1;

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
            const minX = (x - 1 < 0) ? 0 : x - 1;
            const minY = (y - 1 < 0) ? 0 : y - 1;
            const maxX = (x + len + 1 >= boardSize) ? boardSize : x + len + 1;
            const maxY = (y + 1 >= boardSize) ? boardSize : y + 2;

            for (let i = minX; i < maxX; i++) {
                for (let j = minY; j < maxY; j++) {
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
    while (ships.length > 0) {
        rdnDir = Math.random() < 0.5 ? "h" : "v";
        rdnPosX = Math.floor(Math.random() * boardSize);
        rdnPosY = Math.floor(Math.random() * boardSize);

        if (rdnDir === "h" && ships[0] && (rdnPosY + ships[0].size) < boardSize) {
            if (getPossiblePosition(rdnPosX, rdnPosY, ships[0].size, "h")) {
                cntShips += ships[0].size;
                ships.shift();
                maxTries = 20;
            }
        } else if (rdnDir === "v" && ships[0] && (rdnPosX + ships[0].size) < boardSize) {
            if (getPossiblePosition(rdnPosX, rdnPosY, ships[0].size, "v")) {
                cntShips += ships[0].size;
                ships.shift();
                maxTries = 20;
            }
        }

        maxTries--;
        if (maxTries === 0) {
            ships.shift();
            maxTries = 10;
        }
    }

    // Spielfeld zeichnen
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const $cell = $("<div>")
                .addClass("cell")
                .data({ x: i, y: j });
            //.text(board[i][j]);
            $gameBoard.append($cell);
        }
    }

    // Klick-Event für Zellen
    let hits = 0;
    $gameBoard.on("click", ".cell", function () {
        const $cell = $(this);
        if ($cell.hasClass("hit") || $cell.hasClass("miss")) {
            return;
        }

        const x = $cell.data("x");
        const y = $cell.data("y");

        if (board[x][y] === "X") {
            $cell.addClass("hit");
            $message.text("Treffer!");
            hits++;
        } else {
            $cell.addClass("miss");
            $message.text("Daneben!");
        }

        if (hits === cntShips) {
            $message.text("Du hast alle Schiffe versenkt!");
            $gameBoard.css("pointerEvents", "none");
        }
    });
});
