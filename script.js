// Confetti Animation Helper
function fireConfetti() {
  if (typeof confetti === "function") {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }
}

// Dark / Light Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle("light-mode");
}

// Poll #1 Logic (Agree / Disagree)
let poll1YesVotes = 184;
let poll1NoVotes = 32;

function votePoll1(agreed) {
  if (agreed) poll1YesVotes++;
  else poll1NoVotes++;

  const total = poll1YesVotes + poll1NoVotes;
  const yesPct = Math.round((poll1YesVotes / total) * 100);
  
  const resultBox = document.getElementById("poll1-result");
  if (resultBox) {
    resultBox.style.display = "block";
    resultBox.innerHTML = `✅ Thank you for voting! <br> <strong>Current Community Results:</strong> ${yesPct}% Agree (${poll1YesVotes} votes) vs ${100 - yesPct}% Disagree (${poll1NoVotes} votes).`;
  }
  fireConfetti();
}

// Poll #2 Logic (Submit Favorite Course)
function submitFavoriteCourse() {
  const input = document.getElementById("fav-course-input");
  const resultBox = document.getElementById("poll2-result");
  if (!input || !resultBox) return;

  const val = input.value.trim();
  if (val === "") {
    resultBox.style.display = "block";
    resultBox.innerText = "⚠️ Please type the name of a golf course!";
    return;
  }

  resultBox.style.display = "block";
  resultBox.innerHTML = `🌟 Submission received! <strong>"${val}"</strong> has been added to our community favorites queue.`;
  fireConfetti();
  input.value = "";
}

// Smart Caddie Logic (If / Else Decision Engine)
function updateUserText() {
  const inputField = document.getElementById("user-input");
  const displayElement = document.getElementById("display-text");
  if (!inputField || !displayElement) return;

  const yards = parseInt(inputField.value.trim());
  let decision = "";

  if (isNaN(yards) || yards <= 0) {
    decision = "⚠️ Please enter a valid distance in yards!";
  } else if (yards > 230) {
    decision = "🏌️ " + yards + " Yards: Pull out the DRIVER off the tee for max distance!";
    fireConfetti();
  } else if (yards >= 170 && yards <= 230) {
    decision = "🪵 " + yards + " Yards: Hit a smooth 3-Wood or Hybrid!";
  } else if (yards >= 120 && yards < 170) {
    decision = "🎯 " + yards + " Yards: Mid Iron distance (7i or 8i). Aim straight for the flag!";
  } else if (yards < 120) {
    decision = "⛳ " + yards + " Yards: Take a Wedge (PW/SW) for a soft landing on the green!";
  }

  displayElement.innerText = decision;
  inputField.value = "";
}

// =========================================
// GAME 1: 2D GOLF LAUNCH SIMULATOR
// =========================================
let canvas1, ctx1;
let ballX = 35;
let ballY = 260;
let ballVX = 0;
let ballVY = 0;
let isShotActive = false;
let score1 = 0;

function drawDrivingRange() {
  canvas1 = document.getElementById("golf-canvas");
  if (!canvas1) return;
  ctx1 = canvas1.getContext("2d");

  const skyGradient = ctx1.createLinearGradient(0, 0, 0, 190);
  skyGradient.addColorStop(0, '#0284c7');
  skyGradient.addColorStop(1, '#0f766e');
  ctx1.fillStyle = skyGradient;
  ctx1.fillRect(0, 0, canvas1.width, 190);

  ctx1.fillStyle = "#15803d";
  ctx1.fillRect(0, 190, canvas1.width, 130);

  ctx1.fillStyle = "#047857";
  ctx1.fillRect(25, 262, 30, 8);

  drawTargetGreen(180, 220, "150 YDS");
  drawTargetGreen(320, 220, "250 YDS");
  drawTargetGreen(440, 220, "350 YDS");

  ctx1.save();
  ctx1.shadowColor = "rgba(255, 255, 255, 0.8)";
  ctx1.shadowBlur = 8;
  ctx1.fillStyle = "#ffffff";
  ctx1.beginPath();
  ctx1.arc(ballX, ballY, 6, 0, Math.PI * 2);
  ctx1.fill();
  ctx1.restore();
}

function drawTargetGreen(x, y, label) {
  ctx1.fillStyle = "#34d399";
  ctx1.beginPath();
  ctx1.ellipse(x, y, 28, 12, 0, 0, Math.PI * 2);
  ctx1.fill();

  ctx1.strokeStyle = "#ffffff";
  ctx1.lineWidth = 2;
  ctx1.beginPath();
  ctx1.moveTo(x, y);
  ctx1.lineTo(x, y - 24);
  ctx1.stroke();

  ctx1.fillStyle = "#ef4444";
  ctx1.beginPath();
  ctx1.moveTo(x, y - 24);
  ctx1.lineTo(x + 12, y - 18);
  ctx1.lineTo(x, y - 12);
  ctx1.closePath();
  ctx1.fill();

  ctx1.fillStyle = "#ffffff";
  ctx1.font = "bold 11px system-ui";
  ctx1.textAlign = "center";
  ctx1.fillText(label, x, y + 22);
}

function swingClub() {
  if (isShotActive) return;

  ballX = 35;
  ballY = 260;
  ballVX = Math.random() * 5 + 6;
  ballVY = -(Math.random() * 4 + 7.5);

  isShotActive = true;
  animateShot();
}

function animateShot() {
  if (!isShotActive) return;

  ballVY += 0.28;
  ballX += ballVX;
  ballY += ballVY;

  drawDrivingRange();

  if (ballY >= 260) {
    ballY = 260;
    isShotActive = false;

    const calculatedYards = Math.floor((ballX / canvas1.width) * 400);
    const distElem = document.getElementById("drive-dist");
    if (distElem) distElem.innerText = calculatedYards + " YDS";

    if (calculatedYards >= 300) {
      score1 += 100;
      fireConfetti();
    } else if (calculatedYards >= 150) {
      score1 += 50;
    } else {
      score1 += 20;
    }
    const scoreElem = document.getElementById("game-score");
    if (scoreElem) scoreElem.innerText = score1;
  } else {
    requestAnimationFrame(animateShot);
  }
}

// =========================================
// GAME 2: PIN COLLECTOR PUTTING CHALLENGE
// =========================================
let canvas2, ctx2;
let putterX = 250;
let putterY = 160;
let putterScore = 0;
let targetPin = { x: 100, y: 80 };

function initPuttingGame() {
  canvas2 = document.getElementById("putting-canvas");
  if (!canvas2) return;
  ctx2 = canvas2.getContext("2d");

  canvas2.addEventListener("mousemove", (e) => {
    const rect = canvas2.getBoundingClientRect();
    putterX = e.clientX - rect.left;
    putterY = e.clientY - rect.top;
    checkPinCollection();
  });

  spawnNewPin();
  drawPuttingGreen();
}

function spawnNewPin() {
  targetPin.x = Math.floor(Math.random() * (canvas2.width - 60)) + 30;
  targetPin.y = Math.floor(Math.random() * (canvas2.height - 60)) + 30;
}

function drawPuttingGreen() {
  if (!ctx2) return;

  // Putting Surface
  ctx2.fillStyle = "#15803d";
  ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

  // Target Flag
  ctx2.fillStyle = "#22c55e";
  ctx2.beginPath();
  ctx2.arc(targetPin.x, targetPin.y, 16, 0, Math.PI * 2);
  ctx2.fill();

  ctx2.strokeStyle = "#ffffff";
  ctx2.lineWidth = 2;
  ctx2.beginPath();
  ctx2.moveTo(targetPin.x, targetPin.y);
  ctx2.lineTo(targetPin.x, targetPin.y - 20);
  ctx2.stroke();

  ctx2.fillStyle = "#ef4444";
  ctx2.beginPath();
  ctx2.moveTo(targetPin.x, targetPin.y - 20);
  ctx2.lineTo(targetPin.x + 10, targetPin.y - 15);
  ctx2.lineTo(targetPin.x, targetPin.y - 10);
  ctx2.closePath();
  ctx2.fill();

  // Golf Ball Cursor
  ctx2.fillStyle = "#ffffff";
  ctx2.shadowColor = "rgba(255, 255, 255, 0.8)";
  ctx2.shadowBlur = 8;
  ctx2.beginPath();
  ctx2.arc(putterX, putterY, 8, 0, Math.PI * 2);
  ctx2.fill();
  ctx2.shadowBlur = 0;

  requestAnimationFrame(drawPuttingGreen);
}

function checkPinCollection() {
  const dx = putterX - targetPin.x;
  const dy = putterY - targetPin.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 20) {
    putterScore++;
    const putterElem = document.getElementById("putter-score");
    if (putterElem) putterElem.innerText = putterScore;
    fireConfetti();
    spawnNewPin();
  }
}

// DOM Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("theme-btn");
  if (themeBtn) themeBtn.addEventListener("click", toggleDarkMode);

  const poll1Yes = document.getElementById("poll1-yes");
  if (poll1Yes) poll1Yes.addEventListener("click", () => votePoll1(true));

  const poll1No = document.getElementById("poll1-no");
  if (poll1No) poll1No.addEventListener("click", () => votePoll1(false));

  const submitFavBtn = document.getElementById("submit-fav-btn");
  if (submitFavBtn) submitFavBtn.addEventListener("click", submitFavoriteCourse);

  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) submitBtn.addEventListener("click", updateUserText);

  const swingBtn = document.getElementById("swing-btn");
  if (swingBtn) swingBtn.addEventListener("click", swingClub);

  drawDrivingRange();
  initPuttingGame();
});
