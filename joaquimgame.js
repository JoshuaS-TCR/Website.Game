//bord
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

//speler
let playerWidth = 70;
let playerHeight = 10;
let playerVelocityX = 20; //elke keer 20 pixels verplaatst

let player = {
    x: boardWidth / 2 - playerWidth / 2,
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX: playervelocityX
}

//ball
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 2; // Verminderde snelheid, beweeg 2 pixel per keer
let ballVelocityY = 1; // Verminderde snelheid, beweegt 1 pixels per keer

let ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY
}

//blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8; 
let blockRows = 3; //voegt elke keer meer blokken hoe verder je komt
let blockMaxRows = 10; //limiet aan hoeveel rijen er mogen zijn
let blockCount = 0;

//startblokken bovenhoek links
let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //beginspeler tekenen
    context.fillStyle="skyblue";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);

    //blokken maken
    createBlocks();
}

function update() {
    requestAnimationFrame(update);
    //stoppen met tekenen
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // speler
    context.fillStyle = "blue";
    context.fillRect(player.x, player.y, player.width, player.height);

    // bal
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    //stuiter de bal van de spelerspeddel
    if (topCollision(ball, player) || bottomcollision(ball, player)) {
        ball.velocityY *= -1;   //draai de y-richting omhoog of omlaag
    }
    else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1;   //draai de x-richting naar links of rechts
    }

    if (ball.y <= 0) { 
        //als de bal de bovenkant van het canvas raakt
        ball.velocityY *= -1; //tegengestelde richting
    }
    else if (ball.x <= 0 || (ball.x + ball.width >= bardWidth)) {
        //als de bal links of rechts het canvas raakt
        ball.velocityX *= -1; //tegengestelde richting
    }
    else if (ball.y + ball.height >= boardHeight) {
        //als de bal de onderkant van het canvas raakt
        context.font = "20px sans-serif";
        context.fillText("Game Over: Press 'Space' to Restart", 80, 400);
        gameOver = true;
    }

    //blokken
    Style = "skyblue";
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                block.break = true;     // blok is kapot
                ball.velocityY *= -1;   //draai de y-richting omhoog of omlaag
                score += 100;
                blockCount -= 1;
            }
            else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                block.break = true;     // blok is kapot
                ball.velocityX *= -1;   //draai de x-richting naar links of rechts
                score += 100;
                blockCount -= 1;
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    //volgende level
    if (blockCount == 0) {
        score += 100*blockRows*blockColumns; //bonus punten :)
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        createBlocks();
    }

    //score
    context.font = "20px sans-serif";
    context.fillText(score, 10, 25);
}

function outOfBounds(xPosition) {
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}

function movePlayer(e) {
    if (gameOver) {
        if (e.code == "Space") {
            resetGame();
            console.log("RESET");
        }
        return;
    }
    if (e.code == "ArrowLeft") {
        //speler.x -= speler.velocityX;
        let nextplayerX = player.x - player.velocityX;
        if (!outOfBounds(nextplayerX)) {
            player.x = nextplayerX;
        }
    }
    else if (e.code == "ArrowRight") {
        let nextplayerX = player.x + player.velocityX;
        if (!outOfBounds(nextplayerX)) {
            player.x = nextplayerX;
        }
        // speler.x += speler.velocityX; 
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //de linkerbovenhoek van a bereikt de rechterbovenhoek van b niet
           a.x + a.width > b.x &&   //de rechterbovenhoek van a passeert de linkerbovenhoek van b
           a.y < b.y + b.height &&  //de linkerbovenhoek van a bereikt de linkeronderhoek van b niet
           a.y + a.height > b.y;    //de linkerbenedenhoek van a passeert de linkerbovenhoek van b
}

function topCollision(ball, block) { //a is boven b (bal ligt boven blok)
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(bal, cock) { //a is boven b (bal bevindt zich onder blok)
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftCollision(ball, block) { //a bevindt zich links van b (bal bevindt zich links van blok)
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) { //a staat rechts van b (bal ligt rechts van blok)
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

function createBlocks() {
    blockArray = []; //wis blockArray
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x : blockX + c*blockWidth + c*10, //c*10 kolommen met een tussenruimte van 10 pixels
                y : blockY + r*blockHeight + r*10, //r*10 rijen met een afstand van 10 pixels uit elkaar
                width : blockWidth,
                height : blockHeight,
                break : false
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

function dilo() {
    gameOver = true;
    player = {
        x : boardWidth/2 - playerWidth/2,
        y : boardHeight - playerHeight - 5,
        width: playerWidth,
        height: playerHeight,
        velocityX : playerVelocityX
    }
    ball = {
        x : boardWidth/2,
        y : boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX : ballVelocityX,
        velocityY : ballVelocityY
    }
    blockArray = [];
    blockRows = 3;
    score = 0;
    createBlocks();
}
