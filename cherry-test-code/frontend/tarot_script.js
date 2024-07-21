const tarotCards = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Hierophant",
  "The Lovers",
  "The Chariot",
  "Strength",
  "The Hermit",
  "Wheel of Fortune",
  "Justice",
  "The Hanged Man",
  "Death",
  "Temperance",
  "The Devil",
  "The Tower",
  "The Star",
  "The Moon",
  "The Sun",
  "Judgement",
  "The World",
  "Ace of Cups",
  "Two of Cups",
  "Three of Cups",
  "Four of Cups",
  "Five of Cups",
  "Six of Cups",
  "Seven of Cups",
  "Eight of Cups",
  "Nine of Cups",
  "Ten of Cups",
  "Page of Cups",
  "Knight of Cups",
  "Queen of Cups",
  "King of Cups",
  "Ace of Pentacles",
  "Two of Pentacles",
  "Three of Pentacles",
  "Four of Pentacles",
  "Five of Pentacles",
  "Six of Pentacles",
  "Seven of Pentacles",
  "Eight of Pentacles",
  "Nine of Pentacles",
  "Ten of Pentacles",
  "Page of Pentacles",
  "Knight of Pentacles",
  "Queen of Pentacles",
  "King of Pentacles",
  "Ace of Swords",
  "Two of Swords",
  "Three of Swords",
  "Four of Swords",
  "Five of Swords",
  "Six of Swords",
  "Seven of Swords",
  "Eight of Swords",
  "Nine of Swords",
  "Ten of Swords",
  "Page of Swords",
  "Knight of Swords",
  "Queen of Swords",
  "King of Swords",
  "Ace of Wands",
  "Two of Wands",
  "Three of Wands",
  "Four of Wands",
  "Five of Wands",
  "Six of Wands",
  "Seven of Wands",
  "Eight of Wands",
  "Nine of Wands",
  "Ten of Wands",
  "Page of Wands",
  "Knight of Wands",
  "Queen of Wands",
  "King of Wands",
];

const cardsContainer = document.querySelector(".cards");
const shuffleButton = document.querySelector(".shuffle-button");
const readingContainer = document.getElementById("chat-container"); // 기존 reading을 담을 컨테이너
let selectedCards = [];

function createCards() {
    cardsContainer.innerHTML = "";
    selectedCards = [];
    let selectedIndexes = [];
    while (selectedIndexes.length < 9) {
        const index = Math.floor(Math.random() * tarotCards.length);
        if (!selectedIndexes.includes(index)) {
            selectedIndexes.push(index);
        }
    }
    selectedIndexes.forEach((index) => {
        const cardName = tarotCards[index];
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-back"></div>
                <div class="card-front" style="background-image: url('images/${cardName.toLowerCase().replace(/ /g, "_")}.png')"></div>
            </div>
        `;
        card.addEventListener("click", () => flipCard(card));
        cardsContainer.appendChild(card);
    });
}

function flipCard(card) {
    if (card.classList.contains("flip") || selectedCards.length >= 3) return;
    card.classList.add("flip");
    const cardName = card.querySelector(".card-front").style.backgroundImage.split("/").pop().split(".")[0].replace(/_/g, " ");
    selectedCards.push(cardName);
    if (selectedCards.length === 3) {
        displayReading();
    }
}

function displayReading() {
    const reading = getReading(selectedCards);
    displayResultMessage(reading);
}

function getReading(cards) {
    let reading = "";
    reading += `Card 1: ${cards[0]} - ${getCardMeaning(cards[0])}\n\n`;
    reading += `Card 2: ${cards[1]} - ${getCardMeaning(cards[1])}\n\n`;
    reading += `Card 3: ${cards[2]} - ${getCardMeaning(cards[2])}\n\n`;
    return reading; // 변경: reading을 반환하도록 수정
}

function getCardMeaning(card) {
    const meanings = {
        "the fool": "A fresh start, curiosity, new possibilities.",
        "the magician": "Skill, logic, intellect.",
        // ... 다른 카드 의미 ...
    };
    return meanings[card.toLowerCase()] || "Unknown card meaning";
}

shuffleButton.addEventListener("click", () => {
    createCards();
});

createCards();

// 초기화
let userQuestion = "";
let userWords = [];

// 결과 메시지를 보여주는 함수
function displayResultMessage(result) {
    readingContainer.innerHTML = ""; // 기존 내용 삭제

    const resultElement = document.createElement("div");
    resultElement.classList.add("result");

    const responses = result.split("\n");
    responses.forEach((response) => {
        const responseLine = document.createElement("p");
        responseLine.textContent = response;
        resultElement.appendChild(responseLine);
    });

    readingContainer.appendChild(resultElement);
    console.log(resultElement);
}

async function postData(question, words) {
    try {
        document.getElementById("loader").style.display = "block";

        const response = await fetch("http://localhost:3000/cupid-tarot", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userQuestion: question,
                userWords: words,
            }),
        });

        const data = await response.json();
        console.log(data);

        document.getElementById("loader").style.display = "none";
        displayResultMessage(data.assistant);
    } catch (error) {
        console.error(error);
        document.getElementById("loader").style.display = "none";
        displayResultMessage("An error occurred. Please try again.");
    }
}

async function sendMessage() {
    const questionElement = document.getElementById("user-question");
    const question = questionElement.value.trim();

    if (question === "") return;

    userWords = selectedCards;
    console.log(userWords);

    questionElement.value = "";

    await postData(question, userWords);
}

document.getElementById("send-button").addEventListener("click", sendMessage);
