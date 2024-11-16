
const gameBoard = document.querySelector(".board");
const gameRestart = document.querySelector(".reset");
const highScoreBox = document.querySelector("#high-score");
const currentScoreBox = document.querySelector("#score");
let lastRenderTime = 0;
let gameOver = false;
let currentScore = 0;
let highScore = 0;
let gridSize = 21;
let snakeSpeed = 5;
let gameStarted = true;
let snakeBody = [
    {x:10,y:10},
]
let food = randomFoodPosition();
let inputDirection = {x : 0, y : 0};
let lastInputDirection = {x:0, y:0};

const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const musicSound = new Audio('music/music.mp3');



//Main Loop to run every few milisecond
function main(currenttime){


    window.requestAnimationFrame(main);

    if((currenttime - lastRenderTime)/1000 < 1/snakeSpeed){
        return;
    }
    lastRenderTime = currenttime;
    
    if(gameStarted){
        gameEngine();
    }

}

//Main Function /******************************** */
function gameEngine(){
    // musicSound.play();

    //Collision Check of the snake with border or its own body
    checkCollision();
    

    // If you have eaten the food, increment the score and regenerate the food
    updateFood();

    //Move the Snake
    moveSnake();

    //Drawing all The Elements - Snake & Food
    drawSnake();
    drawFood();
}


//Game Functions:

//What will happen if collision occurs
function checkCollision(){
    if(isCollide(snakeBody)){
        gameOverSound.play();
        gameStarted = false;

        gameRestart.addEventListener('click', (e)=>{
            location.reload(true);
            return;
        //     inputDirection =  {x: 0, y: 0}; 
        //     snakeBody = [{x: 10, y: 10}];

        //     currentScore = 0; 
        //     currentScoreBox.innerHTML = currentScore;

        //     snakeSpeed = 5;
        //     food = randomFoodPosition();
        })

    }
}

function isCollide(snake){
    // If you bump into yourself 
    for (let i = 1; i < snakeBody.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // If you bump into the wall
    if(snake[0].x > gridSize || snake[0].x < 1 || snake[0].y > gridSize || snake[0].y < 1){
        return true;
    }

    return false;
}

function updateFood(){
    if(snakeBody[0].x === food.x && snakeBody[0].y === food.y){
        foodSound.play();
        
        //Update the Score
        updateScore();

        snakeSpeed += 0.5;

        snakeBody.unshift({x: snakeBody[0].x + inputDirection.x, y: snakeBody[0].y + inputDirection.y});

        //New Food Position
        let newFoodPosition;
        do{
            newFoodPosition = randomFoodPosition();
        }
        while(newFoodPosition == null || onSnake(newFoodPosition));
        food = newFoodPosition;
    }
}

//get a Random position in the grid
function randomFoodPosition(){
    return {
        x : Math.floor(Math.random() * gridSize) + 1,
        y : Math.floor(Math.random() * gridSize) + 1
    }
}

//checks whether the food on the snake body or not
function onSnake(item){
    // for (let i = 1; i < snakeBody.length; i++) {
    snakeBody.some((segment) =>{
        if(segment.x === item.x && segment.y === item.y){
            return true;
        }
    })
    return false;
}

function updateScore(){
    currentScore += 1;
    if(currentScore>highScore){
        highScore = currentScore;
        localStorage.setItem("HighScore", JSON.stringify(highScore));
        highScoreBox.innerHTML =  highScore;
    }
    currentScoreBox.innerHTML = currentScore;
}

function moveSnake(){
    inputDirection = getInputDirection();
    for (let i = snakeBody.length - 2; i>=0; i--) { 
        snakeBody[i+1] = {...snakeBody[i]};
    }

    snakeBody[0].x += inputDirection.x;
    snakeBody[0].y += inputDirection.y;
}


function drawSnake(){
    gameBoard.innerHTML = "";
    snakeBody.forEach((element, index)=>{
        let snakeElement = document.createElement("div");
        snakeElement.style.gridColumnStart = element.x;
        snakeElement.style.gridRowStart = element.y;

        // if(index == 0){
        //     snakeElement.classList.add("head");
        // }else{
        //     snakeElement.classList.add("snake");
        // }
        snakeElement.classList.add("snake");
        gameBoard.appendChild(snakeElement);

    })
}

function drawFood(){
    let foodElement = document.createElement("div");
    foodElement.style.gridColumnStart = food.x;
    foodElement.style.gridRowStart = food.y;

    foodElement.classList.add("food");
    
    gameBoard.appendChild(foodElement);
}



//Set High Score to Local Storage
let hiscore = localStorage.getItem("HighScore");
if(hiscore === null){
    highScore = 0;
    localStorage.setItem("HighScore", JSON.stringify(highScore))
}
else{
    highScore = JSON.parse(hiscore);
    highScoreBox.innerHTML = hiscore;
}


//For looping
window.requestAnimationFrame(main);


//Getting the direction according to the keypress
window.addEventListener('keydown', (e)=>{
    switch(e.key) {
        case 'ArrowUp':
            if(lastInputDirection.y !== 0) break;
            inputDirection.x = 0;
            inputDirection.y = -1;
            break;
        case 'ArrowDown':
            if(lastInputDirection.y !== 0) break;
            inputDirection.x = 0;
            inputDirection.y = 1;
            break;
        case 'ArrowRight':
            if(lastInputDirection.x !== 0) break;
            inputDirection.x = 1;
            inputDirection.y = 0;
            break;
        case 'ArrowLeft':
            if(lastInputDirection.x !== 0) break;
            inputDirection.x = -1;
            inputDirection.y = 0;
            break;
        default:
            break;
    }

})
function getInputDirection(){
    lastInputDirection = inputDirection;
    return inputDirection;
}
