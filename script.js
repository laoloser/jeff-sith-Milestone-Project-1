let comboCount = 0;

const difficultyDurations = {
    easy: 2000, // 2 seconds for easy
    medium: 1000, // 1 second for medium
    hard: 500 // 0.5 seconds for hard
};


// Function to handle the click event of the start button
function handleStartButtonClick() {
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', function() {
        startGame();
    });
}

// Function to handle the click event of the restart button
function handleRestartButtonClick() {
    const restartButtons = document.querySelectorAll('.restart-button');
    restartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Reset combo count
            comboCount = 0;
            updateComboCount(comboCount);
            
            // Reset game timer
            const gameTimer = 30; // Reset to initial timer value
            updateGameTimer(gameTimer);

            // Hide game over or victory screen
            document.getElementById('game-over').style.display = 'none';
            document.getElementById('victory').style.display = 'none';
            
            // Show the instructions, difficulty selector, and start button
            document.querySelector('.instructions').style.display = 'block';
            document.getElementById('difficulty').style.display = 'block';
            document.getElementById('start-button').style.display = 'block';
        });
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

    // Get selected difficulty
    const selectedDifficulty = document.getElementById('difficulty-selector').value;

    // Reset combo count
    comboCount = 0;
    updateComboCount(comboCount);
    
    // Reset game timer
    const gameTimer = 30; // Reset to initial timer value
    updateGameTimer(gameTimer);

    // Initialize the game with selected difficulty
    initializeGame(selectedDifficulty);
}



// Function to initialize the game
function initializeGame(difficulty) {
    // Initialize game variables
    let gameTimer = 30; // Game timer (in seconds)

    // Display initial combo count and game timer
    updateComboCount(comboCount);
    updateGameTimer(gameTimer);

    // Start game loop
    const gameLoopInterval = setInterval(function() {
        // Update game timer
        gameTimer--;
        updateGameTimer(gameTimer);

        // Check if game over condition is met
        if (gameTimer <= 0) {
            clearInterval(gameLoopInterval); // Stop the game loop
            // Check if all stars have been collected
            const totalStars = document.querySelectorAll('.star').length;
            if (comboCount === totalStars) {
                endGame(true); // Trigger victory
            } else {
                endGame(false); // Trigger game over
            }
        }

        // Generate falling stars
        generateFallingStars(difficulty);
    }, 1000); // Update every second
}

// Initialize an array to store stars that have reached the bottom
let fallenStars = [];

// Function to generate falling stars
function generateFallingStars(difficulty) {
    // Get game area dimensions
    const gameArea = document.querySelector('.gameArea');
    const gameAreaWidth = gameArea.clientWidth;
    const gameAreaHeight = gameArea.clientHeight;

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

    // Animate the falling star with duration based on difficulty
    animateFallingStar(star, difficultyDurations[difficulty]);

    // Check if the star has reached the bottom of the game area during animation
    const bottomThreshold = gameAreaHeight - star.clientHeight;
    const checkFallInterval = setInterval(function() {
        const starTop = parseInt(star.style.top);
        if (starTop >= bottomThreshold) {
            clearInterval(checkFallInterval); // Stop checking when the star reaches the bottom
            // End the game immediately
            endGame(false); // Trigger game over
        }
    }, 50); // Check every 50 milliseconds
}




// Function to animate the falling star
function animateFallingStar(star, duration) {
    const gameAreaHeight = document.querySelector('.gameArea').clientHeight;

    // Calculate the bottom position of the game area
    const bottomPosition = gameAreaHeight - star.clientHeight;

    // Use CSS animation to move the star from top to bottom of the game area
    star.style.animation = `falling-star ${duration}ms linear`;

    // Remove the star from the game area after the animation ends or it reaches the bottom
    const removeStar = () => {
        star.remove();
        // Check if the star reached the bottom
        if (parseInt(star.style.top) >= bottomPosition) {
            endGame(); // Trigger game over
        }
    };

    // Remove the star after the animation ends
    star.addEventListener('animationend', removeStar);
    // Remove the star if it's already at the bottom after a delay
    setTimeout(removeStar, duration);
}


// Function to update the game timer display
function updateGameTimer(time) {
    document.getElementById('game-timer').textContent = time;
}

// Function to end the game
function endGame(victory) {
    // Hide the game area
    document.querySelector('.gameArea').style.display = 'none';

    // Clear any remaining stars without adding to the current combo count
    const fallingStars = document.querySelectorAll('.star');
    fallingStars.forEach(star => {
        star.remove();
    });

    // Display the appropriate screen
    if (victory) {
        document.getElementById('victory').style.display = 'block';
    } else {
        document.getElementById('game-over').style.display = 'block';
    }
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
    for (const star of fallingStars) {
        const starPositionX = parseInt(star.style.left);
        const laneWidth = document.querySelector('.gameArea').clientWidth / 4;
        const lane = Math.floor(starPositionX / laneWidth); // Determine which lane the star is in

        // Check if the pressed key matches the lane and star is within collection range
        if ((key === 'd' && lane === 0) || (key === 'f' && lane === 1) || (key === 'j' && lane === 2) || (key === 'k' && lane === 3)) {
            // Collect the star
            star.remove();
            // Update combo count
            comboCount++;
            updateComboCount(comboCount);
            // Break the loop after collecting one star
            break;
        }
    }
}


// Function to update the combo count display
function updateComboCount(count) {
    document.getElementById('combo-count').textContent = count;
}


// Add event listener for keydown events
document.addEventListener('keydown', handleKeyDown);



// Call the function to handle the start button click
handleStartButtonClick();
