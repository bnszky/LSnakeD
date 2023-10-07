//main settable variables
const SNAKE_SPEED = 30;
//board is in the shape of square so WIDTH=HEIGHT to provide the best game appearance
const WIDTH = 16;
const HEIGHT = 16;
//FRAMES indicates how often board changes color HIGHER VAL = SLOW TRANSITIONS
const FRAMES = 1;

let score;
let t;
let scoreDiv;
let board;

let snake_body = [];

//LSD colors for game
let colors = ["#ffeb00", "#fc0019", "#01ff4f", "#ff01d7", "#5600cc", "#00edf5"];

let current_frame = 0;

let fruit = {x: 0, y: 0};

let direction = "TOP";
let prev_move = "";
let blocked_move = "";

//controls
window.addEventListener('keydown', function(event) {
    switch (event.key) {
      case 'w':
      case 'W':
        direction = "TOP";
        break;
      case 'a':
      case 'A':
        direction = "LEFT";
        break;
      case 's':
      case 'S':
        direction = "BOT";
        break;
      case 'd':
      case 'D':
        direction = "RIGHT";
        break;
    }
});

//additional func for random integer
function randomVal(a, b){
    return a+Math.floor(Math.random()*(b-a));
}

//generating new objects
function generateFruit(){
    places = [];
    for(let x = 1; x <= WIDTH; x++){
        for(let y = 1; y <= HEIGHT; y++){
            if(!snake_body.some(obj => obj.x == x && obj.y == y)){
                places.push({x: x, y: y});
            }
        }
    }

    console.log("RANDOM: " + randomVal(0, places.length-1));

    console.log(places.length + "-" + score);
    fruit = places[randomVal(0, places.length-1)];
    console.log("FRUIT: " + fruit.x + "| " + fruit.y);
}

function getPercentValue(a){
    let b = WIDTH*HEIGHT;
    let percent = a/b * 100;
    return percent.toFixed(2);
}

function endGame(){
    if(window.confirm("You lost! Your score: " + score + ". Your snake covered " + getPercentValue(score) + "% of board!")) {
        location.reload();
    }
}

//logic for one frame
function logic(){
    if(direction == blocked_move){
        direction = prev_move;
    } 

    var head = {...snake_body[snake_body.length-1]};

    switch (direction) {
        case 'TOP':
            head.y--;
            blocked_move = "BOT";
            break;
        case 'BOT':
            head.y++;
            blocked_move = "TOP";
            break;
        case 'RIGHT':
            head.x++;
            blocked_move = "LEFT";
            break;
        case 'LEFT':
            head.x--;
            blocked_move = "RIGHT";
            break;
    }

    prev_move = direction;
    if(snake_body.some(obj => obj.x == head.x && obj.y == head.y)){
        endGame();
    }
    snake_body.push(head);
    if(head.x <= 0 || head.x > WIDTH || head.y > HEIGHT || head.y <= 0){
        endGame();
    }
    else if(head.x == fruit.x && head.y == fruit.y){
        score ++;
        scoreDiv.innerHTML = "SCORE: " + score;
        generateFruit();
    }
    else {
        snake_body.shift(); 
    } 
    
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

//drawing func
function draw(){
    board.innerHTML = "";
    scoreDiv.style.color = colors[1];
    board.style.backgroundColor = colors[1];
    console.log(snake_body);
    snake_body.forEach(segment => {
        let snakeSegment = document.createElement('div');
        snakeSegment.style.gridColumnStart = segment.x;
        snakeSegment.style.gridRowStart = segment.y;
        snakeSegment.classList.add("snake");
        snakeSegment.style.backgroundColor = colors[0];
        board.appendChild(snakeSegment);
    });
    let fruitSegment = document.createElement('div');
    fruitSegment.style.gridColumnStart = fruit.x;
    fruitSegment.style.gridRowStart = fruit.y;
    fruitSegment.classList.add("fruit");
    fruitSegment.style.backgroundColor = colors[2];
    board.appendChild(fruitSegment);

    current_frame++;
    if(current_frame >= FRAMES){
        colors = shuffle(colors);
        current_frame = 0;
    }
}

function update(){
    t++;
    if(t >= 500/SNAKE_SPEED){
        logic();
        draw();
        t = 0;
    }

    requestAnimationFrame(update);
}

function restart(){

    board = document.getElementById("board");
    board.style.gridTemplateColumns = "repeat(" + WIDTH + ", 1fr)";
    board.style.gridTemplateRows = "repeat(" + HEIGHT + ", 1fr)";

    current_frame = 0;
    fruit = {x: 0, y: 0};
    direction = "TOP";
    prev_move = "";
    blocked_move = "";
    t = 0;
    score = 1;

    scoreDiv = document.getElementById("score");
    scoreDiv.innerHTML = "SCORE: " + score;

    snake_body = [];
    snake_body.push({x: Math.floor(WIDTH/2), y: Math.floor(HEIGHT/2)});

    generateFruit();

    colors = shuffle(colors);
    update();
}

restart();