import Immutable from 'immutable'

class Persist {
  private model: string
  private type: 'session' | 'local' = 'session'
  private storage: object
  private key: string = 'fatc:persist'
  private sync: boolean
  private afterSync: () => {}

  constructor(props) {
    this.model = props.model
    // 获取持久化类型
    this.type = props.type || 'session'
    // 动态使用require加载数据
    // eslint-disable-next-line
    this.storage = require(`./${props.model}`)
    this.key = `${props.key || 'duoke3'}:persist`
    this.sync = props.sync
    this.afterSync = props.afterSync
    // eslint-disable-next-line
    this._init()
  }

  _init = () => {
    const storage = window[`${this.type}Storage`]
    if (!storage.getItem(this.key)) {
      storage.setItem(this.key, JSON.stringify({}))
    }
    // 获取持久化模块
    this.storage.init(this.key, this.type)
  }

  setStorage = (data) => {
    const dataStr = JSON.stringify(data)
    this.storage.setData(dataStr)
  }

  getStorage = () => {
    const dataStr = this.storage.getData()
    return dataStr && JSON.parse(dataStr)
  }

  wrapperResult = (target, thisArgs, args) => {
    // 判断当前持久化模块是否有数据
    if (this.storage.hasData() && !this.sync) {
      return Promise.resolve(this.getStorage())
    }
    return new Promise((resolve) => {
      const funcResult = target.apply(thisArgs, args)
      if (funcResult instanceof Promise) {
        funcResult.then((data) => {
          // 判断数据是否改变
          const newData = Immutable.fromJS(data)
          const oldData = Immutable.fromJS(this.getStorage())
          const isUpdate = !Immutable.is(newData, oldData)
          if (isUpdate) {
            this.setStorage(data)
          }
          this.afterSync && this.afterSync(isUpdate)
          resolve(data)
        })
      } else {
        resolve(funcResult)
      }
    })
  }

  wrapperFunc = (fn) => {
    const that = this
    if (Proxy) {
      // 支持Proxy
      return new Proxy(fn, {
        // 拦截请求
        apply(target, thisArgs, args) {
          return that.wrapperResult(target, thisArgs, args)
        }
      })
    }
    // 不支持Proxy 环境
    return function proxy(...args) {
      return that.wrapperResult(fn, this, args)
    }
  }

  static use = (fn, props) => {
    const instance = new Persist(props)
    if (typeof fn !== 'function') {
      throw new TypeError('fn’s paramster is function')
    }
    return instance.wrapperFunc(fn, instance)
  }
}

export default Persist
