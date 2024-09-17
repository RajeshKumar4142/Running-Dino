const dino = document.getElementById('dino');
const gameArea = document.getElementById('game-area');
const startBtn = document.getElementById('start-btn');

let isJumping = false;
let gravity = 0.9;
let isGameOver = false;
let obstacleInterval;

// Start game when clicking the button
startBtn.addEventListener('click', startGame);

// Touch and Keydown support for jump
function addJumpControl() {
  // Keydown event for desktop
  document.addEventListener('keydown', jump);

  // Touch event for mobile
  gameArea.addEventListener('touchstart', jump);
}

// Jumping mechanism for the dino
function jump() {
  if (isJumping) return;
  let position = 0;
  isJumping = true;

  // Move up
  let upInterval = setInterval(() => {
    if (position >= 150) {
      clearInterval(upInterval);

      // Move down
      let downInterval = setInterval(() => {
        if (position <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        }
        position -= 5;
        position = position * gravity;
        dino.style.bottom = position + 'px';
      }, 20);
    }
    position += 20;
    dino.style.bottom = position + 'px';
  }, 20);
}

// Start the game
function startGame() {
  if (isGameOver) return;
  
  isGameOver = false;
  startBtn.style.display = 'none';
  
  addJumpControl();
  
  obstacleInterval = setInterval(createObstacle, 2000);
}

// Create obstacles that move toward the dino
function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  gameArea.appendChild(obstacle);
  let obstaclePosition = gameArea.offsetWidth;

  // Move obstacle to the left
  let obstacleMoveInterval = setInterval(() => {
    // Collision detection: Check if the dino and obstacle overlap
    if (obstaclePosition > 50 && obstaclePosition < 90 && dino.getBoundingClientRect().bottom >= obstacle.getBoundingClientRect().top) {
      clearInterval(obstacleMoveInterval);
      gameOver();
    }

    obstaclePosition -= 5;
    obstacle.style.left = obstaclePosition + 'px';

    // Remove obstacle once it's off-screen
    if (obstaclePosition <= -20) {
      clearInterval(obstacleMoveInterval);
      gameArea.removeChild(obstacle);
    }
  }, 20);
}

// Game over logic
function gameOver() {
  isGameOver = true;
  document.removeEventListener('keydown', jump);
  gameArea.removeEventListener('touchstart', jump);
  clearInterval(obstacleInterval);
  alert('Game Over! Refresh to play again.');
}
