const mongodb = require('../mongodb')
const conn = mongodb.connection
const ObjectId = mongodb.ObjectId
module.exports = {
    // ...
    // ...
    readAllExt: _readAllExt,
    collectionCount: _collectionCount
}

function _readAllExt(pageSize, objectStart) {

    let pageSizeNumber = Number(pageSize)
    let objectStartNumber = Number(objectStart)
    let query = {}

    return conn.db().collection('exceptions')
        .find(query)
        .sort({_id: -1})
        .skip(objectStartNumber)
        .limit(pageSizeNumber)
        .map(
            (result) => {
                result
                return result
            }).toArray()
}

function _collectionCount() {
    return conn.db().collection('exceptions').count()
        .then(
            (data) => {
                return data
            }
        )
}