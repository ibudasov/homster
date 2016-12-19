let dataSample = {
    "powerUsage": {
        "value": 180,
        "dayCost": 0.95,
        "valueSolar": 450,
        "avgValue": 250,
        "avgDayValue": 6000,
        "meterReading": 429000,
        "meterReadingLow": 0,
        "dayUsage": 7150,
        "dayLowUsage": 0,
        "isSmart": 1
    },
    "success": true,
    "thermostatInfo": {
        "currentTemp": 2498,
        "currentSetpoint": 1200,
        "currentDisplayTemp": 2500,
        "programState": 0,
        "activeState": 3,
        "nextProgram": -1,
        "nextState": -1,
        "nextTime": 0,
        "nextSetpoint": 0,
        "randomConfigId": 1804289383,
        "errorFound": 255,
        "boilerModuleConnected": 1,
        "realSetpoint": 1200,
        "burnerInfo": "0",
        "otCommError": "0",
        "currentModulationLevel": 0,
        "haveOTBoiler": 0
    }
};

let numberOfDaysInMonth = 30;
let numberOfHours = 24;
let programState = [
    {
        'name': 'away',
        'temperature': 12
    },
    {
        'name': 'sleep',
        'temperature': 18
    },
    {
        'name': 'home',
        'temperature': 20
    },
    {
        'name': 'comfort',
        'temperature': 22
    }
];
let hoursMapping = [
    {
        'startHour': 0,
        'endHour': 8,
        'preferrableTemprature': programState[1].temperature // sleep
    },
    {
        'startHour': 8,
        'endHour': 9,
        'preferrableTemprature': programState[1].temperature // home
    },
    {
        'startHour': 9,
        'endHour': 18,
        'preferrableTemprature': programState[0].temperature //away
    },
    {
        'startHour': 18,
        'endHour': 22,
        'preferrableTemprature': programState[3].temperature //comfort
    },
    {
        'startHour': 22,
        'endHour': 24,
        'preferrableTemprature': programState[1].temperature //sleep
    },
]

let getRandomTemperature = function (hour) {

    let preferrableTemprature = 0;
    for(timeIntervalKey in hoursMapping) {
        let startHour = hoursMapping[timeIntervalKey].startHour;
        let endHour = hoursMapping[timeIntervalKey].endHour;

        if((hour <= endHour) && (hour >= startHour)) {
            preferrableTemprature = hoursMapping[timeIntervalKey].preferrableTemprature;
            // console.log(preferrableTemprature);
            continue;
        }
    }
    let temtretureIntervalLow = preferrableTemprature - 2;
    let temtretureIntervalHigh = preferrableTemprature + 2;
    let result = Math.floor(((Math.random() * temtretureIntervalHigh) + temtretureIntervalLow) * 100);

    // console.log(result);

    return result;
};

let dataGenerator = function () {
    var generatedData = [];
    for (date = 1; date < numberOfDaysInMonth; date++) {
        for (hour = 0; hour < numberOfHours; hour++) {
            var dataPart = clone(dataSample);
            dataPart.thermostatInfo.currentTemp = getRandomTemperature(hour);
            dataPart.thermostatInfo.currentSetpoint = getRandomTemperature(hour);
            dataPart.thermostatInfo.currentDisplayTemp = getRandomTemperature(hour);
            generatedData.push(dataPart);
        }
    }
    return generatedData;
};
console.log(dataGenerator());

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}