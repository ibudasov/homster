'use strict';

let AWS = require('aws-sdk');
let uuid = require('node-uuid');
let documentDB = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});

// @todo: move this to src/config
let tableName = 'homster';
let relationalDB = require('mysql');
var connection = relationalDB.createConnection({
    host: 'homster.cpafon41kldv.eu-west-1.rds.amazonaws.com',
    user: 'homsterUser',
    password: 'homsterPass',
    port: '3306',
    database: 'homster'
});

// @todo: move this to src/router
exports.handle = (request, context, response) => {

    let httpMethod = request.context.httpMethod;

    let done = (err, res) => response(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
        request: httpMethod
    });

    switch (httpMethod) {
        case 'GET':
            changeController.get(request, context, response);
            break;
        case 'POST':
            changeController.post(request, context, response);
            break;
        default:
            console.log('default');
            done(new Error(`Unsupported method "${httpMethod}"`));
    }
};

// @todo: move this to src/controller
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

        if (typeof request.body == 'string') {
            request.body = JSON.parse(request.body);
        }

        // TODO: here suppose to be a factory, in order to support a few input types
        var dataForStatistics = dataMapper(request);

        var responseMessage = {
            "success": "ok"
            , "rawRequestHasBeenSaved": saveRawRequest(request.body, response)
            , "dataForStatisticsHasBeenSaved": saveDataForStatistics(dataForStatistics, response)
            , "dataForStatistics": dataForStatistics
        };
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

// @todo: convert saving temperature to proper format
let saveDataForStatistics = function (whatToSave, response) {
    // INSERT INTO tbl_name (a,b,c) VALUES(1,2,3),(4,5,6),(7,8,9);
    connection.query('INSERT ' +
        ' INTO homster ' +
        ' (timestampReceived, currentTemp, currentSetpoint, currentDisplayTemp) ' +
        ' VALUES (' +
        Math.floor(Date.now() / 1000) + ', ' +
        whatToSave.currentTemp + ', ' +
        whatToSave.currentSetpoint + ', ' +
        whatToSave.currentDisplayTemp + ')'
        , function (error, results, fields) {
            if (error) {
                response(error, null);
            }
        });
    connection.end(function (error) {
        if (error) {
            response(error, null);
        }
    });
    return 'ok';
};

let dataMapper = function (rawRequest) {
    var result = {};

    result.currentTemp = get(rawRequest.body, 'thermostatInfo.currentTemp');
    result.currentSetpoint = get(rawRequest.body, 'thermostatInfo.currentSetpoint');
    result.currentDisplayTemp = get(rawRequest.body, 'thermostatInfo.currentDisplayTemp');

    return result;
};

let get = function (obj, key) {
    return key.split(".").reduce(function (o, x) {
        return (typeof o == "undefined" || o === null) ? o : o[x];
    }, obj);
};

