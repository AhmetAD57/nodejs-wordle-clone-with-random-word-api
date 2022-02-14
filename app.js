const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".key-container");
const messageDisplay = document.querySelector(".message-container");

let wordle;

const getWordle = _ =>{
    fetch("http://localhost:8000/word")
    .then(response => response.json())
    .then(json => {
        console.log(json);
        wordle = json.toUpperCase();
    })
    .catch(err => console.log(err));
}

getWordle();

let currentRow = (currentTile = 0);
let isGameOver = false;
const guessRows = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
];

const keys = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "ENTER",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "«",
];

//For tile display
guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement("div");
    rowElement.setAttribute("id", "guessRow-" + guessRowIndex);

    guessRow.forEach((tile, tileIndex) => {
        const tileElement = document.createElement("div");
        tileElement.setAttribute(
            "id",
            "guessRow-" + guessRowIndex + "-tile-" + tileIndex
        );
        tileElement.classList.add("tile");

        rowElement.append(tileElement);
    });

    tileDisplay.append(rowElement);
});

//For keyboard
keys.forEach((key) => {
    const buttonElement = document.createElement("button");
    buttonElement.textContent = key;
    buttonElement.setAttribute("id", key);
    buttonElement.addEventListener("click", (_) => handleClick(key));

    keyboard.append(buttonElement);
});

const handleClick = (letter) => {
    if (letter === "«") {
        deleteLetter();
        return;
    }

    if (letter === "ENTER") {
        checkRow();
        return;
    }

    console.log("clicked ", letter);
    addLetter(letter);
};

//For letter adding
const addLetter = (letter) => {
    if (currentTile < 5 && currentRow < 6) {
        const tile = document.getElementById(
            "guessRow-" + currentRow + "-tile-" + currentTile
        );
        tile.textContent = letter;

        guessRows[currentRow][currentTile] = letter;
        tile.setAttribute("data", letter);

        console.log("guessRows", guessRows);
        currentTile++;
    }
};

const deleteLetter = (_) => {
    if (currentTile > 0) {
        currentTile--;
        const tile = document.getElementById(
            "guessRow-" + currentRow + "-tile-" + currentTile
        );

        tile.textContent = "";
        tile.setAttribute("data", "");

        guessRows[currentRow][currentTile] = "";
    }
};

const checkRow = (_) => {
    if (currentTile > 4) {
        const guess = guessRows[currentRow].join("");
        flipTile();
        if (guess === wordle) {
            showMessage("Magnificent");
            isGameOver = true;
            return;
        } else {
            if (currentRow >= 5) {
                isGameOver = false;
                showMessage("Game Over");
                return;
            }
            if (currentRow < 5) {
                currentRow++;
                currentTile = 0;
            }
        }
    }
    console.log("ct ", currentTile, " cr ", currentRow);
};

const showMessage = (message) => {
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageDisplay.append(messageElement);

    setTimeout((_) => messageDisplay.removeChild(messageElement), 2000);
};

const addColorToKey = (keyLetter, color) => {
   const key = document.getElementById(keyLetter);
    key.classList.add(color);
}


const flipTile = (_) => {
    const rowTiles = document.querySelector("#guessRow-" + currentRow).childNodes;

    let checkWordle = wordle;
    const guess = [];
    rowTiles.forEach(tile => {
        guess.push({letter: tile.getAttribute("data"), color: "grey-overlay"});
    });

    guess.forEach((guess, index) => {
        if(guess.letter == wordle[index]){
            guess.color = "green-overlay";
            checkWordle = checkWordle.replace(guess.letter, "");

        }
    });

    guess.forEach((guess, index) => {
        if(checkWordle.includes(guess.letter)){
            guess.color = "yellow-overlay";
            checkWordle = checkWordle.replace(guess.letter, "");

        }
    });


    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add("flip");
            tile.classList.add(guess[index].color);
            addColorToKey(guess[index].letter, guess[index].color);

        }, 500 * index);
    });
};
