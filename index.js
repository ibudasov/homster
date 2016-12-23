'use strict';

let AWS = require('aws-sdk');
let uuid = require('node-uuid');
let documentDB = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});
var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://homsterUser:homsterPass@homster.cpafon41kldv.eu-west-1.rds.amazonaws.com:3306/homster');
var tableName = 'homster';

// @todo: move this to src/config

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
    try {
        switch (httpMethod) {
            case 'GET':
                changeController.get(request, context, response);
                break;
            case 'POST':
                changeController.post(request, context, response);
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

        Promise.all([
            saveRawRequest(request.body),
        ]).then((values) => {
            return response(null, values);
        }).catch(error => {
            return response(error, null);
        });
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
            resolve('ok');
        });

    });
};

// @todo: convert saving temperature to proper format
// let saveDataForStatistics = function (whatToSave) {
//     var User = sequelize.define('user', {
//         firstName: {
//             type: Sequelize.STRING,
//             field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
//         },
//         lastName: {
//             type: Sequelize.STRING
//         }
//     }, {
//         freezeTableName: true // Model tableName will be the same as the model name
//     });
//
//     User.sync({force: true}).then(function () {
//         Table created
// return User.create({
//     firstName: 'John',
//     lastName: 'Hancock'
// });
// });
// };

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

