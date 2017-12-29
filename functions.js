//reusable function to process a http request and return the data as html, xml or json
function getRequest(url, callbackFunction, config) {
    'use strict';
    var httpRequest, useJSON, useXML,
        responseType = config && config.responseType;

    useJSON = responseType === 'json'; // true if responseType is 'json'
    useXML = responseType === 'xml'; // true if responseType is 'xml'

    if (window.XMLHttpRequest) { // Mozilla, Safari, Chrome

        httpRequest = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) { // IE
        try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {
            }
        }
    }

    if (!httpRequest) {
        console.log('Failed http request');
        return false;
    }

    httpRequest.open('get', url, true);
    if (useXML && httpRequest.overrideMimeType) {
        httpRequest.overrideMimeType('text/xml');
    }
    else if (useJSON && httpRequest.overrideMimeType) {
        httpRequest.overrideMimeType('application/json');
    }
    httpRequest.onreadystatechange = function () {
        //ready state 4 and status 200 response are successful http requests
        var completed = 4, successful = 200, returnValue;
        if (httpRequest.readyState === completed) {
            if (httpRequest.status === successful) {
                if (useXML) {
                    returnValue = httpRequest.responseXML;
                } else if (useJSON) {
                    returnValue = JSON.parse(httpRequest.responseText);
                } else {
                    returnValue = httpRequest.responseText;
                }
                callbackFunction(returnValue);
            } else {
                console.log('There was a problem with the request.');
            }
        }
    };
    httpRequest.send(null);
}  // end of function getRequest

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var max = arr[0];
    var maxIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}


$(document).ready(function () {
    animateDiv();

});

function makeNewPosition() {

    // Get viewport dimensions (remove the dimension of the div)
    var h = $(window).height() - 50;
    var w = $(window).width() - 50;

    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);

    return [nh, nw];

}

function animateDiv() {
    var newq = makeNewPosition();
    var q = $('.flyingGnomeChild');
    var oldq = q.offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);

    q.animate({top: newq[0], left: newq[1]}, speed, function () {
        animateDiv();
    });
}

function calcSpeed(prev, next) {

    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);

    var greatest = x > y ? x : y;

    var speedModifier = 0.1;

    return Math.ceil(greatest / speedModifier);
}

