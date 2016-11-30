'use strict';

console.log('Loading function');

let AWS = require('aws-sdk');
let db = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});
let tableName = 'homster';
let done = (err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? err.message : JSON.stringify(res),
    headers: {
        'Content-Type': 'application/json',
    },
});

exports.handle = (event, context, callback) => {
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

    get: function (event, context, callback) {
        // db.get({

        let dateFrom = 0;
        let dateTo = 0;

        db.scan({
            Limit: 100,
            TableName: tableName
        }, function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        })
    },

    post: function () {

        let changeObject = {
            id: Date.now().toString(),
            deviceType: "undefined",
            userId: "someString",
            timeCreated: Date.now().toString()
        };

        db.put({
            Item: changeObject,
            TableName: tableName
        }, function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        })

    }
};
