let data = require('./dataGenerator');
var request = require('request');


let populateData = function () {
    for (key in data) {
        let dataToBePosted = JSON.stringify(data[key]);
        request.post({
                url: 'https://noc7s649hh.execute-api.eu-west-1.amazonaws.com/prod/change',
                json: dataToBePosted
            },
            function (err, httpResponse, body) {
                // console.log(err);
                // console.log(httpResponse);
                console.log(body);
            }
        );
    }
};
populateData();
