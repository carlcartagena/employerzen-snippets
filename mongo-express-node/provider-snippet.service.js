const provider = require('../models/provider')
const mongodb = require('../mongodb')
const conn = mongodb.connection
const ObjectId = mongodb.ObjectId

module.exports = {
    // ...
    readAllExt: readAllExt
    // ...
    // ...
    // ...
    // ...
    // ...
}

function readAllExt(count) {
    let query = [{
        $lookup: {
            from: 'providerService',
            localField: '_id',
            foreignField: 'providerId',
            as: 'service'
        }
    }, {
        $project: {
            "_id": 1,
            "providerName": 1,
            "services": 1,
            "numberOfServices": { $size: "$service" },
            "description": 1,
            "type": 1,
            "updateDate": 1,
            "createDate": 1,
            "logo": 1
        }
    }]
    if (count != "undefined" || null) {
        query.unshift( {
                $limit: Number(count)
            })
        }
    return conn.db().collection('provider').aggregate(query)
        .map(provider => {
            provider._id = provider._id.toString()
            return provider
        }).toArray()
}