// Function to handle the click event of the start button
function handleStartButtonClick() {
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', function() {
        startGame();
    });
}

// Start game function
function startGame() {
    // Hide the instructions and start button
    document.querySelector('.instructions').style.display = 'none';
    document.getElementById('difficulty').style.display = 'none';
    document.getElementById('start-button').style.display = 'none';

    // Show the game area
    document.querySelector('.gameArea').style.display = 'block';

    // Initialize the game
    initializeGame();
}

// Function to initialize the game
function initializeGame() {
    // Initialize game variables
    let comboCount = 0; // Combo counter (star count)
    let gameTimer = 30; // Game timer (in seconds)
    let gameOver = false; // Game over flag

    // Display initial combo count and game timer
    updateComboCount(comboCount);
    updateGameTimer(gameTimer);

    // Start game loop
    const gameLoopInterval = setInterval(function() {
        // Update game timer
        gameTimer--;
        updateGameTimer(gameTimer);

        // Check if game over condition is met
        if (gameTimer <= 0 || gameOver) {
            clearInterval(gameLoopInterval); // Stop the game loop
            endGame(); // End the game
        }

        // Generate falling stars
        generateFallingStars();
    }, 1000); // Update every second
}

// Function to generate falling stars
function generateFallingStars() {
    // Get game area dimensions
    const gameArea = document.querySelector('.gameArea');
    const gameAreaWidth = gameArea.clientWidth;
    const gameAreaHeight = gameArea.clientHeight;

    // Create a new star element
    const star = document.createElement('div');
    star.classList.add('star');
    
    // Set random position for the star within the game area
    const randomX = Math.floor(Math.random() * gameAreaWidth);
    const randomY = -50; // Start above the game area
    star.style.left = `${randomX}px`;
    star.style.top = `${randomY}px`;

    // Append the star to the game area
    gameArea.appendChild(star);

    // Animate the falling star
    animateFallingStar(star);
}

// Function to animate the falling star
function animateFallingStar(star) {
    const gameAreaHeight = document.querySelector('.gameArea').clientHeight;
    const animationDuration = 3000; // 3 seconds for star to reach bottom

    // Use CSS animation to move the star from top to bottom of the game area
    star.style.animation = `falling-star ${animationDuration}ms linear`;

    // Remove the star from the game area after the animation ends
    setTimeout(() => {
        star.remove();
    }, animationDuration);
}

// Call the function to handle the start button click
handleStartButtonClick();


// Function to update the combo count display
function updateComboCount(count) {
    document.getElementById('star-count').textContent = count;
}

// Function to update the game timer display
function updateGameTimer(time) {
    document.getElementById('game-timer').textContent = time;
}

// Function to end the game
function endGame() {
    // Show game over screen
    document.getElementById('game-over').style.display = 'block';
}

// Function to handle keydown events
function handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (key === 'd' || key === 'f' || key === 'j' || key === 'k') {
        collectStar(key);
    }
}

// Function to collect a falling star
function collectStar(key) {
    // Get all falling stars currently in the game area
    const fallingStars = document.querySelectorAll('.star');

    // Loop through each falling star
    fallingStars.forEach(star => {
        const starPositionX = parseInt(star.style.left);
        const laneWidth = document.querySelector('.gameArea').clientWidth / 4;
        const lane = Math.floor(starPositionX / laneWidth); // Determine which lane the star is in

        // Check if the pressed key matches the lane and star is within collection range
        if ((key === 'd' && lane === 0) || (key === 'f' && lane === 1) || (key === 'j' && lane === 2) || (key === 'k' && lane === 3)) {
            // Collect the star
            star.remove();
            // Update combo count
            updateComboCount(parseInt(document.getElementById('star-count').textContent) + 1);
        }
    });
}

// Add event listener for keydown events
document.addEventListener('keydown', handleKeyDown);



// Call the function to handle the start button click
handleStartButtonClick();
