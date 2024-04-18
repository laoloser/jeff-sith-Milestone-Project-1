let comboCount = 0;
let gameLoopInterval; 
let fallingStarsIntervalId; 


//Depending on what difficulty is selected, this is the amount of time it takes for a star to fall from top to bottom
const difficultyDurations = {
    easy: 2000, 
    medium: 1000, 
    hard: 500 
};

// These are the X values for each lanes that the stars will snap to
const laneXValues = [
    140, // X-value for lane 1
    420, // X-value for lane 2
    720, // X-value for lane 3
    1020 // X-value for lane 4
];

// Define an array of song names
const songNames = ['No Music', 'Song 1', 'Song 2', 'Song 3'];

// Variable to store the index of the currently selected song
let currentSongIndex = 0; // Default is 0 = No Music

// Function for the music toggle button
function handleMusicToggleButton() {
    // Increment the current song index to toggle through songs
    currentSongIndex = (currentSongIndex + 1) % songNames.length;

    // Update the display of the currently selected song
    updateSelectedSong();
}

// Function to update the display of the currently selected song
function updateSelectedSong() {
    const currentSongElement = document.getElementById('current-song');
    currentSongElement.textContent = `Current Song: ${songNames[currentSongIndex]}`;
}

// Add event listener to music toggle button
const musicToggleButton = document.getElementById('next-song');
musicToggleButton.addEventListener('click', handleMusicToggleButton);

// Function to play the selected song (you can implement this function if needed)
function playSelectedSong() {
    const selectedSong = songNames[currentSongIndex];
    // Logic to play the selected song
    console.log(`Now playing: ${selectedSong}`);
}

// Call the function to update the display of the currently selected song
updateSelectedSong();


// Function to handle the click event of the start button
function handleStartButtonClick() {
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', startGame);
}

// Function to handle the click event of the restart button
function handleRestartButtonClick() {
    const restartButtons = document.querySelectorAll('.restart-button');
    restartButtons.forEach(button => {
        button.addEventListener('click', restartGame);
    });
}

// Function to restart the game
function restartGame() {
    clearInterval(gameLoopInterval); // Clear the game loop interval
    clearInterval(fallingStarsIntervalId); // Clear the falling stars interval
    comboCount = 0; // Reset combo count
    updateComboCount(comboCount);
    document.querySelector('.gameArea').innerHTML = ''; // Clear game area
    document.getElementById('game-over').style.display = 'none'; // Hide game over screen
    document.getElementById('victory').style.display = 'none'; // Hide victory screen
    document.querySelector('.instructions').style.display = 'block'; // Show instructions
    document.getElementById('difficulty').style.display = 'block'; // Show difficulty selector
    document.getElementById('start-button').style.display = 'block'; // Show start button
    document.getElementById('game-info').style.display = 'none'; // Hide game info
}


// Start game function
function startGame() {
    // Hide the instructions, difficulty selector, and start button
    document.querySelector('.instructions').style.display = 'none';
    document.getElementById('difficulty').style.display = 'none';
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('game-info').style.display = 'flex'; // Show game info

    // Show the game area
    document.querySelector('.gameArea').style.display = 'block';

    // Add a delay before initializing the game
    setTimeout(() => {
        // Get selected difficulty
        const selectedDifficulty = document.getElementById('difficulty-selector').value;

        // Reset combo count
        comboCount = 0;
        updateComboCount(comboCount);

        // Initialize the game with selected difficulty
        initializeGame(selectedDifficulty);
    }, 2000); // Delay for 2 seconds (2000 milliseconds)
}

// Function to initialize the game
function initializeGame(difficulty) {
    // Initialize game variables
    let gameTimer = 30; // Game timer (in seconds)

    // Display initial combo count and game timer
    updateComboCount(comboCount);
    updateGameTimer(gameTimer);

    // Set the interval for the game loop (controls the rate of the in-game timer)
    const gameLoopInterval = setInterval(() => {
        // Update game timer
        gameTimer--;
        updateGameTimer(gameTimer);

        // Check if game over condition is met
        if (gameTimer <= 0) {
            clearInterval(gameLoopInterval); // Stop the game loop
            endGame(); // End the game
        }
    }, 1000); // Update every second

    // Set the interval for generating falling stars based on the selected difficulty
    let fallingStarsInterval;
    switch (difficulty) {
        case 'easy':
            fallingStarsInterval = 800; // 1500ms for easy
            break;
        case 'medium':
            fallingStarsInterval = 500; // 1000ms for medium
            break;
        case 'hard':
            fallingStarsInterval = 300; // 500ms for hard
            break;
        default:
            fallingStarsInterval = 1500; // Default to 1500ms
            break;
    }

    // Generate falling stars initially and then at intervals based on the selected difficulty
    generateFallingStars(difficulty); // Initial generation
    const fallingStarsGenerator = () => {
        generateFallingStars(difficulty);
    };
    const fallingStarsIntervalId = setInterval(fallingStarsGenerator, fallingStarsInterval);

    // Store the interval IDs in an object so they can be cleared later
    const intervalIds = {
        gameLoopInterval,
        fallingStarsIntervalId
    };

    // Return the interval IDs so they can be cleared outside this function if needed
    return intervalIds;
}


function generateFallingStars(difficulty) {
    // Get game area dimensions
    const gameArea = document.querySelector('.gameArea');
    const gameAreaWidth = gameArea.clientWidth;

    // Calculate the maximum X-coordinate to ensure stars are generated within the game area
    const maxRandomX = gameAreaWidth - 50; // Adjusted width of the star

    // Get a random lane
    const randomLaneIndex = Math.floor(Math.random() * laneXValues.length);
    const randomX = laneXValues[randomLaneIndex]; // Pick a random X-coordinate from laneXValues

    // Create a new star element
    const star = document.createElement('div');
    star.classList.add('star');

    // Set position for the star within the game area
    star.style.left = `${randomX}px`;
    star.style.top = `0px`; // Start from the top

    // Append the star to the game area
    gameArea.appendChild(star);

    // Animate the falling star with duration based on difficulty
    animateFallingStar(star, difficultyDurations[difficulty]);
}




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
            // No need to trigger game over, just remove the star
            // Stars reaching the bottom do not end the game anymore
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
function endGame() {
    // Hide the game area
    document.querySelector('.gameArea').style.display = 'none';

    // Get the selected difficulty
    const selectedDifficulty = document.getElementById('difficulty-selector').value;

    // Calculate earned amount based on the number of stars collected and the difficulty level
    let earnedAmount;
    switch (selectedDifficulty) {
        case 'easy':
            earnedAmount = comboCount * 1;
            break;
        case 'medium':
            earnedAmount = comboCount * 5;
            break;
        case 'hard':
            earnedAmount = comboCount * 12;
            break;
        default:
            earnedAmount = 0;
            break;
    }

    // Update the total stars caught and total amount earned
    let totalStarsCaught = localStorage.getItem('totalStarsCaught');
    totalStarsCaught = totalStarsCaught ? parseInt(totalStarsCaught) + comboCount : comboCount;
    localStorage.setItem('totalStarsCaught', totalStarsCaught);

    let totalAmountEarned = localStorage.getItem('totalAmountEarned');
    totalAmountEarned = totalAmountEarned ? parseInt(totalAmountEarned) + earnedAmount : earnedAmount;
    localStorage.setItem('totalAmountEarned', totalAmountEarned);

    // Display the game over screen with the earned amount and totals
    const gameOverSection = document.getElementById('game-over');
    gameOverSection.style.display = 'block';
    const earnedAmountParagraph = document.getElementById('earned-amount');
    earnedAmountParagraph.textContent = `You have earned $${earnedAmount}`;

    const totalStarsParagraph = document.getElementById('total-stars');
    totalStarsParagraph.textContent = `Total stars caught: ${totalStarsCaught}`;

    const totalAmountParagraph = document.getElementById('total-amount');
    totalAmountParagraph.textContent = `Total amount earned: $${totalAmountEarned}`;

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

// Call the function to handle the restart button click
handleRestartButtonClick();