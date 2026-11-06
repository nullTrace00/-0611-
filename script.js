/* =================================
   1. GET OUR HTML ELEMENTS
================================= */

const welcomeScreen = document.getElementById("welcomeScreen");

const codeScreen = document.getElementById("codeScreen");

const adventureScreen = document.getElementById("adventureScreen");

const startButton = document.getElementById("startButton");

const unlockButton = document.getElementById("unlockButton");

const secretCode = document.getElementById("secretCode");

const codeMessage = document.getElementById("codeMessage");

const letterButton = document.getElementById("letterButton");

const letterScreen = document.getElementById("letterScreen");
const letterBackButton = document.getElementById("letterBackButton");

const timerDisplay = document.getElementById("timerDisplay");
const timerMessage = document.getElementById("timerMessage");
const timerProgress = document.getElementById("timerProgress");

const sealedLetter = document.getElementById("sealedLetter");
const letterReveal = document.getElementById("letterReveal");

const envelope = document.getElementById("envelope");
const envelopeTitle = document.getElementById("envelopeTitle");
const envelopeText = document.getElementById("envelopeText");
const openLetterButton = document.getElementById("openLetterButton");

const messageScreen = document.getElementById("messageScreen");
const messageButton = document.getElementById("messageButton");
const messageBackButton = document.getElementById("messageBackButton");


/* =================================
   2. TEMPORARY SECRET CODE
================================= */

const correctCode = "56817";


/* =================================
   3. OPEN THE CODE SCREEN
================================= */

startButton.addEventListener("click", function() {

    welcomeScreen.hidden = true;

    codeScreen.hidden = false;

});


/* =================================
   4. CHECK THE SECRET CODE
================================= */

function checkCode() {

    const enteredCode = secretCode.value.trim();

    // Check for an empty input

    if (enteredCode === "") {

        codeMessage.textContent =
            "You haven't entered anything yet.";

        return;
    }

    // Check whether the code is correct

    if (enteredCode === correctCode) {

        codeMessage.textContent = "";

        codeScreen.hidden = true;

        adventureScreen.hidden = false;

    } else {

        codeMessage.textContent =
            "Not quite. Give it another try.";

        secretCode.value = "";

    }

}


/* =================================
   5. UNLOCK BUTTON
================================= */

unlockButton.addEventListener("click", checkCode);


/* =================================
   6. PRESS ENTER TO UNLOCK
================================= */

secretCode.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        checkCode();

    }

});

// CHESS CHALLENGE

const chessScreen = document.getElementById("chessScreen");
const chessButton = document.getElementById("chessButton");
const backButton = document.getElementById("backButton");
const chessBoard = document.getElementById("chessBoard");
const chessStatus = document.getElementById("chessStatus");
const chessMessage = document.getElementById("chessMessage");

// Create a chess game
const puzzleFen =
"r1b1rqk1/pp3p1p/2n1p1pQ/3p3N/3P4/2PB4/P4PPP/R4RK1 w - - 3 18";

const game = new Chess(puzzleFen);
let puzzleMove = 0;
let blackIsThinking = false;

// Track the selected square
let selectedSquare = null;

// Show the chess screen
chessButton.addEventListener("click", function() {
    adventureScreen.hidden = true;
    chessScreen.hidden = false;
    drawBoard();
});

// Return to the adventure screen
backButton.addEventListener("click", function() {
    chessScreen.hidden = true;
    adventureScreen.hidden = false;
});

// Chess piece symbols
const pieces = {
    wk: "♔", wq: "♕", wr: "♖",
    wb: "♗", wn: "♘", wp: "♙",
    bk: "♚", bq: "♛", br: "♜",
    bb: "♝", bn: "♞", bp: "♟"
};

// Draw the chessboard
function drawBoard() {
    chessBoard.innerHTML = "";

    const board = game.board();

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {

            const square = document.createElement("div");

            const file = "abcdefgh"[col];
            const rank = 8 - row;
            const squareName = file + rank;

            square.classList.add("chess-square");

            if ((row + col) % 2 === 0) {
                square.classList.add("light");
            } else {
                square.classList.add("dark");
            }

            const piece = board[row][col];

            if (piece) {
                square.textContent =
                    pieces[piece.color + piece.type];
            }

            square.addEventListener("click", function() {
                handleSquareClick(squareName);
            });

            chessBoard.appendChild(square);
        }
    }

    chessStatus.textContent =
        game.turn() === "w" ? "White to move." : "Black to move.";
}

// Handle clicks on squares
function handleSquareClick(squareName) {

    if (blackIsThinking || puzzleMove >= 2) return;

    const piece = game.get(squareName);

    if (selectedSquare === null) {
        if (!piece || piece.color !== "w") return;

        selectedSquare = squareName;
        showPossibleMoves(squareName);
        return;
    }

    // Allow selecting another white piece
    if (piece && piece.color === "w") {
        selectedSquare = squareName;
        showPossibleMoves(squareName);
        return;
    }

    const move = game.move({
        from: selectedSquare,
        to: squareName,
        promotion: "q"
    });

    selectedSquare = null;

    if (!move) {
        drawBoard();
        return;
    }

    // First move: Nf6+
    if (puzzleMove === 0) {

        if (move.san !== "Nf6+") {
            game.undo();
            drawBoard();
            chessMessage.textContent =
                "Not quite. Look for a forcing move. Try again.";
            return;
        }

        puzzleMove = 1;
        blackIsThinking = true;

        drawBoard();
        chessMessage.textContent =
            "Excellent move.Black's turn...";

        setTimeout(function() {

    const blackMove = game.move({
        from: "g8",
        to: "h8"
    });

    blackIsThinking = false;

    if (!blackMove) {
        drawBoard();

        chessMessage.textContent =
            "Black's reply failed. Please restart the challenge.";

        return;
    }

    drawBoard();

    chessMessage.textContent =
        "Black has moved. Now go for the winning strike...";

}, 900);

        return;
    }

    // Second move: Qxh7#
    if (puzzleMove === 1) {

        const isCheckmate = game.in_checkmate();

        if (move.san === "Qxh7#" && isCheckmate) {

        puzzleMove = 2;
drawBoard();

chessScreen.classList.add("victory");
letterButton.disabled = false
messageButton.disabled = false;
letterButton.textContent = "✉ The Hidden Letter";

chessStatus.textContent = "♛ CHECKMATE — YOU WON!";

chessMessage.textContent =
    "✦ YOU DID IT! ✦\n\n" +
    "Look at you, little genius! ♡\n\n" +
    "Two moves. One beautiful victory.\n" +
    "You've earned your next discovery.\n\n" +
    "And trust me... there's more waiting for you.";
        } else {

            game.undo();
            drawBoard();

            chessMessage.textContent =
                "not yet.Try again";
        }
    }
}

// Highlight legal destinations
function showPossibleMoves(squareName) {

    drawBoard();

    const squares = chessBoard.children;
    const legalMoves = game.moves({
        square: squareName,
        verbose: true
    });

    const files = "abcdefgh";

    squares[8 * (8 - Number(squareName[1])) +
        files.indexOf(squareName[0])]
        .classList.add("selected");

    legalMoves.forEach(function(move) {

        const index =
            8 * (8 - Number(move.to[1])) +
            files.indexOf(move.to[0]);

        squares[index].classList.add("possible-move");
    });
}

// Display the board when the script loads
drawBoard();

// HIDDEN LETTER COUNTDOWN

let letterTimer;
let revealTimeout;
let timeLeft = 120;

const waitingMessages = [
    "Patience, beautiful things take time.",
    "Still curious? I like that.",
    "You really want to know, don't you?",
    "Almost there... well, not quite. 😏"
];

function startLetterTimer() {
    clearInterval(letterTimer);

    timeLeft = 120;
  clearTimeout(revealTimeout);

envelope.classList.remove("opened");

envelopeTitle.textContent = "Your letter's sealed.";

envelopeText.textContent =
    "Some words are worth waiting for. ♡";

openLetterButton.hidden = true;

    timerDisplay.textContent = "02:00";
    timerProgress.style.width = "0%";

    sealedLetter.hidden = false;
    letterReveal.hidden = true;

    letterTimer = setInterval(function () {
        timeLeft--;

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        timerDisplay.textContent =
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");

        timerProgress.style.width =
            ((120 - timeLeft) / 120 * 100) + "%";

        if (timeLeft === 90) {
            timerMessage.textContent = waitingMessages[1];
        } else if (timeLeft === 60) {
            timerMessage.textContent = waitingMessages[2];
        } else if (timeLeft === 30) {
            timerMessage.textContent = waitingMessages[3];
        }

      if(timeLeft<=0) {
    clearInterval(letterTimer);

    timerMessage.textContent =
        "Your patience has paid off. ♡";

    timerDisplay.textContent = "UNLOCKED";

    envelopeTitle.textContent =
        "Your letter is ready.";

    envelopeText.textContent =
        "Go on, break the seal. ♡";

    openLetterButton.hidden = false;
      }

    }, 1000);
}

// Enter the letter
letterButton.addEventListener("click", function () {
    if (letterButton.disabled) return;

    adventureScreen.hidden = true;
    letterScreen.hidden = false;

    startLetterTimer();
});

// Leave the letter and reset everything
letterBackButton.addEventListener("click", function() {

    clearInterval(letterTimer);
    clearTimeout(revealTimeout);

    timeLeft = 120;

    timerDisplay.textContent = "02:00";
    timerMessage.textContent =
        "Patience, beautiful things take time.";

    timerProgress.style.width = "0%";

    envelope.classList.remove("opened");

    envelopeTitle.textContent = "Your letter is sealed.";
    envelopeText.textContent =
        "Some words are worth waiting for. ♡";

    openLetterButton.hidden = true;

    sealedLetter.hidden = false;
    letterReveal.hidden = true;

    letterScreen.hidden = true;
    adventureScreen.hidden = false;
});


openLetterButton.addEventListener("click", function() {
    envelope.classList.add("opened");

    openLetterButton.hidden = true;

    envelopeTitle.textContent = "For you, sweetheart.";

    envelopeText.textContent = "A little something from me. ♡";

    revealTimeout=setTimeout(function() {
        sealedLetter.hidden = true;
        letterReveal.hidden = false;
    }, 1100);
});
// OPEN PERSONAL MESSAGE
messageButton.addEventListener("click", function() {
    adventureScreen.hidden = true;
    messageScreen.hidden = false;
});

// RETURN TO ADVENTURE
messageBackButton.addEventListener("click", function() {
    messageScreen.hidden = true;
    adventureScreen.hidden = false;
});