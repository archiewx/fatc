/*
 * @Author: zhenglfsir@gmail.com
 * @Date: 2018-06-21 18:13:05
 * @Last Modified by: zhenglfsir@gmail.com
 * @Last Modified time: 2018-06-22 09:43:51
 */

declare var window: Window
// 合并window对象
declare interface Window {}

declare type StoreType = {
  storeName: string
  optional?: { keyPath?: string; autoIncrement?: boolean }
}
declare type OptionType = {
  dbname: string
  version?: number
  stores: StoreType[]
}

declare const enum TRANSACTION_MODE {
  READWRITE = 'readwrite',
  READONLY = 'readonly',
  READWRITEFLUSH = 'readwriteflush',
  VERSIONCHANGE = 'versionchange'
}

declare class PromisifyIndexedDB {
  private dbname: string
  private version: number | void
  private IndexedDBInstance: null | IDBFactory
  private db: null | IDBDatabase
  private storeName: string
  private transaction: null | IDBTransaction
  private stores: StoreType[]

  public constructor(option: OptionType)

  private compatibilityCheck(): boolean

  private createIndexedDBInstance(): IDBDatabase

  private createObjectStore(
    storeName: string,
    optional: { keyPath?: string; aautoIncrement?: boolean }
  ): PromisifyIndexedDB

  private checkDb(): IDBDatabase

  private checkTransaction(): IDBTransaction

  private openCursor(
    query?: string | IDBKeyRange,
    direction?: 'next' | 'nextunique' | 'prev' | 'prevunique'
  ): IDBCursor

  public getDBInstance(): IDBDatabase

  public getTransactionInstance(): IDBTransaction

  public open(): Promise<PromisifyIndexedDB>

  public count(): Promise<number>

  public startTransaction(): Promise<PromisifyIndexedDB>

  public add(data: any[]): Promise<PromisifyIndexedDB>

  public get(key: string): Promise<any>

  public getAll(query?: string | IDBKeyRange): Promise<any>

  public delete(query?: string | IDBKeyRange): Promise<PromisifyIndexedDB>

  public clear(query?: string | IDBKeyRange): Promise<PromisifyIndexedDB>

  public put(item: any, key?: any): Promise<PromisifyIndexedDB>

  public close(): Promise<PromisifyIndexedDB>
}
