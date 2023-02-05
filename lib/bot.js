import './config/init.js'
import ListenerLoader from './listener/loader.js'
import { Client } from 'oicq'
import cfg from './config/config.js'

export default class Yunzai extends Client {
  constructor (uin, conf) {
    super(uin, conf)
    /** 加载oicq事件监听 */
    ListenerLoader.load(this)
  }

  /** 登录机器人 */
  static async run () {
    const bot = new Yunzai(cfg.qq, cfg.bot)
    await bot.login(cfg.pwd)
    return bot
  }
}
