/*
 * @Author: zhenglfsir@gmail.com
 * @Date: 2018-06-21 15:50:00
 * @Last Modified by: zhenglfsir@gmail.com
 * @Last Modified time: 2018-06-21 16:49:25
 */

type StoreType = {
  storeName: string
  optional?: { keyPath?: string; autoIncrement?: boolean }
}
type OptionType = {
  dbname: string
  version?: number
  stores: StoreType[]
}

enum TRANSACTION_MODE {
  READWRITE = 'readwrite',
  READONLY = 'readonly',
  READWRITEFLUSH = 'readwriteflush',
  VERSIONCHANGE = 'versionchange'
}

const isDev = process.env.NODE_ENV !== 'production'
const { log, warn, error } = (() => ({
  log(message: any, ...optional: any[]) {
    console.log('[promisify log]', message, ...optional)
  },
  warn(message: any, ...optional: any[]) {
    console.warn('[promisify warn]', message, ...optional)
  },
  error(message: any, ...optional: any[]) {
    console.error('[promise error]', message, ...optional)
  }
}))()
let startTime = 0
const { startTiming, finishTiming } = (() => ({
  startTiming() {
    startTime = Date.now()
    return true
  },
  finishTiming() {
    return Date.now() - startTime
  }
}))()

/**
 * 1. 新建实例
 * 2. 能够存单个或者多个{any}数据
 * 3. 能够读取单个或者多个{any}数据
 * 4. 能够暴露实例出来
 * 5. 全部使用Promise
 */
class PromisifyIndexedDB {
  dbname: string
  version: number | void
  IndexedDBInstance: null | IDBFactory
  db: null | IDBDatabase
  storeName: string
  transaction: null | IDBTransaction
  stores: StoreType[]

  constructor(option: OptionType) {
    this.dbname = option.dbname
    this.version = option.version
    this.stores = option.stores
    this.IndexedDBInstance = null
    this.db = null
    this.storeName = ''
    this.transaction = null
    if (!this.compatibilityCheck) {
      throw new Error('当前浏览器不支持indexedDB')
    }
  }

  compatibilityCheck = () => {
    const indexedDB =
      window.indexedDB ||
      (<any>window).mozIndexedDB ||
      (<any>window).webkitIndexedDB ||
      (<any>window).msIndexedDB
    const IDBTransaction =
      (<any>window).IDBTransaction ||
      (<any>window).webkitIDBTransaction ||
      (<any>window).msIDBTransaction
    const IDBKeyRange =
      (<any>window).IDBKeyRange || (<any>window).webkitIDBKeyRange || (<any>window).msIDBKeyRange
    return indexedDB && IDBTransaction && IDBKeyRange
  }

  createIndexedDBInstance = () => {
    if (!this.IndexedDBInstance) {
      this.IndexedDBInstance =
        window.indexedDB ||
        (<any>window).mozIndexedDB ||
        (<any>window).webkitIndexedDB ||
        (<any>window).msIndexedDB
    }
    return this.IndexedDBInstance
  }

  checkDb = () => {
    if (!this.db) {
      const msg = `未连接数据库IndexedDB[${this.dbname}]`
      isDev && warn(msg)
      throw new Error(msg)
    }
    return this.db
  }

  checkTransaction = () => {
    if (!this.transaction) {
      const msg = `未开启事务[${this.dbname}]`
      isDev && warn(msg)
      throw new Error(msg)
    }
    return this.transaction
  }

  getDBInstance = () => {
    return this.checkDb()
  }

  getTransactionInstance = () => {
    return this.checkTransaction()
  }

  open = () => {
    const request = this.createIndexedDBInstance().open(this.dbname, this.version || 1)
    return new Promise((resolve, reject) => {
      request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
        isDev && warn(`更新当前[${this.dbname}]`)
        this.db = request.result
        for (const store of this.stores) {
          this.createObjectStore(store.storeName, { ...store.optional })
        }
      }
      request.onsuccess = (e) => {
        isDev && log('初始化成功')
        this.db = request.result
        resolve && resolve(this)
      }
      request.onerror = (err) => {
        isDev && warn('初始化数据库失败')
        reject && reject(err)
        throw new Error('初始化数据库失败')
      }
    })
  }

  // 必须在upgradeend内创建objectstore
  createObjectStore = (
    storeName: string,
    optional: { keyPath?: string; autoIncrement?: boolean } = {
      keyPath: 'id',
      autoIncrement: false
    }
  ) => {
    const db = this.checkDb()
    const { objectStoreNames } = db
    const stores = Array.from(objectStoreNames)
    if (!stores.length || stores.indexOf(storeName) === -1) {
      isDev && log(`${storeName}创建成功`)
      db.createObjectStore(storeName, { ...optional })
    } else {
      isDev && log('存在objectStores', objectStoreNames)
    }
    return this
  }

  count = (query?: string | IDBKeyRange) => {
    const transaction = this.checkTransaction()
    const objectStore = transaction.objectStore(this.storeName)
    const countRequest = objectStore.count(query)
    return new Promise((resolve, reject) => {
      countRequest.onsuccess = (e) => {
        const count = countRequest.result
        isDev && log(`获取到${count}条数数据`)
        resolve(count)
      }
      countRequest.onerror = (err) => {
        isDev && error('获取count失败')
        reject(err)
      }
    })
  }

  /**
   * 开启事务
   */
  startTransaction = (
    storeName: string,
    mode: 'readonly' | 'readwrite' | 'versionchange' | undefined = 'readwrite'
  ) => {
    this.storeName = storeName
    const db = this.checkDb()
    isDev && startTiming() && log('开启事务')
    const transaction = db.transaction(storeName, mode)
    this.transaction = transaction
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        isDev && log(`[${this.storeName}]执行成功,完成事务, 用时:${finishTiming()}ms`)
      }
      transaction.onerror = (err) => {
        isDev && error(err)
        reject && reject(err)
      }
      resolve(this)
    })
  }

  add = (data: any[]) => {
    const transaction = this.checkTransaction()

    const objectStore = transaction.objectStore(this.storeName)
    let { keyPath } = objectStore
    if (!keyPath) {
      return Promise.resolve(this)
    }
    if (typeof keyPath === 'object') {
      keyPath = keyPath[0]
    }
    const key = keyPath
    return Promise.all(
      data.map(async (item) => {
        const alreadyItem = await this.get(item[key])
        if (alreadyItem) {
          isDev && warn('已存在该数据', item)
        } else {
          const request = objectStore.add(item)
          request.onsuccess = () => {
            isDev && log('添加一条成功:', item)
          }
          request.onerror = (err) => {
            isDev && error(err)
            throw new Error('添加失败')
          }
        }
      })
    )
      .then(() => {
        isDev && log('全部添加成功')
        return this
      })
      .catch((err) => {
        isDev && log('添加失败')
        throw new Error(err)
      })
  }

  get = (key: string) => {
    return new Promise((reslove, reject) => {
      const transaction = this.checkTransaction()
      const objectStore = transaction.objectStore(this.storeName)
      const getRequest = objectStore.get(key)
      getRequest.onsuccess = (e) => {
        isDev && log('获取成功:', getRequest.result)
        reslove(getRequest.result)
      }
      getRequest.onerror = (err) => {
        isDev && error('获取失败', err)
        reject(err)
      }
    })
  }

  getAll = (query?: string | IDBKeyRange) => {
    const cursorRequest = this.openCursor(query)
    const data: any[] = []
    return new Promise((resolve, reject) => {
      cursorRequest.onsuccess = (e) => {
        const cursor = cursorRequest.result
        if (cursor) {
          data.push(cursor.value)
          cursor.continue()
        } else {
          isDev && log('获取全部数据成功')
          resolve(data)
        }
      }
      cursorRequest.onerror = (e) => {
        isDev && error('获取全部数据失败', e)
        reject(e)
      }
    })
  }

  delete = (key: string | IDBKeyRange) => {
    const transaction = this.checkTransaction()
    const objectStore = transaction.objectStore(this.storeName)
    const deleteRequest = objectStore.delete(key)
    return new Promise((resolve, reject) => {
      deleteRequest.onsuccess = () => {
        isDev && log(`${key.toString()}删除成功`)
        resolve(this)
      }
      deleteRequest.onerror = (err) => {
        isDev && log(`${key.toString()}删除失败`)
        reject(err)
      }
    })
  }

  clear = (query?: string | IDBKeyRange) => {
    const transaction = this.checkTransaction()
    const objectStore = transaction.objectStore(this.storeName)
    const cursorRequest = objectStore.openCursor(query)
    return new Promise((resolve, reject) => {
      cursorRequest.onsuccess = (e) => {
        const cursor = cursorRequest.result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          isDev && warn(`清空[${this.storeName}]数据成功`)
          resolve(this)
        }
      }
      cursorRequest.onerror = (err) => {
        isDev && error(`清空[${this.storeName}]数据失败`)
        reject(err)
      }
    })
  }

  put = (item: any, key?: string | number) => {
    const transaction = this.checkTransaction()
    const objectStore = transaction.objectStore(this.storeName)
    const putRequest = objectStore.put(item, key)
    return new Promise((resolve, reject) => {
      putRequest.onsuccess = () => {
        isDev && log('更新成功')
        resolve(this)
      }
      putRequest.onerror = (err) => {
        isDev && error('更新失败')
        reject(err)
      }
    })
  }

  openCursor = (
    query?: string | IDBKeyRange,
    direction: 'next' | 'nextunique' | 'prev' | 'prevunique' = 'next'
  ) => {
    const transaction = this.checkTransaction()
    const objectStore = transaction.objectStore(this.storeName)
    const cursorRequest = objectStore.openCursor(query, direction)
    return cursorRequest
  }

  /**
   * 关闭数据库
   */
  close = () => {
    const db = this.checkDb()
    return new Promise((resolve, reject) => {
      db.onerror = (err) => {
        isDev && error('关闭数据库错误')
        reject(err)
      }
      db.close()
    })
  }
}

export default PromisifyIndexedDB
