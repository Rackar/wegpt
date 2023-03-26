# WeGPT
微信的ChatGPT机器人。微信扫描登录后，单聊中输入config.js中的激活词汇发送，可激活对话模式。 群聊无需激活，每次 @bot 加空格直接发送消息。所用微信号需要经过实名认证。目前限制可提问20次。

测试可以添加我的机器人微信号:"Letschatbot"

## 部署说明

Node.js部署服务器必须是可以直连OpenAI API的外网服务器（大陆、香港均不能连接），我用的Vultr的美国服务器测试可行，用这个[链接注册](https://www.vultr.com/?ref=9408808-8H)可以获取$100的额度。

clone后需要在复制.env.example为.env文件，修改其中的 openAI token为你自己的。

```s
git clone https://github.com/Rackar/wegpt
cd ./wegpt
cp .env.example .env
vi .env # 复制token进去后保存退出命令 :wq
npm i -g pnpm pm2
pnpm i
pnpm start #本地调试
```

部署运行可以使用pm2 

启动服务 `pm2 start src/index.js`

查看登录二维码 `pm2 logs`

