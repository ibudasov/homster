/**
 The results you get from this call are not completely predictable. You should get either:

 A timeout error. In this case, it is best to wake up the Toon21 by using an already connected app such as WakeUp.
 A long status object. You get this if you call for the first time
 A short status object. You get this for repeat calls
 No response. You get this if nothing has changed

 * @see: https://www.toonapi.com/documentation/api-walkthrough
 */
let shorterUpdate = {
    "powerUsage": {
        "value": 100,
        "dayCost": 0.53,
        "valueSolar": 100,
        "avgValue": 250,
        "avgDayValue": 6000,
        "meterReading": 429000,
        "meterReadingLow": 0,
        "dayUsage": 7150,
        "dayLowUsage": 0,
        "isSmart": 1
    },
    "success": true
};

/**
 * Example of a longer update
 * This is what I'm going to implement.
 */
let longerUpdate = {
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
}

/**
 * Example of a longer update, including all connected devices.
 */
let longestUpdate = {
    "benchmarkInfo": {
        "permission": 3,
        "wizardDone": 0,
        "disableNotifications": 0,
        "screenName": "Familie de Vries",
        "gotSJV": true,
        "homeType": 3,
        "homeTypeAlt": 0,
        "homeBuildPeriod": 5,
        "homeSize": 125,
        "familyType": 2,
        "setTime": 0
    }
    ,
    "deviceConfigInfo": {
        "device": [
            {
                "devUUID": "o-001-234707:happ_smartplug_616E0DAAAC9",
                "zwUuid": "eneco-001-234707:hdrv_hue_639D7ABAAC4",
                "devType": "hue_light-LCT001",
                "name": "Hue Lamp 1",
                "position": 0,
                "inSwitchAll": 1,
                "inSwitchSchedule": 0
            },
            {
                "devUUID": "o-001-234707:happ_smartplug_6623F98A907",
                "zwUuid": "eneco-001-234707:hdrv_zwave_69423C6A907",
                "devType": "FGWP011",
                "name": "FGWP011-2",
                "flowGraphUuid": "eneco-001-234707:hcb_config_6766A74A907",
                "quantityGraphUuid": "eneco-001-234707:hcb_config_676C55BA907",
                "position": 3,
                "inSwitchAll": 1,
                "inSwitchSchedule": 0,
                "usageCapable": 1
            },
        ]
    }
    ,
    "deviceStatusInfo": {
        "device": [
            {
                "devUUID": "o-001-234707:happ_smartplug_616E0DAAAC9",
                "name": "Hue Lamp 1",
                "currentState": 0,
                "isConnected": 0,
                "rgbColor": "000000"
            },
            {
                "devUUID": "o-001-234707:happ_smartplug_6623F98A907",
                "name": "FGWP011-2",
                "dayUsage": 0.0,
                "avgUsage": 0.0,
                "currentState": 0,
                "isConnected": 0,
                "networkHealthState": 1
            },
        ],
        "inSwitchAllTotal": {
            "currentState": 0,
            "dayUsage": 0.0,
            "avgUsage": 0.0
        }
    }
    ,
    "gasUsage": {
        "value": 0,
        "dayCost": 0.28,
        "meterReading": 1325476,
        "avgDayValue": 1540,
        "dayUsage": 860,
        "isSmart": 1
    }
    ,
    "success": true
}