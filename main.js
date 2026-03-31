console.log("Breath and Recharge");
const slider = document.getElementById("slider");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const handle = document.getElementById("circleHandle");
const messageEl = document.getElementById("message");
const stressBtns = document.querySelectorAll(".stress-btn");
const startScreen = document.getElementById("startScreen");
const enterAppBtn = document.getElementById("enterAppBtn");
const app = document.getElementById("app");
const breathText = document.getElementById("breathText");

let stressLevel = "low";
let isRunning = false;
let timerInterval = null;
let secondsLeft = 30;
let angle = 0;
let animationId = null;
let messageTimer = null;
let messageIndex = 0;
let breathInterval = null;
let birdInterval = null;

const messages = [
  "You can do this!",
  "Just relax...",
  "Deep breath in...",
  "You're doing great!",
  "Kalm aan, stap voor stap.",
  "Je bent sterker dan je denkt.",
  "Adem in... en uit.",
  "Goed bezig, blijf zo!",
];


// FEATURE 1: Stress level kiezen via knoppen
// 1.1 Selecteer alle knoppen met class stress button
// 1.2 Loop door elke knop
// 1.3 Voeg een click event listener toe
// 1.4 Verwijder de 'active' class van alle knoppen
// 1.5 Voeg de active class toe aan de aangeklikte knop
// 1.6 Sla het gekozen stress level op



for (const btn of stressBtns) {
  btn.addEventListener("click", function () {
    for (const b of stressBtns) {
      b.classList.remove("active");
    }
    btn.classList.add("active");
    stressLevel = btn.dataset.level;
  });
}


// FEATURE 2: start scherm
// 2.1 Verberg het startscherm bij klikken
// 2.2 Toon de hoofd app
// 2.3 Start de vogelanimatie

enterAppBtn.addEventListener("click", function () {
  startScreen.style.display = "none";
  app.style.display = "block";

  startBirds(); // vogels starten
});

// FEATURE 3: Slider gebruiken om tijd in te stellen
// 2.1 Luister naar input van de slider
// 2.2 Haal de waarde op
// 2.3 Zet om naar seconden
// 2.4 Update de tijd op het scherm

slider.addEventListener("input", function () {
  secondsLeft = parseInt(slider.value);
  timeDisplay.textContent = formatTime(secondsLeft);
});


// FEATURE 4: Timer starten
// 3.1 Check of timer al loopt
// 3.2 Haal starttijd uit slider
// 3.3 Zet default waarde indien nodig
// 3.4 Zet timer actief
// 3.5 Start animatie
// 3.6 Start countdown interval
// 3.7 Update UI elke seconde
// 3.8 Stop wanneer tijd op is

startBtn.addEventListener("click", function () {

  if (isRunning) {
    return;
  }

  secondsLeft = parseInt(slider.value);

  if (secondsLeft === 0) {
    slider.value = 30;
    secondsLeft = 30;
    timeDisplay.textContent = formatTime(30);
  }

  isRunning = true;


  rotateHandle();
  timerInterval = setInterval(function () {
    secondsLeft = secondsLeft - 1;
    slider.value = secondsLeft;
    timeDisplay.textContent = formatTime(secondsLeft);

    if (secondsLeft <= 0) {
      stopSession();
      toonBericht("Goed gedaan! Je hebt het gehaald. 🌿");
    }
  }, 1000);

  toonBericht(messages[messageIndex]);
  messageTimer = setInterval(function () {
    messageIndex = messageIndex + 1;
    if (messageIndex >= messages.length) {
      messageIndex = 0;
    }
    toonBericht(messages[messageIndex]);
  }, 4000);
  startBreathing(); 
});

//: feature 5 : ademhaling systeem
// 5.1 Bepaal ademhalingstempo afhankelijk van stress level
// 5.2 Wissel tussen "Adem in..." en "Adem uit..." teksten
// 5.3 Update het scherm met ademhaling instructies
function startBreathing() {

  let time;

  if (stressLevel === "low") {
    time = 4000;
  } else if (stressLevel === "medium") {
    time = 3000;
  } else {
    time = 2000;
  }

  let inhale = true;

  breathText.textContent = "Adem in...";

  breathInterval = setInterval(function () {

    if (inhale) {
      breathText.textContent = "Adem uit...";
    } else {
      breathText.textContent = "Adem in...";
    }

    inhale = !inhale;

  }, time);
}

// FEATURE 6: Stop knop functionaliteit
// 6.1 Stop timer en animatie
// 6.2 Reset berichten op scherm

stopBtn.addEventListener("click", function () {
  stopSession();
});


// FEATURE 7: Tijd formatteren
// 8.1 Bereken minuten en seconden
// 8.2 Voeg 0 toe indien nodig
// 8.3 Geef terug als string
function formatTime(seconds) {
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;

  if (mins < 10) {
    mins = "0" + mins;
  }
  if (secs < 10) {
    secs = "0" + secs;
  }

  return mins + ":" + secs;
}

// FEATURE 8: Rotatie animatie van de cirkel
// 4.1 Bepaal snelheid op basis van stress level
// 4.2 Verhoog rotatiehoek
// 4.3 Pas rotatie toe op element
// 4.4 Blijf herhalen zolang timer loopt


function rotateHandle() {

  let speed;
  if (stressLevel === "low") {
    speed = 1.5;
  } else if (stressLevel === "medium") {
    speed = 0.8;
  } else {
    speed = 0.4;
  }

  angle = angle + speed;
  handle.style.transform = "rotate(" + angle + "deg)";

  if (isRunning) {
    animationId = requestAnimationFrame(rotateHandle);
  }
}

// FEATURE 9: Motiverende berichten tonen
// 5.1 Toon eerste bericht
// 5.2 Wissel automatisch van bericht
// 5.3 Herbegin lijst wanneer einde bereikt is
// 5.4 Voeg kleine fade animatie toe voor betere effect


function toonBericht(tekst) {

  messageEl.classList.add("hidden");


  setTimeout(function () {
    messageEl.textContent = tekst;
    messageEl.classList.remove("hidden");
  }, 400);
}


// FEATURE 10: Sessie volledig resetten
// 7.1 Stop alle intervals
// 7.2 Stop animatie
// 7.3 Reset variabelen
// 7.4 Reset tijd, slider en rotatie
// 7.5 Reset berichten
// 7.6 vogels stoppen met vliegen

function stopSession() {
  isRunning = false;

  clearInterval(breathInterval); 
  clearInterval(timerInterval);
  clearInterval(messageTimer);
  timerInterval = null;
  messageTimer = null;


  cancelAnimationFrame(animationId);
  animationId = null;


  angle = 0;
  handle.style.transform = "rotate(0deg)";

  slider.value = 0;
  secondsLeft = 0;
  timeDisplay.textContent = "00:00";

  messageIndex = 0;
  clearInterval(birdInterval);
  birdInterval = null;

  messageEl.textContent = "";
  breathText.textContent = "";
  breathInterval = null;
}


//: vogels
// 11.1 Maak regelmatig nieuwe vogel elementen aan
// 11.2 Plaats vogels willekeurig op de hoogte van het scherm
// 11.3 Verwijder vogels automatisch na 20 seconden
// 11.4 Herhaal elke 3 seconden
function startBirds() {
  birdInterval = setInterval(function () {
    const bird = document.createElement("div");
    bird.classList.add("bird");
    bird.textContent = "🕊️";

    bird.style.top = Math.random() * 60 + "%";
    bird.style.animationDuration = 10 + Math.random() * 10 + "s";

    document.body.appendChild(bird);

    setTimeout(function () {
      bird.remove();
    }, 20000);
  }, 3000);
}