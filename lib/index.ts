import { Project, upload, preview } from 'miniprogram-ci'
import { Compiler, Stats } from 'webpack'

const codeSetting = {
  es6: true,
  es7: true,
  minifyJS: true,
  minifyWXML: true,
  minifyWXSS: true,
  minify: true,
  codeProtect: true,
  autoPrefixWXSS: true
}

export interface WabpackMpPluginOptions {
  isPreview: boolean,
  appid: string,
  key: string,
  ignores: string[],
  dir: string,

  output: string,
  page?: string,
  query?: string,
  scene?: number,

  version: string,
  desc: string
}

interface CompilerExt extends Compiler {
  plugin: (name: string, fn: (state: Stats, cb: any) => void) => void
}

export class WabpackMpPlugin {
  config: WabpackMpPluginOptions
  project

  constructor(config: WabpackMpPluginOptions) {
    this.config = config
  }

  apply(compiler: CompilerExt) {
    if (compiler.hooks && compiler.hooks.done) {

      compiler.hooks.done.tapAsync('WebpackOSSPlusPlugin', (state: Stats, cb) => {
        this.pluginDoneFn(state, cb)
      })
    } else {
      if (typeof compiler.plugin === 'undefined') return

      compiler.plugin('done', (state: Stats, cb) => {
        this.pluginDoneFn(state, cb)
      })
    }
  }

  pluginDoneFn(state: Stats, cb) {
    const {  appid, dir, key, ignores, isPreview } = this.config

    this.project = new Project({
      appid,
      type: 'miniProgram',
      projectPath: dir,
      privateKeyPath: key,
      ignores,
    })

    if (isPreview) {
      this.mpciPreview()
    } else {
      this.mpciUpload()
    }
    console.log('pluginEmitFnP:', new Date().getTime())
    console.log(this.config)
    cb()
  }

  async mpciUpload() {
    try {
      const { version, desc } = this.config
      const uploadResult = await upload({
        project: this.project,
        version,
        desc,
        setting: codeSetting,
        onProgressUpdate: console.log,
      })
      console.log(uploadResult)
    } catch (error) {
      console.error(error)
    }
  }

  async mpciPreview() {
    try {
      const { version, desc, output, page, query, scene } = this.config
      const previewResult = await preview({
        project: this.project,
        version,
        desc,
        setting: codeSetting,
        qrcodeFormat: 'image',
        qrcodeOutputDest: output,
        onProgressUpdate: console.log,
        pagePath: page,
        searchQuery: query,
        scene
      })

      console.log(previewResult)
    } catch (error) {
      console.error(error)
    }
  }
}