let userMessages = [];
let assistantMessages = [];
let myInfo = "";

function start() {
  const date = document.getElementById("date").value;
  const gender = document.getElementById("gender-select").value;

  /*
    if(date === '') {
        alert('생년월일을 입력해주세요.');
        return;
    }
    if(gender === '') {
        alert('성별을 입력해주세요.');
        return;
    }
    */

  myInfo =
    "내 나이는 " +
    date.split("-")[0] +
    "년생이고" +
    " 내 성별은 " +
    gender +
    "이야.";
  console.log(myInfo);
  document.getElementById("intro").style.display = "none";
  document.getElementById("chat").style.display = "block";
}

function spinner() {
  document.getElementById("loader").style.display = "block";
  document.getElementById("send-button").style.display = "none";
}

// Initial messages from the bot
const initialMessages = [
  "안녕하세요! 연애 챗봇에 오신 것을 환영합니다. 저는 연애에 관한 질문에 답변해드릴 수 있어요. 무엇을 도와드릴까요?",
  "연애에 대해 궁금한 게 있으신가요? 자유롭게 질문해주세요!",
  "저는 여러분의 연애 고민을 듣고 함께 해결해드릴 수 있어요. 어떤 것이든 말씀해주세요!",
];

// Function to display initial messages from the bot
function displayInitialMessages() {
  initialMessages.forEach((message) => {
    addMessageToChat(message, "bot");
  });
}

// Display initial messages when the chat UI loads
displayInitialMessages();

async function postData(message) {
  try {
    const response = await fetch("http://localhost:3000/cupid-chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        myInfo: myInfo,
        userMessages: userMessages,
        assistantMessages: assistantMessages,
      }),
    });

    const data = await response.json();

    console.log(data);
    document.getElementById("loader").style.display = "none";
    document.getElementById("send-button").style.display = "block";

    return data;
  } catch (error) {
    console.error(error);
  }
}

function addMessageToChat(message, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  messageElement.textContent = message;
  document.getElementById("messages").appendChild(messageElement);
  document.getElementById("messages").scrollTop =
    document.getElementById("messages").scrollHeight;
}

async function sendMessage() {
  const inputElement = document.getElementById("user-input");
  const message = inputElement.value;

  // userMessage에 메세지 추가
  userMessages.push(message);

  if (message.trim() === "") return;

  addMessageToChat(message, "user");
  inputElement.value = "";

  const botResponse = await postData(message);
  if (botResponse && botResponse.assistant) {
    addMessageToChat(botResponse.assistant, "bot"); // Adding assistant's response to the chat UI

    // assistantMessage 메세지 추가
    assistantMessages.push(botResponse.assistant);
  }
}

document.getElementById("send-button").addEventListener("click", sendMessage);
