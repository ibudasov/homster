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
var getRandomTemperature = function (hour) {
    var preferrableTemprature = 0;
    for (timeIntervalKey in hoursMapping) {
        var startHour = hoursMapping[timeIntervalKey].startHour;
        var endHour = hoursMapping[timeIntervalKey].endHour;
        if ((hour <= endHour) && (hour >= startHour)) {
            preferrableTemprature = hoursMapping[timeIntervalKey].preferrableTemprature;
        }
    }
    var temtretureIntervalLow = preferrableTemprature - 2;
    var temtretureIntervalHigh = preferrableTemprature + 2;
    return Math.floor(((Math.random() * temtretureIntervalHigh) + temtretureIntervalLow) * 100);
};

    // @todo: generates the same data for every data part. Fix it.
let numberOfDaysInMonth = 2;
let numberOfHours = 2;
let dataGenerator = function () {
    var generatedData = [];
    var i = 0;
    for (date = 0; date < numberOfDaysInMonth; date++) {
        for (hour = 0; hour < numberOfHours; hour++) {
            i++;
            generatedData[i] = clone(dataSample);
            generatedData[i].thermostatInfo.currentTemp = getRandomTemperature(hour);
            generatedData[i].thermostatInfo.currentSetpoint = getRandomTemperature(hour);
            generatedData[i].thermostatInfo.currentDisplayTemp = getRandomTemperature(hour);
        }
    }
    return generatedData;
};

function clone(source) {
    return JSON.parse(JSON.stringify(source));
}

module.exports = dataGenerator();
