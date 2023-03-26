const Koa = require("koa")
const bodyParser = require("koa-bodyparser")
const Router = require("koa-router")
const { chatReply } = require("./chatgpt")

function startKoaServer() {
  const app = new Koa()
  const router = new Router()
  app.use(bodyParser())
  router.post("/chat", async (ctx) => {
    const { messages } = ctx.request.body

    const { error, answer } = await chatReply(messages)
    if (error) {
      ctx.status = 500
      ctx.body = error.message
    } else {
      // 返回响应
      ctx.status = 200
      ctx.body = { role: "assistant", content: answer } // 返回第一项响应的文本内容
    }
  })

  app.use(router.routes())

  app.listen(3000, () => {
    console.log("Server is running on port 3000")
  })
}

module.exports = { startKoaServer }
