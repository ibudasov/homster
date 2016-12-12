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

exports.handle = (event, context, callback) => {

    let done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    switch (event.httpMethod) {
        case 'GET':
            changeController.get(event, context, callback);
            break;
        case 'POST':
            changeController.post(event, context, callback);
            break;
        default:
            console.log('default');
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};

let changeController = {

    /**
     * Returns changes between two dates -- timestampFrom and timestampTo.
     * These timestamps are required, because otherwise response will be too big
     *
     * @param event
     * @param context
     * @param response
     */
    get: function (event, context, response) {

        let timestampFrom = guardTimestampFrom(event, response);
        let timestampTo = guardTimestampTo(event, response);

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

    post: function (event, context, response) {
        let changeObject = {
            id: uuid.v1(),
            timestampReceived: Date.now().toString(),
            deviceType: event.deviceType,
            userId: event.deviceType,
            payload: event.payload
        };
        var responseMessage = {};


        // let sql = 'INSERT INTO change SET timestampReceived = ' + changeObject.timestampReceived;
        // connection.query(sql, function(err, rows) {
        //     if (err) {
        //         response(err, null);
        //     } else {
        //         responseMessage.relationalDB = "Saved";
        //     }
        // });


        documentDB.put({
            Item: changeObject,
            TableName: tableName
        }, function (err, data) {
            if (err) {
                response(err, null);
            } else {
                responseMessage.documentDB = "Saved";
            }
        });

        response(null, responseMessage);
    }
};

let guardTimestampFrom = function (event, callback) {
    if (event.timestampFrom.length !== 0) {
        return event.timestampFrom;
    } else {
        callback('timestampFrom is required', null);
    }
};

let guardTimestampTo = function (event, callback) {
    if (event.timestampTo.length !== 0) {
        return event.timestampTo;
    } else {
        callback('timestampTo is required', null);
    }
};
