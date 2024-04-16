let comboCount = 0;

// Function to handle the click event of the start button
function handleStartButtonClick() {
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', function() {
        startGame();
    });
}

// Function to handle the click event of the restart button
function handleRestartButtonClick() {
    const restartButton = document.getElementById('restart-button');
    restartButton.addEventListener('click', function() {
        resetGame();
    });
}

// Start game function
function startGame() {
    // Hide the instructions, game info, and start button
    document.querySelector('.instructions').style.display = 'none';
    document.getElementById('difficulty').style.display = 'none';
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('game-info').style.display = 'none';

    // Show the game area
    document.querySelector('.gameArea').style.display = 'block';

    // Reset combo count
    comboCount = 0;
    updateComboCount(comboCount);

    // Start the game
    initializeGame();
}

// Reset game function
function resetGame() {
    // Show the instructions, difficulty selector, and start button
    document.querySelector('.instructions').style.display = 'block';
    document.getElementById('difficulty').style.display = 'block';
    document.getElementById('start-button').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('victory').style.display = 'none';

    // Clear game area
    document.querySelector('.gameArea').innerHTML = '';

    // Reset combo count
    comboCount = 0;
    updateComboCount(comboCount);
}

// Function to initialize the game
function initializeGame() {
    // Initialize game variables
    let gameTimer = 30; // Game timer (in seconds)

    // Display initial combo count and game timer
    updateComboCount(comboCount);
    updateGameTimer(gameTimer);

    // Start game timer
    const gameTimerInterval = setInterval(function() {
        gameTimer--;
        updateGameTimer(gameTimer);
        if (gameTimer === 0) {
            endGame();
            clearInterval(gameTimerInterval);
        }
    }, 1000); // Update every second

    // Generate falling stars
    generateFallingStars();
}

// Function to generate falling stars
function generateFallingStars() {
    // Get game area dimensions
    const gameArea = document.querySelector('.gameArea');
    const gameAreaWidth = gameArea.clientWidth;
    const gameAreaHeight = gameArea.clientHeight;

    // Start generating stars
    const starGeneratorInterval = setInterval(function() {
        // Get a random position within the width of the game area
        const randomX = Math.floor(Math.random() * (gameAreaWidth - 20)); // Subtracting star width to prevent stars from appearing partially outside the game area

        // Create a new star element
        const star = document.createElement('div');
        star.classList.add('star');

        // Set random position for the star within the game area
        const randomY = Math.floor(Math.random() * (gameAreaHeight - 50)); // Subtracting star height to prevent stars from appearing partially outside the game area
        star.style.left = `${randomX}px`;
        star.style.top = `${randomY}px`;

        // Append the star to the game area
        gameArea.appendChild(star);

        // Animate the falling star
        animateFallingStar(star);

        // Remove the star after animation
        setTimeout(() => {
            star.remove();
        }, 2000); // Remove after 2 seconds
    }, 1000); // Generate a new star every second
}

// Function to animate the falling star
function animateFallingStar(star) {
    const gameAreaHeight = document.querySelector('.gameArea').clientHeight;

    // Use CSS animation to move the star from top to bottom of the game area
    star.style.animation = `falling-star 2s linear`;

    // Set a timeout to remove the star after animation ends
    setTimeout(() => {
        star.remove();
    }, 2000);
}

// Function to update the game timer display
function updateGameTimer(time) {
    document.getElementById('game-timer').textContent = time;
}

// Function to end the game
function endGame() {
    // Show game over screen
    document.getElementById('game-over').style.display = 'block';
    // Display the total stars collected
    document.getElementById('star-count').textContent = comboCount;
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
    // Update combo count
    comboCount++;
    updateComboCount(comboCount);
}

// Function to update the combo count display
function updateComboCount(count) {
    document.getElementById('combo-count').textContent = count;
}

// Add event listener for keydown events
document.addEventListener('keydown', handleKeyDown);

// Call the function to handle the start button click
handleStartButtonClick();

// Call the function to handle the restart button click
handleRestartButtonClick();
