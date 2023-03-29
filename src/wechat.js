const { WechatyBuilder } = require("wechaty")
const { chatReply } = require("./chatgpt")

const wechaty = WechatyBuilder.build() // get a Wechaty instance

const config = require("./config")

const activeContactList = []
const limitCount = 20
let startTime
let userName = ""

function setToActive(obj) {
  const aim = activeContactList.find((el) => el.id === obj.id)
  if (aim) {
    aim.active = true
  } else {
    obj.startTime = new Date()
    obj.limitCount = limitCount
    obj.active = true
    activeContactList.push(obj)
  }
}

function setUnactive(obj) {
  const aim = activeContactList.find((el) => el.id === obj.id)
  if (aim) {
    aim.active = false
  }
}

function startWechatyServer() {
  startTime = new Date()
  wechaty
    .on("scan", (qrcode, status) =>
      console.log(
        `Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(
          qrcode
        )}`
      )
    )
    .on("login", async (user) => {
      console.log(`User ${user} logged in`)
      userName = user.name()
    })
    .on("message", onMessage)
  wechaty.start()
}

async function onMessage(msg) {
  // 避免重复发送
  if (msg.date() < startTime) {
    return
  }

  // 不回复本人信息
  if (msg.self()) {
    return
  }

  const contact = msg.talker()
  let content = msg.text().trim()
  const room = msg.room()
  const contactName = (await contact.alias()) || (await contact.name()) //对话人
  const isText = msg.type() === wechaty.Message.Type.Text

  if (room && isText) {
    const topic = await room.topic()
    console.log(
      `Group name: ${topic} talker: ${contactName} content: ${content} `
    )
    // 如果有引用 先去除
    const pattern0 = RegExp(`「(.+?)」\n- - - - - - - - - - - - - - -\n`)
    if (pattern0.test(content)) {
      content = content.replace(pattern0, "")
    }

    // 群聊需要@bot
    const pattern = RegExp(`^@${userName}\\s+`)

    if (pattern.test(content)) {
      const groupContent = content.replace(pattern, " ")
      replyMessage(room, groupContent, true)
      return
    } else {
      // console.log("群聊格式检测错误")
    }
  } else if (isText) {
    console.log(`talker: ${contactName} content: ${content}`)
    if (config.autoReply) {
      replyMessage(contact, content)
    }
  }
}

async function replyMessage(contact, content, inGroup = false) {
  const groupTip = inGroup ? "@我 " : ""
  try {
    // 结束
    if (
      !inGroup &&
      content.trim().toLocaleLowerCase() ===
        config.cancelKeyWord.toLocaleLowerCase()
    ) {
      const i = activeContactList.findIndex((el) => el.id == contact.id)
      if (i !== -1) {
        activeContactList.splice(i, 1)
        await contact.say(
          `好的，对话已结束。下次还可以${groupTip}发送“${config.activeKeyWord}”重新激活`
        )
      }

      return
    }

    // 开始
    let exist = activeContactList.find((el) => el.id == contact.id)
    // 群内不需要激活，@就可以回复
    if (!exist && inGroup) {
      setToActive(contact)
      exist = activeContactList.find((el) => el.id == contact.id)
    } else if (
      !inGroup &&
      content.trim().toLocaleLowerCase() ==
        config.activeKeyWord.toLocaleLowerCase()
    ) {
      contact.say(
        `收到，已经开启自动对话，有什么想要和我聊的？如需结束对话请${groupTip}回复“结束”`
      )

      if (!exist) {
        // activeContactList.push(contact)
        setToActive(contact)
      }

      return
    } else if (
      !exist &&
      !inGroup &&
      content.trim().toLocaleLowerCase() !==
        config.activeKeyWord.toLocaleLowerCase()
    ) {
      contact.say(
        `你好，尚未开启对话模式，如需对话请回复 ${config.activeKeyWord}`
      )

      return
    }

    //正常问答
    if (exist) {
      //监测是否超时超限
      if (!exist.active) {
        //未激活不回应
        return
      }

      if (exist.limitCount <= 0) {
        setUnactive()
        contact.say(`抱歉，您的${limitCount}次限额已用尽。请联系管理员。`)
        return
      }

      let message = ""
      const input = [{ role: "user", content }]
      const { error, answer } = await chatReply(input)
      if (error) {
        contact.say("对话系统错误，暂时不可用")
        console.error(error)
        return
      } else {
        message = answer
      }

      if (
        (contact.topic && contact.topic() && config.groupReplyMode) ||
        (!contact.topic && config.privateReplyMode)
      ) {
        const result = `${content}\n-----------\n${message}`
        await contact.say(result)
      } else {
        await contact.say(message)
      }

      exist.limitCount--
    }
  } catch (e) {
    console.error(e)
    if (e.message.includes("timed out")) {
      await contact.say(`${content}\n-----------\n错误：网络请求超时。`)
    }
  }
}

module.exports = { startWechatyServer }
