// board 
let board; 
let boardWidth = 360; 
let boardHeight = 640; 
let context; 

//bird 

let birdWidth = 130; 
let birdHeight = 91; 
let birdX = boardWidth/8;
let birdY = boardHeight/2; 

let bird = {
    x : birdX, 
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes 
let pipeArray = [];
let pipeWidth = 32;
let pipeHeight = 85; 
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;

let bertaArray = [];
let bertaWidth = 100;
let bertaHeight = 88; 
let bertaX = boardWidth * 2;
let bertaY = 0; 

let bertaImg;

let deerArray = [];
let deerWidth = 100;
let deerHeight = 88; 
let deerX = boardWidth * 3;
let deerY = 0; 

let deerImg;

//physics 
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // draw flappy bird 
    //context.fillStyle = "green";
    //context.fillRect(bird.x, bird.y, bird.width, bird.height)

    //load images 
    birdImg = new Image ();
    birdImg.src = "./images/flappybird.png"; 
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./images/monkey.png";

    bertaImg = new Image();
    bertaImg.src = "./images/berta.png";

    deerImg = new Image();
    deerImg.src = "./images/deer.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 4100);
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird 
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes 
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 1;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)){
            gameOver = true;
        }
    }

    for (let i = 0; i < bertaArray.length; i++) {
        let berta = bertaArray[i];
        berta.x += velocityX;
        context.drawImage(berta.img, berta.x, berta.y, berta.width, berta.height);

        if (!berta.passed && bird.x > berta.x + berta.width) {
            score += 1;
            berta.passed = true;
        }

        if (detectCollision(bird, berta)){
            gameOver = true;
        }
    }

    for (let i = 0; i < deerArray.length; i++) {
        let deer = deerArray[i];
        deer.x += velocityX;
        context.drawImage(deer.img, deer.x, deer.y, deer.width, deer.height);

        if (!deer.passed && bird.x > deer.x + deer.width) {
            score += 1;
            deer.passed = true;
        }

        if (detectCollision(bird, deer)){
            gameOver = true;
        }
    }

    //score 
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 43, 300);
    }

    context.fillText("BALI 2023", 80, 45);
}

//clear pipes 
while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
}

while (bertaArray.length > 0 && bertaArray[0].x < -bertaWidth) {
    bertaArray.shift();
}

while (deerArray.length > 0 && deerArray[0].x < -deerWidth) {
    deerArray.shift();
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY + boardHeight/2 - Math.random()*(boardHeight/2);
    let randomBertaY = bertaY + boardHeight/2 - Math.random()*(boardHeight/2);
    let randomDeerY = deerY + boardHeight/2 - Math.random()*(boardHeight/2);
    //let openingSpace = board.height/4; 

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width: pipeWidth,
        height :pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);

    let berta = {
        img : bertaImg,
        x : bertaX,
        y : randomBertaY,
        width: bertaWidth,
        height :bertaHeight,
        passed : false
    }

    bertaArray.push(berta);

    let deer = {
        img : deerImg,
        x : deerX,
        y : randomDeerY,
        width: deerWidth,
        height :deerHeight,
        passed : false
    }

    deerArray.push(deer);

}

// Function to handle touch events
function touchHandler(event) {
    // Prevent the default touch behavior (e.g., scrolling)
    event.preventDefault();

    // Jump when the screen is touched
    velocityY = -6;

    // Reset the game if it's over
    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        bertaArray = [];
        deerArray = [];
        score = 0;
        gameOver = false;
    }
}

// Add a touch event listener to the document
document.addEventListener('touchstart', touchHandler, false);

// Add a click event listener to the document for desktop compatibility
document.addEventListener('click', touchHandler, false);


function moveBird(e) {
    if (e.code == "space" || e.code == "ArrowUp" || e.code == "keyX") {
        //jump 
        velocityY = -6;

        //reset game 
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            bertaArray = [];
            deerArray = [];
            score = 0; 
            gameOver = false;
        }
    }
}

// Add a keyboard event listener to the document (optional)
document.addEventListener('keydown', moveBird, false);

function detectCollision(a,b) {
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}
