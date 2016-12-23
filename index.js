'use strict';

let AWS = require('aws-sdk');
// ----------
let documentDB = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});
let uuid = require('node-uuid');
var tableName = 'homster';
// ----------
var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://homsterUser:homsterPass@homster.cpafon41kldv.eu-west-1.rds.amazonaws.com:3306/homster');
var ChangeModel = sequelize.define('change', {
    currentTemp: {
        type: Sequelize.INTEGER,
        field: 'currentTemp'
    },
    currentSetpoint: {
        type: Sequelize.INTEGER,
        field: 'currentSetpoint'
    },
    currentDisplayTemp: {
        type: Sequelize.INTEGER,
        field: 'currentDisplayTemp'
    }
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

// @todo: move this to src/router
exports.handle = (request, context, response) => {

    let httpMethod = request.context.httpMethod;

    let done = (err, res) => context.done(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
        request: httpMethod
    });
    try {
        switch (httpMethod) {
            case 'GET':
                changeController.httpGet(request, context, response);
                break;
            case 'POST':
                changeController.httpPost(request, context, response);
                break;
            default:
                done(new Error(`Unsupported method "${httpMethod}"`));
        }
    } catch (error) {
        done(new Error(error));
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
     */
    httpGet: function (request, context) {

        let timestampFrom = guardTimestampFrom(request, context);
        let timestampTo = guardTimestampTo(request, context);

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
                context.fail(err);
            }
            context.succeed(data);
        })
    },

    httpPost: function (request, context) {

        if (typeof request.body == 'string') {
            request.body = JSON.parse(request.body);
        }

        // TODO: here suppose to be a factory, in order to support a few input types
        var dataForStatistics = dataMapper(request);

        Promise.all([
            saveRawRequest(request.body),
            ChangeModel.create(dataForStatistics),
        ]).then((values) => {
            // return response(null, values);
            return context.succeed(values);
        }).catch(error => {
            return context.fail(error);
        });
    }
};

let guardTimestampFrom = function (request, context) {
    if (request.timestampFrom.length !== 0) {
        return request.timestampFrom;
    } else {
        context.fail('timestampFrom is required');
    }
};

let guardTimestampTo = function (request, context) {
    if (request.timestampTo.length !== 0) {
        return request.timestampTo;
    } else {
        context.fail('timestampTo is required');
    }
};

let saveRawRequest = function (whatToSave) {
    whatToSave.id = uuid.v4();
    return new Promise((resolve, reject) => {
        documentDB.put({
            Item: whatToSave,
            TableName: tableName
        }, function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(whatToSave);
        });

    });
};

// @todo: convert saving temperature to proper format

let dataMapper = function (rawRequest) {
    var result = {};

    result.currentTemp = getPropertyOrNull(rawRequest.body, 'thermostatInfo.currentTemp');
    result.currentSetpoint = getPropertyOrNull(rawRequest.body, 'thermostatInfo.currentSetpoint');
    result.currentDisplayTemp = getPropertyOrNull(rawRequest.body, 'thermostatInfo.currentDisplayTemp');

    return result;
};

let getPropertyOrNull = function (obj, key) {
    return key.split(".").reduce(function (o, x) {
        return (typeof o == "undefined" || o === null) ? o : o[x];
    }, obj);
};
