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
    decision = "🏌️ " + yards + " Yards: Pull out the DRIVER off the tee for max power!";
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

// Poll #1 Logic (Agree / Disagree)
let poll1YesVotes = 142;
let poll1NoVotes = 28;

function votePoll1(agreed) {
  if (agreed) poll1YesVotes++;
  else poll1NoVotes++;

  const total = poll1YesVotes + poll1NoVotes;
  const yesPct = Math.round((poll1YesVotes / total) * 100);
  
  const resultBox = document.getElementById("poll1-result");
  if (resultBox) {
    resultBox.style.display = "block";
    resultBox.innerHTML = `✅ Thank you for voting! <br> <strong>Results:</strong> ${yesPct}% Agree (${poll1YesVotes} votes) vs ${100 - yesPct}% Disagree (${poll1NoVotes} votes).`;
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

// =========================================
// 2D GOLF LAUNCH SIMULATOR (CANVAS ENGINE)
// =========================================
let canvas, ctx;
let ballX = 35;
let ballY = 260;
let ballVX = 0;
let ballVY = 0;
let isShotActive = false;
let score = 0;

function drawDrivingRange() {
  canvas = document.getElementById("golf-canvas");
  if (!canvas) return;
  ctx = canvas.getContext("2d");

  // Sky Gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, 190);
  skyGradient.addColorStop(0, '#0284c7');
  skyGradient.addColorStop(1, '#0f766e');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, 190);

  // Grass Fairway
  ctx.fillStyle = "#15803d";
  ctx.fillRect(0, 190, canvas.width, 130);

  // Tee Mat
  ctx.fillStyle = "#047857";
  ctx.fillRect(25, 262, 30, 8);

  // Target Greens
  drawTargetGreen(180, 220, "150 YDS");
  drawTargetGreen(320, 220, "250 YDS");
  drawTargetGreen(440, 220, "350 YDS");

  // Golf Ball
  ctx.save();
  ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTargetGreen(x, y, label) {
  ctx.fillStyle = "#34d399";
  ctx.beginPath();
  ctx.ellipse(x, y, 28, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 24);
  ctx.stroke();

  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(x, y - 24);
  ctx.lineTo(x + 12, y - 18);
  ctx.lineTo(x, y - 12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(label, x, y + 22);
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

    const calculatedYards = Math.floor((ballX / canvas.width) * 400);
    const distElem = document.getElementById("drive-dist");
    if (distElem) distElem.innerText = calculatedYards + " YDS";

    if (calculatedYards >= 300) {
      score += 100;
      fireConfetti();
    } else if (calculatedYards >= 150) {
      score += 50;
    } else {
      score += 20;
    }
    const scoreElem = document.getElementById("game-score");
    if (scoreElem) scoreElem.innerText = score;
  } else {
    requestAnimationFrame(animateShot);
  }
}

// Event Listener Attachments
document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("theme-btn");
  if (themeBtn) themeBtn.addEventListener("click", toggleDarkMode);

  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) submitBtn.addEventListener("click", updateUserText);

  const poll1Yes = document.getElementById("poll1-yes");
  if (poll1Yes) poll1Yes.addEventListener("click", () => votePoll1(true));

  const poll1No = document.getElementById("poll1-no");
  if (poll1No) poll1No.addEventListener("click", () => votePoll1(false));

  const submitFavBtn = document.getElementById("submit-fav-btn");
  if (submitFavBtn) submitFavBtn.addEventListener("click", submitFavoriteCourse);

  const swingBtn = document.getElementById("swing-btn");
  if (swingBtn) swingBtn.addEventListener("click", swingClub);

  drawDrivingRange();
});
