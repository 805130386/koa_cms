const mongodb = require('mongodb')
const mongodbClient = mongodb.MongoClient
const {
    baseUrl,
    baseName
} = require('./config')
const ObjectId = mongodb.ObjectID
class Db {
    static getInstance() {
        if (!Db.instance) {
            Db.instance = new Db()
        }
        return Db.instance
    }
    static getObjectId(id) {
        return ObjectId(id)
    }
    constructor() {
        this.connect()
    }
    connect() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                resolve(this.db)
            } else {
                mongodbClient.connect(baseUrl, {
                    useNewUrlParser: true
                }, (err, db) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    this.db = db.db(baseName)
                    resolve(this.db)
                    console.log('连接数据库成功');
                })
            }
        })
    }
    find(collectionName, data1, data2) {
        let skip
        let limit = 5
        if (arguments.length === 2) {
            skip = 0
            limit = 0
        } else if (arguments.length === 3) {
            skip = (data2.current - 1) * limit
        }
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).find(data1).skip(skip).limit(limit).toArray((err, res) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(res)
                })
            }).catch((err) => {
                console.log(err);
            })
        })
    }
    insertOne(collectionName, data) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).insertOne(data, (err, res) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(res)
                })
            }).catch((err) => {
                console.log(err);
            })
        })
    }
    insertMany(collectionName, data) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).insertMany(data, (err, res) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(res)
                })
            }).catch((err) => {
                console.log(err);
            })
        })
    }
    updateOne(collectionName, data1, data2) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).updateOne(data1, {
                    $set: data2
                }, (err, res) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(res)
                })

            }).catch((err) => {
                console.log(err);
            })
        })
    }
    deleteOne(collectionName, data) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).deleteOne(data, (err, res) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(res)
                })
            }).catch((err) => {
                console.log(err);
            })
        })
    }
    count(collectionName) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).find().count().then((res) => {
                    resolve(res)
                }).catch((err) => {
                    reject(err)
                })
            })
        })
    }
}

module.exports = Db