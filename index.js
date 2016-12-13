'use strict';

console.log('Loading function');

let AWS = require('aws-sdk');
let uuid = require('node-uuid');
let documentDB = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});
let tableName = 'homster';

let relationalDB = require('mysql');
var connection = relationalDB.createConnection({
    host     : 'homster.cpafon41kldv.eu-west-1.rds.amazonaws.com',
    user     : 'homsterUser',
    password : 'homsterPass',
    port     : '3306'
});

exports.handle = (request, context, response) => {

    let done = (err, res) => response(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    switch (request.httpMethod) {
        case 'GET':
            changeController.get(request, context, response);
            break;
        case 'POST':
            changeController.post(request, context, response);
            break;
        default:
            console.log('default');
            done(new Error(`Unsupported method "${request.httpMethod}"`));
    }
};

let changeController = {

    /**
     * Returns changes between two dates -- timestampFrom and timestampTo.
     * These timestamps are required, because otherwise response will be too big
     *
     * @param request
     * @param context
     * @param response
     */
    get: function (request, context, response) {

        let timestampFrom = guardTimestampFrom(request, response);
        let timestampTo = guardTimestampTo(request, response);

        documentDB.scan({
            Limit: 100,
            TableName: tableName,
            ScanFilter: {
                "timestampReceived": {
                    AttributeValueList: [timestampFrom],
                    ComparisonOperator: "GT"
                }
            }
        }, function (err, data) {
            if (err) {
                response(err, null);
            } else {
                response(null, data);
            }
        })
    },

    post: function (request, context, response) {
        var responseMessage = {
            "success": "ok"
            , "rawRequestHasBeenSaved": saveRawRequest(request.body, response)
        };

        // let sql = 'INSERT INTO change SET timestampReceived = ' + changeObject.timestampReceived;
        // connection.query(sql, function(err, rows) {
        //     if (err) {
        //         response(err, null);
        //     } else {
        //         responseMessage.relationalDB = "Saved";
        //     }
        // });

        response(null, responseMessage);
    }
};

let guardTimestampFrom = function (request, response) {
    if (request.timestampFrom.length !== 0) {
        return request.timestampFrom;
    } else {
        response('timestampFrom is required', null);
    }
};

let guardTimestampTo = function (request, response) {
    if (request.timestampTo.length !== 0) {
        return request.timestampTo;
    } else {
        response('timestampTo is required', null);
    }
};

let saveRawRequest = function (whatToSave, response) {
    whatToSave.id = uuid.v4();
    documentDB.put({
        Item: whatToSave,
        TableName: tableName
    }, function (err, data) {
        if (err) {
            response(err, null);
        }
    });
    return 'ok';
};

