const responses = require('../models/responses')
const exceptionsService = require('../services/exceptions.service')

module.exports = {
    // ...
    // ...
    readAllExt: _readAllExt
}

function _readAllExt(req, res) {
    exceptionsService.readAllExt(req.params.pageSize, req.params.objectStart)
        .then(
            (exceptions) => {
                let collectionCount = null
                exceptionsService.collectionCount()
                    .then(
                        (data) => {
                            collectionTotalCount = data
                            const responseModel = new responses.ItemsResponse()
                            responseModel.collectionTotalCount = collectionTotalCount
                            responseModel.items = exceptions
                            res.json(responseModel)
                        })
            })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}
