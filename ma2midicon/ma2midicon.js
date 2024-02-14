//ma2midicon by ArtGateOne v1.2

//Config
var wing = 1;	//select wing 1 or 2
//------

var offset = 0;
var encoder3 = 2;

if (wing == 2) {
    offset = 7;
}

var sessionnr = 0;
var request = 0;
var encodervalue = 2;
var faderValue = 0;
var grandmastervalue = 100;
var blackout = false;
if (wing == 1) {
    var buttonid = [0,    1,   2,   3,   4,   5,   6,   7,   8,   9,  10,  11,  12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0];
    var execIndex = [0, 200, 201, 202, 203, 204, 205, 210, 211, 212, 213, 214, 215,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 100, 101, 102, 103, 104, 105, 106, 107, 115, 116, 117, 118, 119, 120, 121, 122, 130, 131, 132, 133, 134, 135, 136, 137, 145, 146, 147, 148, 149, 150, 151, 152];
} else if (wing == 2) {
    var buttonid = [0,    1,   2,   3,   4,   5,   6,   7,   8,   9,  10,  11,  12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0];
    var execIndex = [0, 204, 205, 206, 207, 208, 209, 214, 215, 216, 217, 218, 219,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 100, 101, 102, 103, 104, 105, 106, 107, 115, 116, 117, 118, 119, 120, 121, 122, 130, 131, 132, 133, 134, 135, 136, 137, 145, 146, 147, 148, 149, 150, 151, 152];
}

function interval() {
    client.send('{"requestType":"getdata","data":"set","session":' + sessionnr + ',"maxRequests":1}');
};

var easymidi = require('easymidi');

console.log('MIDI inputs:');
console.log(easymidi.getInputs());

console.log('MIDI outputs:');
console.log(easymidi.getOutputs());

var input = new easymidi.Input('MIDIcon');


//send fader pos do ma2
input.on('cc', function (msg) {

    if (msg.controller <= 8) {
        if (msg.value <= 2) {
            faderValue = 0;
        } else {
            faderValue = (((msg.value) - 2) * 0.008);
        }
        client.send('{"requestType":"playbacks_userInput","execIndex":' + (msg.controller - 1 + offset) + ',"pageIndex":' + msg.channel + ',"faderValue":' + (faderValue) + ',"type":1,"session":' + sessionnr + ',"maxRequests":0}');

    }

    //BlackOut invert 
    else if (msg.controller === 9) {
        if (msg.value <= 2) {
            faderValue = 0;
        } else {
            faderValue = ((msg.value) - 2);
            faderValue = (faderValue * 0.8);
        }
        grandmastervalue = faderValue;
        if (blackout == false) {
            client.send('{"command":"SpecialMaster 2.1 At ' + (faderValue) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }
});



input.on('noteon', function (msg) {

    //Touch buttons
    if (msg.note >= 1 && msg.note <= 12) {

        if (msg.velocity === 127) {
            client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + execIndex[msg.note] + ',"pageIndex":' + msg.channel + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
        } else {
            client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + execIndex[msg.note] + ',"pageIndex":' + msg.channel + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
        }
    }

    //Encoders
    else if (msg.note == 13) {
        client.send('{"command":LUA "gma.canbus.encoder(0,' + encodervalue + ',pressed)","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }
    else if (msg.note == 14) {

        client.send('{"command":LUA "gma.canbus.encoder(0,-' + encodervalue + ',pressed)","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    else if (msg.note == 15) encodervalue = 2;

    else if (msg.note == 16) {
        client.send('{"command":LUA "gma.canbus.encoder(1,' + encodervalue + ',pressed)","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    else if (msg.note == 17) {
        client.send('{"command":LUA "gma.canbus.encoder(1,-' + encodervalue + ',pressed)","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    else if (msg.note == 18) encodervalue = 1;

    else if (msg.note == 19) {
        client.send('{"command":LUA "gma.canbus.encoder(' + encoder3 + ',' + encodervalue + ',pressed)","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    else if (msg.note == 20) {
        client.send('{"command":LUA "gma.canbus.encoder(' + encoder3 + ',-' + encodervalue + ',pressed)","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }
    else if (msg.note == 21 && msg.velocity === 127) {

        if (encoder3 == 2) {
            encoder3 = 3;
        } else {
            encoder3 = 2;
        }
    }

    //Exec S Buttons
    else if (msg.note >= 22 && msg.note <= 27 && msg.velocity == 127) {

        if (msg.note == 22) {
            client.send('{"command":"PresetType Dimmer","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        } else if (msg.note == 23) {
            client.send('{"command":"PresetType Position","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        } else if (msg.note == 24) {
            client.send('{"command":"PresetType Gobo","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        } else if (msg.note == 25) {
            client.send('{"command":"PresetType Color","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        } else if (msg.note == 26) {
            client.send('{"command":"PresetType Beam","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        } else if (msg.note == 27) {
            client.send('{"command":"PresetType Focus","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }

    //GrandMaster
    else if (msg.note === 28) {
        if (msg.velocity === 127) {
            blackout = true;
            client.send('{"command":"SpecialMaster 2.1 At ' + 0 + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        } else {
            blackout = false;
            client.send('{"command":"SpecialMaster 2.1 At ' + (grandmastervalue) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }

    //Exec Buttons (Fader buttons)
    else if (msg.note >= 29 && msg.note <= 52) {

        if (msg.velocity == 127) {
            client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + (execIndex[msg.note] + offset) + ',"pageIndex":' + msg.channel + ',"buttonId":' + buttonid[msg.note] + ',"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
        } else {
            client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + (execIndex[msg.note] + offset) + ',"pageIndex":' + msg.channel + ',"buttonId":' + buttonid[msg.note] + ',"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
        }
    }

    //Exec Buttons (Action Buttons)
    else if (msg.note >= 53 && msg.note <= 84) {

        if (msg.velocity === 127) {
            client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + (execIndex[msg.note] + offset) + ',"pageIndex":' + msg.channel + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
        } else {
            client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + (execIndex[msg.note] + offset) + ',"pageIndex":' + msg.channel + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
        }
    }
});


//WEBSOCKET-------------------
var W3CWebSocket = require('websocket')
    .w3cwebsocket;

var client = new W3CWebSocket('ws://localhost:80/');

client.onerror = function () {
    console.log('Connection Error');
};

client.onopen = function () {
    console.log('WebSocket Client Connected');

    function sendNumber() {
        if (client.readyState === client.OPEN) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            client.send(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    //sendNumber();
};

client.onclose = function () {
    console.log('echo-protocol Client Closed');
};

client.onmessage = function (e) {

    request = request + 1;
    //console.log ("Request "+ request);
    if (request >= 9) {
        client.send('{"session":' + sessionnr + '}');
        request = 0;
    }


    if (typeof e.data === 'string') {
        obj = JSON.parse(e.data);
        if (obj.status == "server ready") {
            client.send('{"session":0}');
        }

        if (obj.forceLogin === true) {
            sessionnr = (obj.session);
            client.send('{"requestType":"login","username":"midicon","password":"2c18e486683a3db1e645ad8523223b72","session":' + obj.session + ',"maxRequests":10}')
        }

        if (obj.responseType == "login" && obj.result === true) {
            setInterval(interval, 500);
        }
    }
};


