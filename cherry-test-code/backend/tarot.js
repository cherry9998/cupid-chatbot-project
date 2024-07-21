// const apiKey = key.env.API_KEY;
const apiKey = require('./key');

const OpenAI = require("openai");
const express = require("express");
var cors = require("cors");
const app = express();

const openai = new OpenAI({
  apiKey: apiKey,
});

// CORS 이슈 해결
let corsOptions = {
  origin: "http://127.0.0.1:5500",
  credentials: true,
};
app.use(cors(corsOptions));

// POST 요청 받을 수 있게 만듦
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST method route
app.post("/cupid-tarot", async function (req, res) {
  let { userQuestion, userWords } = req.body;
  let userSentence = userWords.join(", ");

  let messages = [
    {
      role: "system",
      content:
        "너는 최고의 연애타로 전문가야. 내가 질문이랑 세 가지 카드를 주면 해석해줄 수 있어. 최대한 자세하고 친절하게 설명해줘.",
    },
    {
      role: "user",
      content: `질문: ${userQuestion}\n다음 타로 카드를 해석해주세요: ${userSentence}`,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.05,
      max_tokens: 1000,
    });

    let gptResponse = completion.choices[0].message["content"];
    console.log(gptResponse);
    res.json({ assistant: gptResponse });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
