
/* HTML5 Web Worker function */

const worker_ajax = (url, data, callback, type) => {

    var data_array, data_string, idx, req, value;
    if (data === null || typeof (data) === "undefined") {
        data = {};
    }

    if (callback === null || typeof (callback) === "undefined" ) {
        callback = function () { };
    }
    if (type === null || typeof (type) === "undefined") {
        type = 'GET';
    }
    data_array = [];
    for (idx in data) {
        value = data[idx];
        data_array.push("" + idx + "=" + value);
    }
    data_string = data_array.join("&");
    req = new XMLHttpRequest();
    req.open(type, url, false);
    req.setRequestHeader("Content-type", "application/json");
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            return callback(req.responseText);
        }
    };
    req.send(data_string);
    return req;
};

const GetAllStatusesProcess = () => {

    worker_ajax("/DataQuery/GetAllStatusesProcess", { 'send': true }, function (data) {
        postMessage(data);
    }, 'POST');

    setTimeout("GetAllStatusesProcess()", 2000);
}

GetAllStatusesProcess();