const axios = require("axios")

// 设置请求参数
const DefaultOption = {
  method: "POST",
  url: "https://api.openai.com/v1/chat/completions",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // 在.env文件中替换为您的 API 密钥
  },
  data: {
    model: "gpt-3.5-turbo",
    // messages: [{ role: "user", content: "Hello! Is my api key worked now?" }],
  },
}

async function chatReply(messages) {
  // 更新 API 请求参数

  const option = DefaultOption
  option.data.messages = messages

  try {
    if (messages && messages.length) {
      for (const msg of messages) {
        if (!msg.role || !msg.content) {
          throw new Error("messages参数有误")
        }
      }
    } else {
      throw new Error("messages参数为空")
    }

    // 发送 ChatGPT API 请求
    const response = await axios(option)
    const { choices, usage } = response.data

    const answer = choices[0].message.content.trim()
    return { error: null, answer }
  } catch (error) {
    // 返回错误
    return { error, answer: "" }
  }
}

module.exports = { chatReply }
