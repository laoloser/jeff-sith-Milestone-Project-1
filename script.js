let comboCount = 0;
let gameLoopInterval;
let fallingStarsIntervalId;


const difficultyDurations = {
  easy: 2000,
  medium: 1000,
  hard: 500,
};


const laneXValues = [
  140, // X-value for lane 1
  420, // X-value for lane 2
  720, // X-value for lane 3
  1020, // X-value for lane 4
];


const songList = [
    { name: 'No Music', path: '' },
    { name: 'Song 1', path: 'assets/song1.mp3' },
    { name: 'Song 2', path: 'assets/song2.mp3' },
    { name: 'Song 3', path: 'assets/song3.mp3' }
];


let currentSongIndex = 0;


function handleMusicToggleButton() {

    currentSongIndex = (currentSongIndex + 1) % songList.length;


    updateSelectedSong();


    playSelectedSong();
}


document.getElementById("next-song").addEventListener("click", handleMusicToggleButton);



function updateSelectedSong() {
    const currentSongElement = document.getElementById('current-song');
    currentSongElement.textContent = `Current Song: ${songList[currentSongIndex].name}`;
}


function playSelectedSong() {
    const audioPlayer = document.getElementById("audio-player");
    audioPlayer.pause();

    const selectedSongPath = songList[currentSongIndex].path;

    if (selectedSongPath) {
        audioPlayer.src = selectedSongPath;
        audioPlayer.addEventListener("canplay", function() {
            
            audioPlayer.play();
        });

    } else {

    }
}




updateSelectedSong();


function handleStartButtonClick() {
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", startGame);
}

function handleRestartButtonClick() {
  const restartButtons = document.querySelectorAll(".restart-button");
  restartButtons.forEach((button) => {
    button.addEventListener("click", restartGame);
  });
}


function restartGame() {
  clearInterval(gameLoopInterval); 
  clearInterval(fallingStarsIntervalId);
  comboCount = 0; 
  updateComboCount(comboCount);
  document.querySelector(".gameArea").innerHTML = ""; 
  document.getElementById("game-over").style.display = "none"; 
  document.getElementById("victory").style.display = "none"; 
  document.querySelector(".instructions").style.display = "block"; 
  document.getElementById("difficulty").style.display = "block"; 
  document.getElementById("start-button").style.display = "block"; 
  document.getElementById("game-info").style.display = "none"; 
}


function startGame() {
  document.querySelector(".instructions").style.display = "none";
  document.getElementById("difficulty").style.display = "none";
  document.getElementById("start-button").style.display = "none";
  document.getElementById("game-info").style.display = "flex";
  document.querySelector(".gameArea").style.display = "block";


  setTimeout(() => {
    const selectedDifficulty = document.getElementById("difficulty-selector")
      .value;
    comboCount = 0;
    updateComboCount(comboCount);
    initializeGame(selectedDifficulty);
  }, 2000);
}

function initializeGame(difficulty) {
  let gameTimer = 30; 
  updateComboCount(comboCount);
  updateGameTimer(gameTimer);
  const gameLoopInterval = setInterval(() => {
    gameTimer--;
    updateGameTimer(gameTimer);
    if (gameTimer <= 0) {
      clearInterval(gameLoopInterval);
      endGame(); 
    }
  }, 1000); 

  let fallingStarsInterval;
  switch (difficulty) {
    case "easy":
      fallingStarsInterval = 800;
      break;
    case "medium":
      fallingStarsInterval = 500;
      break;
    case "hard":
      fallingStarsInterval = 300;
      break;
    default:
      fallingStarsInterval = 1500;
      break;
  }

  generateFallingStars(difficulty); 
  const fallingStarsGenerator = () => {
    generateFallingStars(difficulty);
  };
  const fallingStarsIntervalId = setInterval(
    fallingStarsGenerator,
    fallingStarsInterval
  );

  const intervalIds = {
    gameLoopInterval,
    fallingStarsIntervalId,
  };


  return intervalIds;
}

function generateFallingStars(difficulty) {
  const gameArea = document.querySelector(".gameArea");
  const gameAreaWidth = gameArea.clientWidth;
  const maxRandomX = gameAreaWidth - 50;
  const randomLaneIndex = Math.floor(Math.random() * laneXValues.length);
  const randomX = laneXValues[randomLaneIndex]; 
  const star = document.createElement("div");
  star.classList.add("star");


  star.style.left = `${randomX}px`;
  star.style.top = `0px`;


  gameArea.appendChild(star);


  animateFallingStar(star, difficultyDurations[difficulty]);
}

function animateFallingStar(star, duration) {
  const gameAreaHeight = document.querySelector(".gameArea").clientHeight;
  const bottomPosition = gameAreaHeight - star.clientHeight;
  star.style.animation = `falling-star ${duration}ms linear`;


  const removeStar = () => {
    star.remove();
    if (parseInt(star.style.top) >= bottomPosition) {
    }
  };
  star.addEventListener("animationend", removeStar);
  setTimeout(removeStar, duration);
}

function updateGameTimer(time) {
  document.getElementById("game-timer").textContent = time;
}


function endGame() {
  document.querySelector(".gameArea").style.display = "none";

  const selectedDifficulty = document.getElementById("difficulty-selector")
    .value;

  let earnedAmount;
  switch (selectedDifficulty) {
    case "easy":
      earnedAmount = comboCount * 1;
      break;
    case "medium":
      earnedAmount = comboCount * 5;
      break;
    case "hard":
      earnedAmount = comboCount * 12;
      break;
    default:
      earnedAmount = 0;
      break;
  }


  let totalStarsCaught = localStorage.getItem("totalStarsCaught");
  totalStarsCaught = totalStarsCaught
    ? parseInt(totalStarsCaught) + comboCount
    : comboCount;
  localStorage.setItem("totalStarsCaught", totalStarsCaught);

  let totalAmountEarned = localStorage.getItem("totalAmountEarned");
  totalAmountEarned = totalAmountEarned
    ? parseInt(totalAmountEarned) + earnedAmount
    : earnedAmount;
  localStorage.setItem("totalAmountEarned", totalAmountEarned);


  const gameOverSection = document.getElementById("game-over");
  gameOverSection.style.display = "block";
  const earnedAmountParagraph = document.getElementById("earned-amount");
  earnedAmountParagraph.textContent = `You have earned $${earnedAmount}`;

  const totalStarsParagraph = document.getElementById("total-stars");
  totalStarsParagraph.textContent = `Total stars caught: ${totalStarsCaught}`;

  const totalAmountParagraph = document.getElementById("total-amount");
  totalAmountParagraph.textContent = `Total amount earned: $${totalAmountEarned}`;


  document.getElementById("star-count").textContent = comboCount;
}


function handleKeyDown(event) {
  const key = event.key.toLowerCase();
  if (key === "d" || key === "f" || key === "j" || key === "k") {
    collectStar(key);
  }
}

function collectStar(key) {
  const fallingStars = document.querySelectorAll(".star");

  for (const star of fallingStars) {
    const starPositionX = parseInt(star.style.left);
    const laneWidth = document.querySelector(".gameArea").clientWidth / 4;
    const lane = Math.floor(starPositionX / laneWidth); 


    if (
      (key === "d" && lane === 0) ||
      (key === "f" && lane === 1) ||
      (key === "j" && lane === 2) ||
      (key === "k" && lane === 3)
    ) {
      star.remove();
      comboCount++;
      updateComboCount(comboCount);
      break;
    }
  }
}


function updateComboCount(count) {
  document.getElementById("combo-count").textContent = count;
}

document.addEventListener("keydown", handleKeyDown);


handleStartButtonClick();


handleRestartButtonClick();
