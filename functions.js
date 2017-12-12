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
        if (httpRequest.readyState == completed) {
            if (httpRequest.status == successful) {
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