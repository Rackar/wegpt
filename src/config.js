module.exports = {
  // 设置获取消息的重试次数
  retryTimes: 3,

  // 开启会后收到ChatGPT的自动回复
  autoReply: true,

  // 是否在群聊中按照回复的格式进行回复
  groupReplyMode: true,
  // 是否在私聊中按照回复的格式进行回复
  privateReplyMode: false,

  activeKeyWord: "letschatbot",
  cancelKeyWord: "结束",
  activeCacheTime: 15, //激活后15分钟没有提问，则需要重新激活
  askRateLimit: 10, //10次/天/用户
  askInGroup: false, //是否在群聊中回答
}
