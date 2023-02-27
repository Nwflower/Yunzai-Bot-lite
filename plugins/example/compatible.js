import lodash from "lodash";
import fs from "node:fs";

export class Compatible extends plugin {
  constructor () {
    super({
      name: '兼容插件',
      dsc: '兼容轻量版Yunzai-Bot无法使用Runtime的一些非原神函数问题',
      event: 'message',
      priority: -1,
    })
  }

  async accept () {
    this.e.runtime = {
      async render (plugin, path, data = {}, cfg = {}) {
        // 处理传入的path
        path = path.replace(/.html$/, '')
        let paths = lodash.filter(path.split('/'), (p) => !!p)
        path = paths.join('/')
        // 创建目录
        const mkdir = (check) => {
          let currDir = `${process.cwd()}/data`
          for (let p of check.split('/')) {
            currDir = `${currDir}/${p}`
            if (!fs.existsSync(currDir)) {
              fs.mkdirSync(currDir)
            }
          }
          return currDir
        }
        mkdir(`html/${plugin}/${path}`)
        // 自动计算pluResPath
        let pluResPath = `../../../${lodash.repeat('../', paths.length)}plugins/${plugin}/resources/`
        // 渲染data
        data = {
          ...data,
          _plugin: plugin,
          _htmlPath: path,
          pluResPath,
          tplFile: `./plugins/${plugin}/resources/${path}.html`,
          saveId: data.saveId || data.save_id || paths[paths.length - 1],
          pageGotoParams: {
            waitUntil: 'networkidle0'
          }
        }
        // 处理beforeRender
        if (cfg.beforeRender) {
          data = cfg.beforeRender({ data }) || data
        }
        // 保存模板数据
        if (process.argv.includes('web-debug')) {
          // debug下保存当前页面的渲染数据，方便模板编写与调试
          // 由于只用于调试，开发者只关注自己当时开发的文件即可，暂不考虑app及plugin的命名冲突
          let saveDir = mkdir(`ViewData/${plugin}`)
          let file = `${saveDir}/${data._htmlPath.split('/').join('_')}.json`
          fs.writeFileSync(file, JSON.stringify(data))
        }
        // 截图
        let base64 = await puppeteer.screenshot(`${plugin}/${path}`, data)
        if (cfg.retType === 'base64') {
          return base64
        }
        let ret = true
        if (base64) {
          ret = await this.e.reply(base64)
        }
        return cfg.retType === 'msgId' ? ret : true
      }
    }
  }
}
