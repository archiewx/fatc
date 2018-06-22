'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

/*
 * @Author: zhenglfsir@gmail.com
 * @Date: 2018-06-21 15:50:00
 * @Last Modified by: zhenglfsir@gmail.com
 * @Last Modified time: 2018-06-22 09:45:34
 */
var isDev = process.env.NODE_ENV !== 'production';
var _a = (function () { return ({
    log: function (message) {
        var optional = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optional[_i - 1] = arguments[_i];
        }
        console.log.apply(console, ['[promisify log]', message].concat(optional));
    },
    warn: function (message) {
        var optional = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optional[_i - 1] = arguments[_i];
        }
        console.warn.apply(console, ['[promisify warn]', message].concat(optional));
    },
    error: function (message) {
        var optional = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optional[_i - 1] = arguments[_i];
        }
        console.error.apply(console, ['[promise error]', message].concat(optional));
    }
}); })(), log = _a.log, warn = _a.warn, error = _a.error;
var startTime = 0;
var _b = (function () { return ({
    startTiming: function () {
        startTime = Date.now();
        return true;
    },
    finishTiming: function () {
        return Date.now() - startTime;
    }
}); })(), startTiming = _b.startTiming, finishTiming = _b.finishTiming;
/**
 * 1. 新建实例
 * 2. 能够存单个或者多个{any}数据
 * 3. 能够读取单个或者多个{any}数据
 * 4. 能够暴露实例出来
 * 5. 全部使用Promise
 */
var PromisifyIndexedDB = /** @class */ (function () {
    function PromisifyIndexedDB(option) {
        var _this = this;
        this.compatibilityCheck = function () {
            var indexedDB = window.indexedDB ||
                window.mozIndexedDB ||
                window.webkitIndexedDB ||
                window.msIndexedDB;
            var IDBTransaction = window.IDBTransaction ||
                window.webkitIDBTransaction ||
                window.msIDBTransaction;
            var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
            return indexedDB && IDBTransaction && IDBKeyRange;
        };
        this.createIndexedDBInstance = function () {
            if (!_this.IndexedDBInstance) {
                _this.IndexedDBInstance =
                    window.indexedDB ||
                        window.mozIndexedDB ||
                        window.webkitIndexedDB ||
                        window.msIndexedDB;
            }
            return _this.IndexedDBInstance;
        };
        this.checkDb = function () {
            if (!_this.db) {
                var msg = "\u672A\u8FDE\u63A5\u6570\u636E\u5E93IndexedDB[" + _this.dbname + "]";
                isDev && warn(msg);
                throw new Error(msg);
            }
            return _this.db;
        };
        this.checkTransaction = function () {
            if (!_this.transaction) {
                var msg = "\u672A\u5F00\u542F\u4E8B\u52A1[" + _this.dbname + "]";
                isDev && warn(msg);
                throw new Error(msg);
            }
            return _this.transaction;
        };
        this.getDBInstance = function () {
            return _this.checkDb();
        };
        this.getTransactionInstance = function () {
            return _this.checkTransaction();
        };
        this.open = function () {
            var request = _this.createIndexedDBInstance().open(_this.dbname, _this.version || 1);
            return new Promise(function (resolve, reject) {
                request.onupgradeneeded = function (e) {
                    isDev && warn("\u66F4\u65B0\u5F53\u524D[" + _this.dbname + "]");
                    _this.db = request.result;
                    for (var _i = 0, _a = _this.stores; _i < _a.length; _i++) {
                        var store = _a[_i];
                        _this.createObjectStore(store.storeName, __assign({}, store.optional));
                    }
                };
                request.onsuccess = function (e) {
                    isDev && log('初始化成功');
                    _this.db = request.result;
                    resolve && resolve(_this);
                };
                request.onerror = function (err) {
                    isDev && warn('初始化数据库失败');
                    reject && reject(err);
                    throw new Error('初始化数据库失败');
                };
            });
        };
        // 必须在upgradeend内创建objectstore
        this.createObjectStore = function (storeName, optional) {
            if (optional === void 0) { optional = {
                keyPath: 'id',
                autoIncrement: false
            }; }
            var db = _this.checkDb();
            var objectStoreNames = db.objectStoreNames;
            var stores = Array.from(objectStoreNames);
            if (!stores.length || stores.indexOf(storeName) === -1) {
                isDev && log(storeName + "\u521B\u5EFA\u6210\u529F");
                db.createObjectStore(storeName, __assign({}, optional));
            }
            else {
                isDev && log('存在objectStores', objectStoreNames);
            }
            return _this;
        };
        this.count = function (query) {
            var transaction = _this.checkTransaction();
            var objectStore = transaction.objectStore(_this.storeName);
            var countRequest = objectStore.count(query);
            return new Promise(function (resolve, reject) {
                countRequest.onsuccess = function (e) {
                    var count = countRequest.result;
                    isDev && log("\u83B7\u53D6\u5230" + count + "\u6761\u6570\u6570\u636E");
                    resolve(count);
                };
                countRequest.onerror = function (err) {
                    isDev && error('获取count失败');
                    reject(err);
                };
            });
        };
        /**
         * 开启事务
         */
        this.startTransaction = function (storeName, mode) {
            if (mode === void 0) { mode = 'readwrite'; }
            _this.storeName = storeName;
            var db = _this.checkDb();
            isDev && startTiming() && log('开启事务');
            var transaction = db.transaction(storeName, mode);
            _this.transaction = transaction;
            return new Promise(function (resolve, reject) {
                transaction.oncomplete = function () {
                    isDev && log("[" + _this.storeName + "]\u6267\u884C\u6210\u529F,\u5B8C\u6210\u4E8B\u52A1, \u7528\u65F6:" + finishTiming() + "ms");
                };
                transaction.onerror = function (err) {
                    isDev && error(err);
                    reject && reject(err);
                };
                resolve(_this);
            });
        };
        this.add = function (data) {
            var transaction = _this.checkTransaction();
            var objectStore = transaction.objectStore(_this.storeName);
            var keyPath = objectStore.keyPath;
            if (!keyPath) {
                return Promise.resolve(_this);
            }
            if (typeof keyPath === 'object') {
                keyPath = keyPath[0];
            }
            var key = keyPath;
            return Promise.all(data.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                var alreadyItem, request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.get(item[key])];
                        case 1:
                            alreadyItem = _a.sent();
                            if (alreadyItem) {
                                isDev && warn('已存在该数据', item);
                            }
                            else {
                                request = objectStore.add(item);
                                request.onsuccess = function () {
                                    isDev && log('添加一条成功:', item);
                                };
                                request.onerror = function (err) {
                                    isDev && error(err);
                                    throw new Error('添加失败');
                                };
                            }
                            return [2 /*return*/];
                    }
                });
            }); }))
                .then(function () {
                isDev && log('全部添加成功');
                return _this;
            })
                .catch(function (err) {
                isDev && log('添加失败');
                throw new Error(err);
            });
        };
        this.get = function (key) {
            return new Promise(function (reslove, reject) {
                var transaction = _this.checkTransaction();
                var objectStore = transaction.objectStore(_this.storeName);
                var getRequest = objectStore.get(key);
                getRequest.onsuccess = function (e) {
                    isDev && log('获取成功:', getRequest.result);
                    reslove(getRequest.result);
                };
                getRequest.onerror = function (err) {
                    isDev && error('获取失败', err);
                    reject(err);
                };
            });
        };
        this.getAll = function (query) {
            var cursorRequest = _this.openCursor(query);
            var data = [];
            return new Promise(function (resolve, reject) {
                cursorRequest.onsuccess = function (e) {
                    var cursor = cursorRequest.result;
                    if (cursor) {
                        data.push(cursor.value);
                        cursor.continue();
                    }
                    else {
                        isDev && log('获取全部数据成功');
                        resolve(data);
                    }
                };
                cursorRequest.onerror = function (e) {
                    isDev && error('获取全部数据失败', e);
                    reject(e);
                };
            });
        };
        this.delete = function (key) {
            var transaction = _this.checkTransaction();
            var objectStore = transaction.objectStore(_this.storeName);
            var deleteRequest = objectStore.delete(key);
            return new Promise(function (resolve, reject) {
                deleteRequest.onsuccess = function () {
                    isDev && log(key.toString() + "\u5220\u9664\u6210\u529F");
                    resolve(_this);
                };
                deleteRequest.onerror = function (err) {
                    isDev && log(key.toString() + "\u5220\u9664\u5931\u8D25");
                    reject(err);
                };
            });
        };
        this.clear = function (query) {
            var transaction = _this.checkTransaction();
            var objectStore = transaction.objectStore(_this.storeName);
            var cursorRequest = objectStore.openCursor(query);
            return new Promise(function (resolve, reject) {
                cursorRequest.onsuccess = function (e) {
                    var cursor = cursorRequest.result;
                    if (cursor) {
                        cursor.delete();
                        cursor.continue();
                    }
                    else {
                        isDev && warn("\u6E05\u7A7A[" + _this.storeName + "]\u6570\u636E\u6210\u529F");
                        resolve(_this);
                    }
                };
                cursorRequest.onerror = function (err) {
                    isDev && error("\u6E05\u7A7A[" + _this.storeName + "]\u6570\u636E\u5931\u8D25");
                    reject(err);
                };
            });
        };
        this.put = function (item, key) {
            var transaction = _this.checkTransaction();
            var objectStore = transaction.objectStore(_this.storeName);
            var putRequest = objectStore.put(item, key);
            return new Promise(function (resolve, reject) {
                putRequest.onsuccess = function () {
                    isDev && log('更新成功');
                    resolve(_this);
                };
                putRequest.onerror = function (err) {
                    isDev && error('更新失败');
                    reject(err);
                };
            });
        };
        this.openCursor = function (query, direction) {
            if (direction === void 0) { direction = 'next'; }
            var transaction = _this.checkTransaction();
            var objectStore = transaction.objectStore(_this.storeName);
            var cursorRequest = objectStore.openCursor(query, direction);
            return cursorRequest;
        };
        /**
         * 关闭数据库
         */
        this.close = function () {
            var db = _this.checkDb();
            return new Promise(function (resolve, reject) {
                db.onerror = function (err) {
                    isDev && error('关闭数据库错误');
                    reject(err);
                };
                db.close();
                resolve(_this);
            });
        };
        this.dbname = option.dbname;
        this.version = option.version;
        this.stores = option.stores;
        this.IndexedDBInstance = null;
        this.db = null;
        this.storeName = '';
        this.transaction = null;
        if (!this.compatibilityCheck) {
            throw new Error('当前浏览器不支持indexedDB');
        }
    }
    return PromisifyIndexedDB;
}());

module.exports = PromisifyIndexedDB;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY29tbW9uLmpzIiwic291cmNlcyI6W10sInNvdXJjZXNDb250ZW50IjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
