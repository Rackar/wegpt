require("dotenv").config()
const { startKoaServer } = require("./koa")
const { startWechatyServer } = require("./wechat")

startKoaServer()
startWechatyServer()
