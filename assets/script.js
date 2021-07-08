/******************************************************
 ***** DECLARATIONS ***********************************
 ******************************************************
 */

const score = { current: 0, top: 0 };
const sounds = {
    food: new Audio('./assets/music/food.mp3'),
    gameOver: new Audio('./assets/music/gameover.mp3'),
    move: new Audio('./assets/music/move.mp3'),
    music: new Audio('./assets/music/Streets_of_Desolation.m4a')
};
let inputDir = { x: 0, y: 0 };
let speed = 3;
let vol = 0.25;
let prevTime = 0;
let snakeArr = [{ x: randomNumber(2, 19), y: randomNumber(2, 19) }];
let food = { x: randomNumber(8, 8), y: randomNumber(8, 8) };
let pause = false;

init();


/******************************************************
 ***** MODAL LOGICS (from W3Schools) ******************
 ******************************************************
 */

// Get the modal
const modal = document.getElementById("modal");

// Get the element that closes the modal
const closeIcon = document.getElementById("closeIcon");
const startBtn = document.getElementById("startBtn");

// When the user clicks on x, close the modal
closeIcon.onclick = function () {
    modal.style.display = "none";
    window.requestAnimationFrame(main); // starts the game
};

// When the user clicks on close button, close the modal
startBtn.onclick = function () {
    modal.style.display = "none";
    window.requestAnimationFrame(main); // starts the game
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        window.requestAnimationFrame(main); // starts the game
    }
};


/******************************************************
 ***** GAME LOGICS ************************************
 ******************************************************
 */

// Init function
function init() {
    sounds.music.play();
    let topScore = localStorage.getItem("TopScore");
    if (topScore === null)
        localStorage.setItem("TopScore", score.top);
    else {
        score.top = topScore;
        hiScore.innerHTML = "HiScore: " + score.top;
    }
    flexDirection();
}

// MAIN function
function main(time) {
    window.requestAnimationFrame(main);
    if ((time - prevTime) / 1000 < (1 / speed))
        return;
    prevTime = time;
    refreshGame(pause);
}

function checkPath(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x > 20 || snake[0].x < 0 || snake[0].y > 20 || snake[0].y < 0) {
        return true;
    }
    return false;
}

function refreshGame() {
    if (!pause) {
        // Part 1: Updating the snake array & Food
        if (checkPath(snakeArr)) {
            sounds.gameOver.play();
            sounds.music.pause();
            inputDir = { x: 0, y: 0 };
            alert("Game Over. Press any key to play again!");
            snakeArr = [{ x: randomNumber(1, 20), y: randomNumber(1, 20) }];
            food = { x: randomNumber(1, 20), y: randomNumber(1, 20) };
            sounds.music.play();
            score.current = 0;
        }
        // If you have eaten the food, increment the score and regenerate the food
        if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
            sounds.food.play();
            score.current += 1;
            if (score.current > score.top) {
                score.top = score.current;
                localStorage.setItem("TopScore", score.top);
                hiScore.innerHTML = "HiScore: " + score.top;
            }
            currScore.innerHTML = "Score: " + score.current;
            snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
            food = { x: randomNumber(1, 20), y: randomNumber(1, 20) };
        }
        // Moving the snake
        for (let i = snakeArr.length - 2; i >= 0; i--) {
            snakeArr[i + 1] = { ...snakeArr[i] };
        }
        snakeArr[0].x += inputDir.x;
        snakeArr[0].y += inputDir.y;
        // Part 2: Display the snake and Food
        // Display the snake
        game.innerHTML = "";
        snakeArr.forEach((e, index) => {
            snakeElement = document.createElement('div');
            snakeElement.style.gridRowStart = e.y;
            snakeElement.style.gridColumnStart = e.x;
            if (index === 0)
                snakeElement.classList.add('snake', 'head');
            else
                snakeElement.classList.add('snake', 'body');
            game.appendChild(snakeElement);
        });
        // Display the food
        foodElement = document.createElement('div');
        foodElement.style.gridRowStart = food.y;
        foodElement.style.gridColumnStart = food.x;
        foodElement.classList.add('food');
        game.appendChild(foodElement);
    }
}

function randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function flexDirection() {
    placeholder.style.cssText = window.innerWidth / window.innerHeight > 1 ? 'flex-direction: row;' : 'flex-direction: column;';
}

/******************************************************
 ***** CLICK EVENTS ***********************************
 ******************************************************
 */

speedRange.onclick = function () {
    speed = parseInt(speedRange.value);
    currSpeed.innerHTML = 'Speed (1-25): ' + speed;
    pause = true;
    sounds.music.pause();
    pauseResume.innerHTML = 'RESUME!';
};

volRange.onclick = function () {
    vol = parseInt(volRange.value);
    currVol.innerHTML = 'Volume (1-100): ' + vol;
    Object.keys(sounds).forEach(key => {
        sounds[key].volume = vol / 100;
    });
    pause = true;
    sounds.music.pause();
    pauseResume.innerHTML = 'RESUME!';
};

pauseResume.onclick = function () {
    pause = !pause;
    pauseResume.innerHTML = pause ? sounds.music.pause() : sounds.music.play();
    pauseResume.innerHTML = pause ? 'RESUME!' : 'PAUSE!';
};

/******************************************************
 ***** WINDOW EVENTS **********************************
 ******************************************************
 */

window.onresize = function () {
    flexDirection();
};

window.addEventListener('keydown', e => {
    // Set the direction of the snake
    inputDir = { x: 0, y: 1 };
    sounds.move.play();
    // Change the direction based on controls
    switch (e.key) {
        case "ArrowUp":
        case "W":
        case "w":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
        case "S":
        case "s":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
        case "A":
        case "a":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
        case "D":
        case "d":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        case " ":
            pause = !pause;
            inputDir = { x: 0, y: 0 };
            pauseResume.innerHTML = pause ? 'RESUME!' : 'PAUSE!';
            break;
        default:
            break;
    }
});