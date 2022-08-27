import ancients from "./data/ancients.js";
import {
  blueCards,
  brownCards,
  greenCards,
} from "./data/mythic-cards/mythic-cards.js";

const ancientsContainer = document.querySelector(".ancients-container");
const ancientCards = document.querySelectorAll(".ancient-card");
const difficultyContainer = document.querySelector(".difficulty-container");
const difficultyButtons = document.querySelectorAll(".difficulty");
const shuffleButton = document.querySelector(".shuffle-button");
const deck = document.querySelector(".deck");
const lastCard = document.querySelector(".last-card");
const tracker = {
  greenNum1: document.querySelector("#tracker-g1"),
  brownNum1: document.querySelector("#tracker-br1"),
  blueNum1: document.querySelector("#tracker-bl1"),

  greenNum2: document.querySelector("#tracker-g2"),
  brownNum2: document.querySelector("#tracker-br2"),
  blueNum2: document.querySelector("#tracker-bl2"),

  greenNum3: document.querySelector("#tracker-g3"),
  brownNum3: document.querySelector("#tracker-br3"),
  blueNum3: document.querySelector("#tracker-bl3"),
};

const audio = new Audio();
audio.src = "./assets/ost.mp3";
audio.volume = 0.05;
let isPlayed = false;

const flipAudio = new Audio();
flipAudio.src = "./assets/flip.mp3";

let ancient = ancients.find((ancient) => ancient.id === "azathoth");
let difficultyLevel = "very-easy";
let shuffledPack = [];
let isFlipping = false;

function getShuffledArr(arr) {
  let initArr = [...arr];
  let suffledArr = [];
  while (initArr.length > 0) {
    let indexOfRandomElement = Math.floor(Math.random() * initArr.length);
    suffledArr.push(initArr[indexOfRandomElement]);
    initArr.splice(indexOfRandomElement, 1);
  }
  return suffledArr;
}

function getVeryEasyPack(pack, numOfCards) {
  let veryEasyPack = [
    ...getShuffledArr(pack).filter((card) => card.difficulty === "easy"),
    ...getShuffledArr(pack).filter((card) => card.difficulty === "normal"),
  ].splice(0, numOfCards);
  return veryEasyPack;
}

function getEasyPack(pack, numOfCards) {
  let easyPack = getShuffledArr(pack)
    .filter(
      (card) => card.difficulty === "easy" || card.difficulty === "normal"
    )
    .splice(0, numOfCards);
  return easyPack;
}

function getDifficultPack(pack, numOfCards) {
  let difficultPack = getShuffledArr(pack)
    .filter(
      (card) => card.difficulty === "normal" || card.difficulty === "hard"
    )
    .splice(0, numOfCards);
  return difficultPack;
}

function getVeryDifficultPack(pack, numOfCards) {
  let veryDifficultPack = [
    ...getShuffledArr(pack).filter((card) => card.difficulty === "hard"),
    ...getShuffledArr(pack).filter((card) => card.difficulty === "normal"),
  ].splice(0, numOfCards);
  return veryDifficultPack;
}

function ancientsContainerClickHandler(event) {
  if (event.target.classList.contains("ancient-card")) {
    ancientCards.forEach((card) => {
      card.classList.remove("active");
    });
    event.target.classList.add("active");
    ancient = ancients.find(
      (ancientItem) => ancientItem.id === event.target.dataset.ancient
    );
  }
  resetApp();
}

function difficultyContainerClickHandler(event) {
  if (event.target.classList.contains("difficulty")) {
    difficultyButtons.forEach((button) => {
      button.classList.remove("active");
    });
    event.target.classList.add("active");
    difficultyLevel = event.target.dataset.difficulty;
  }
  resetApp();
}

function shuffleButtonClickHandler() {
  let greenPack = null;
  let bluePack = null;
  let brownPack = null;
  let numOfGreenCards =
    ancient.firstStage.greenCards +
    ancient.secondStage.greenCards +
    ancient.thirdStage.greenCards;
  let numOfBlueCards =
    ancient.firstStage.blueCards +
    ancient.secondStage.blueCards +
    ancient.thirdStage.blueCards;
  let numOfBrownCards =
    ancient.firstStage.brownCards +
    ancient.secondStage.brownCards +
    ancient.thirdStage.brownCards;
  switch (difficultyLevel) {
    case "normal":
      greenPack = getShuffledArr(greenCards).splice(0, numOfGreenCards);
      bluePack = getShuffledArr(blueCards).splice(0, numOfBlueCards);
      brownPack = getShuffledArr(brownCards).splice(0, numOfBrownCards);
      break;
    case "very-easy":
      greenPack = getVeryEasyPack(greenCards, numOfGreenCards);
      bluePack = getVeryEasyPack(blueCards, numOfBlueCards);
      brownPack = getVeryEasyPack(brownCards, numOfBrownCards);
      break;
    case "easy":
      greenPack = getEasyPack(greenCards, numOfGreenCards);
      bluePack = getEasyPack(blueCards, numOfBlueCards);
      brownPack = getEasyPack(brownCards, numOfBrownCards);
      break;
    case "difficult":
      greenPack = getDifficultPack(greenCards, numOfGreenCards);
      bluePack = getDifficultPack(blueCards, numOfBlueCards);
      brownPack = getDifficultPack(brownCards, numOfBrownCards);
      break;
    case "very-difficult":
      greenPack = getVeryDifficultPack(greenCards, numOfGreenCards);
      bluePack = getVeryDifficultPack(blueCards, numOfBlueCards);
      brownPack = getVeryDifficultPack(brownCards, numOfBrownCards);
      break;
  }
  let firstStagePack = getShuffledArr([
    ...greenPack.splice(0, ancient.firstStage.greenCards),
    ...bluePack.splice(0, ancient.firstStage.blueCards),
    ...brownPack.splice(0, ancient.firstStage.brownCards),
  ]);
  let secondStagePack = getShuffledArr([
    ...greenPack.splice(0, ancient.secondStage.greenCards),
    ...bluePack.splice(0, ancient.secondStage.blueCards),
    ...brownPack.splice(0, ancient.secondStage.brownCards),
  ]);
  let thirdStagePack = getShuffledArr([
    ...greenPack.splice(0, ancient.thirdStage.greenCards),
    ...bluePack.splice(0, ancient.thirdStage.blueCards),
    ...brownPack.splice(0, ancient.thirdStage.brownCards),
  ]);
  shuffledPack = [...thirdStagePack, ...secondStagePack, ...firstStagePack];
  updateTracker();
  lastCard.style.backgroundImage = "";
}

function deckClickHandler() {
  if (shuffledPack.length && !isFlipping) {
    isFlipping = true;
    lastCard.style.backgroundImage = `url(./assets/mythic-cards/${
      shuffledPack.pop().id
    }.png)`;
    updateTracker();
    flipAudio.play();
    flipAudio.addEventListener(
      "ended",
      () => {
        isFlipping = false;
      },
      { once: true }
    );
  }
}

function clearTracker() {
  for (let counter in tracker) {
    tracker[counter].textContent = 0;
  }
}

function updateTracker() {
  const firstStageCardsAmount =
    ancient.firstStage.greenCards +
    ancient.firstStage.blueCards +
    ancient.firstStage.brownCards;
  const secondStageCardsAmount =
    ancient.secondStage.greenCards +
    ancient.secondStage.blueCards +
    ancient.secondStage.brownCards;
  const thirdStageCardsAmount =
    ancient.thirdStage.greenCards +
    ancient.thirdStage.blueCards +
    ancient.thirdStage.brownCards;
  clearTracker();
  for (let i = 0; i < shuffledPack.length; i++) {
    if (i < thirdStageCardsAmount) {
      tracker[shuffledPack[i].color + "Num3"].textContent =
        Number(tracker[shuffledPack[i].color + "Num3"].textContent) + 1;
    } else if (i < thirdStageCardsAmount + secondStageCardsAmount) {
      tracker[shuffledPack[i].color + "Num2"].textContent =
        Number(tracker[shuffledPack[i].color + "Num2"].textContent) + 1;
    } else if (
      i <
      thirdStageCardsAmount + secondStageCardsAmount + firstStageCardsAmount
    ) {
      tracker[shuffledPack[i].color + "Num1"].textContent =
        Number(tracker[shuffledPack[i].color + "Num1"].textContent) + 1;
    }
  }
}

function resetApp() {
  clearTracker();
  shuffledPack = [];
  lastCard.style.backgroundImage = "";
}

ancientsContainer.addEventListener("click", ancientsContainerClickHandler);
difficultyContainer.addEventListener("click", difficultyContainerClickHandler);
shuffleButton.addEventListener("click", shuffleButtonClickHandler);
deck.addEventListener("click", deckClickHandler);

window.addEventListener("click", () => {
  if (!isPlayed) {
    audio.play();
    isPlayed = true;
  }
});
