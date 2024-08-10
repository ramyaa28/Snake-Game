const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 32;
canvas.width = 16 * box;
canvas.height = 16 * box;

let snake = [];
snake[0] = {
    x: 8 * box,
    y: 8 * box
};

let food = generateFood();
let obstacles = generateObstacles(5); 
let score = 0;
let level = 1;
let d;
let game;
let isPaused = false;

const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');
const powerUpSound = document.getElementById('powerUpSound');

document.addEventListener('keydown', direction);
document.addEventListener('keydown', pauseGame);

function direction(event) {
    if (event.keyCode == 37 && d != 'RIGHT') {
        d = 'LEFT';
    } else if (event.keyCode == 38 && d != 'DOWN') {
        d = 'UP';
    } else if (event.keyCode == 39 && d != 'LEFT') {
        d = 'RIGHT';
    } else if (event.keyCode == 40 && d != 'UP') {
        d = 'DOWN';
    }
}

function pauseGame(event) {
    if (event.keyCode == 32) { 
        togglePause();
    }
}

function togglePause() {
    if (isPaused) {
        game = setInterval(draw, 100 - level * 5);
        document.getElementById('pauseBtn').innerText = 'Pause';
    } else {
        clearInterval(game);
        document.getElementById('pauseBtn').innerText = 'Resume';
    }
    isPaused = !isPaused;
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * 16) * box,
        y: Math.floor(Math.random() * 16) * box,
        type: Math.random() < 0.8 ? 'normal' : 'special' 
    };
}

function generateObstacles(count) {
    let obstacles = [];
    for (let i = 0; i < count; i++) {
        let obstacle = {
            x: Math.floor(Math.random() * 16) * box,
            y: Math.floor(Math.random() * 16) * box
        };
        obstacles.push(obstacle);
    }
    return obstacles;
}

function collision(newHead, array) {
    for (let i = 0; i < array.length; i++) {
        if (newHead.x == array[i].x && newHead.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function restartGame() {
    clearInterval(game);
    snake = [{ x: 8 * box, y: 8 * box }];
    food = generateFood();
    obstacles = generateObstacles(5);
    score = 0;
    level = 1;
    d = null;
    isPaused = false;
    document.getElementById('score').innerText = score;
    document.getElementById('level').innerText = level;
    document.getElementById('pauseBtn').innerText = 'Pause';
    game = setInterval(draw, 100);
}

function levelUp() {
    level++;
    document.getElementById('level').innerText = level;
    clearInterval(game);
    obstacles.push(...generateObstacles(3)); 
    game = setInterval(draw, 100 - level * 5);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? '#1abc9c' : '#ecf0f1';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = '#2c3e50';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = (food.type == 'normal') ? '#e74c3c' : '#f1c40f';
    ctx.fillRect(food.x, food.y, box, box);

    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillStyle = '#34495e';
        ctx.fillRect(obstacles[i].x, obstacles[i].y, box, box);
        ctx.strokeStyle = '#2c3e50';
        ctx.strokeRect(obstacles[i].x, obstacles[i].y, box, box);
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == 'LEFT') snakeX -= box;
    if (d == 'UP') snakeY -= box;
    if (d == 'RIGHT') snakeX += box;
    if (d == 'DOWN') snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score += (food.type == 'normal') ? 1 : 5;
        eatSound.play();
        if (food.type == 'special') powerUpSound.play();
        food = generateFood();
        if (score % 5 == 0) {
            levelUp();
        }
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake) || collision(newHead, obstacles)) {
        clearInterval(game);
        gameOverSound.play();
        alert('Game Over! Your score was: ' + score);
    }

    snake.unshift(newHead);

    document.getElementById('score').innerText = score;
}

game = setInterval(draw, 100);

