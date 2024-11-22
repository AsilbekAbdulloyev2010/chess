const chessboard = document.getElementById("chessboard");
const statusDisplay = document.getElementById("status");
const confirmButton = document.getElementById("confirmMove");

const pieces = {
    white: {
        pawn: "♙",
        rook: "♖",
        knight: "♘",
        bishop: "♗",
        queen: "♕",
        king: "♔",
    },
    black: {
        pawn: "♟︎",
        rook: "♜",
        knight: "♞",
        bishop: "♝",
        queen: "♛",
        king: "♚",
    },
};

let board = [];
let selectedPiece = null;
let potentialMove = null;

function createChessboard() {
    chessboard.innerHTML = "";
    board = [];

    for (let row = 0; row < 8; row++) {
        const boardRow = [];
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add((row + col) % 2 === 0 ? "white" : "black");
            cell.dataset.row = row;
            cell.dataset.col = col;
            chessboard.appendChild(cell);
            boardRow.push({ piece: null, cell });
        }
        board.push(boardRow);
    }

    placePieces();
}

function placePieces() {
    const whitePieces = [
        pieces.white.rook,
        pieces.white.knight,
        pieces.white.bishop,
        pieces.white.queen,
        pieces.white.king,
        pieces.white.bishop,
        pieces.white.knight,
        pieces.white.rook,
    ];

    const blackPieces = [
        pieces.black.rook,
        pieces.black.knight,
        pieces.black.bishop,
        pieces.black.queen,
        pieces.black.king,
        pieces.black.bishop,
        pieces.black.knight,
        pieces.black.rook,
    ];

    board[0].forEach((cell, col) => {
        cell.piece = blackPieces[col];
        cell.cell.textContent = blackPieces[col];
    });

    board[1].forEach((cell) => {
        cell.piece = pieces.black.pawn;
        cell.cell.textContent = pieces.black.pawn;
    });

    board[6].forEach((cell) => {
        cell.piece = pieces.white.pawn;
        cell.cell.textContent = pieces.white.pawn;
    });

    board[7].forEach((cell, col) => {
        cell.piece = whitePieces[col];
        cell.cell.textContent = whitePieces[col];
    });
}

function selectPiece(row, col) {
    if (selectedPiece) {
        selectedPiece.cell.classList.remove("selected");
    }
    const cell = board[row][col];
    if (cell.piece) {
        selectedPiece = { piece: cell.piece, row, col, cell: cell.cell };
        selectedPiece.cell.classList.add("selected");
    }
}

function moveSelectedPiece(deltaRow, deltaCol) {
    if (!selectedPiece) {
        statusDisplay.textContent = "Iltimos, donani tanlang!";
        return;
    }

    const newRow = selectedPiece.row + deltaRow;
    const newCol = selectedPiece.col + deltaCol;

    if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) {
        statusDisplay.textContent = "Bu yerdan tashqariga chiqa olmaysiz!";
        return;
    }

    const targetCell = board[newRow][newCol];
    if (!targetCell.piece || targetCell.piece[0] !== selectedPiece.piece[0]) {
        potentialMove = { newRow, newCol, targetCell };
        statusDisplay.textContent = `Harakatni tasdiqlang: ${
            targetCell.piece ? "Boshqa dona bor" : "Bo'sh katak"
        }`;
    } else {
        statusDisplay.textContent = "Bu joy band!";
    }
}

confirmButton.addEventListener("click", () => {
    if (!potentialMove) {
        statusDisplay.textContent = "Harakatni tanlamadingiz!";
        return;
    }

    const { newRow, newCol, targetCell } = potentialMove;

    selectedPiece.cell.textContent = "";
    selectedPiece.cell.classList.remove("selected");

    targetCell.textContent = selectedPiece.piece;
    targetCell.piece = selectedPiece.piece;

    selectedPiece.row = newRow;
    selectedPiece.col = newCol;
    selectedPiece.cell = targetCell.cell;

    selectedPiece.cell.classList.add("selected");

    potentialMove = null;
    statusDisplay.textContent = "Harakat qabul qilindi!";
});

document.addEventListener("keydown", (e) => {
    if (!selectedPiece) {
        statusDisplay.textContent = "Iltimos, donani tanlang!";
        return;
    }

    switch (e.key) {
        case "ArrowUp":
            moveSelectedPiece(-1, 0);
            break;
        case "ArrowDown":
            moveSelectedPiece(1, 0);
            break;
        case "ArrowLeft":
            moveSelectedPiece(0, -1);
            break;
        case "ArrowRight":
            moveSelectedPiece(0, 1);
            break;
        default:
            statusDisplay.textContent = "Faqat Arrow tugmalari ishlaydi!";
    }
});

createChessboard();

chessboard.addEventListener("click", (e) => {
    const target = e.target.closest(".cell");
    if (!target) return;

    const row = parseInt(target.dataset.row);
    const col = parseInt(target.dataset.col);

    selectPiece(row, col);
});
