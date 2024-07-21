// const apiKey = key.env.API_KEY;
require('dotenv').config();

const OpenAI = require("openai");
const express = require("express");
var cors = require("cors");
const app = express();

const openai = new OpenAI({
  apiKey: key.env.API_KEY,
});

// CORS 이슈 해결
// 아무데서나 요청이 오는 것을 다 받으면 안 된다 -> 어디서 요청이 왔는지 확인하는 과정 ?
let corsOptions = {
  origin: "http://127.0.0.1:5500",
  credentials: true,
};
app.use(cors(corsOptions));

// POST 요청 받을 수 있게 만듦
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST method route
app.post("/cupid-chatbot", async function (req, res) {
  let { myInfo, userMessages, assistantMessages } = req.body;

  let messages = [
    {
      role: "system",
      content:
        "너는 동성 친구고, 연애 상담 마스터야. 친근하고 친구처럼 일상적인 말투로 말해줘. 너는 연애에 대해서는 모르는 게 없는 사람이야. 너무 긍정적으로만 말하지 말고 때로는 현실적인 조언도 해줄 줄 아는 사람이야.",
    }, // 시스템한테 역할 부여
    {
      role: "user",
      content:
        "너는 동성 친구고, 연애 상담 마스터야. 친근하고 친구처럼 일상적인 말투로 말해줘. 너는 연애에 대해서는 모르는 게 없는 사람이야. ",
    },
    {
      role: "assistant",
      content:
        "와우, 연애 상담이라니, 어떻게 도와줄까? 무슨 고민이 있니? 편하게 이야기해봐!",
    }, // assistant의 답변을 복붙
    {
      role: "assistant",
      content:
        "그럼 먼저 연애 상대가 누군지 알려줘! 그리고 그 사람과의 관계에 대해서 좀 더 자세히 이야기해줄래?",
    },
    // {role: "user", content: "연애 상담을 시작해줘"},
    { role: "user", content: myInfo },
    // 오늘 나이 알려주는 것 추가하기

    {
      role: "assistant",
      content:
        "당신의 기본 정보를 확인했습니다. 연애에 대해서 어떤 것이든 물어봐!",
    },
  ];

  while (userMessages.length != 0 || assistantMessages.length != 0) {
    if (userMessages.length != 0) {
      messages.push(
        JSON.parse(
          '{"role": "user", "content": "' +
            String(userMessages.shift()).replace(/\n/g, "") +
            '"}'
        )
      );
    }
    if (assistantMessages.length != 0) {
      messages.push(
        JSON.parse(
          '{"role": "assistant", "content": "' +
            String(assistantMessages.shift()).replace(/\n/g, "") +
            '"}'
        )
      );
    }

    console.log(messages);
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    /*
      필요한 경우 parameter 추가
      max_tokens: 100,
      temperature: 0.5,
      */
    messages: messages,
  });

  let cupid = completion.choices[0].message["content"];
  console.log(cupid);
  res.json({ assistant: cupid });
});
app.listen(3000);
