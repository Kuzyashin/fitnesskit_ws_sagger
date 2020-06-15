var ws;
var logContainer;
var historyContainer;
var messagesHistory = [];
function connectToServer() {
    var icon = document.getElementById("connection_error_icon");

    try {
        ws = new WebSocket(document.getElementById("serverSelected").value);
        document.getElementById("connectionStatus").innerHTML = "Connecting";

        ws.onopen = function () {
            document.getElementById("connectionStatus").innerHTML = "Connected";
        };
        ws.onmessage = function (event) {
            createLogLine(event.data);
        };
        ws.onclose = function () {
            document.getElementById("connectionStatus").innerHTML = "Disconnected";
        };
        icon.style.visibility = "hidden";
        icon.title = '';
    } catch (e) {
        icon.style.visibility = "visible";
        icon.title = e.message;
    }
}


function getHistory() {
    var his = localStorage.getItem("history");
    if (his) {
        try {
            his = JSON.parse(his);
            messagesHistory = his;
        } catch (exc) {
        }
    }
}

function clearLog() {
    if (!logContainer) {
        logContainer = document.getElementById("responseFromServer");
    }
    while (logContainer.firstChild) {
        logContainer.removeChild(logContainer.firstChild);
    }
}

function createLogLine(msg) {
    var date = new Date();
    var logLine = document.createElement("li");
    logLine.innerHTML = date.getHours() + ":" + getInTwoDigits(date.getMinutes()) + ":" + getInTwoDigits(date.getSeconds()) + " : " + formatMessage(msg);
    logLine.className = 'list-group-item';
    appendLogLine(logLine);
}

function appendLogLine(line) {
    if (!logContainer) {
        logContainer = document.getElementById("responseFromServer");
    }
    if (logContainer.hasChildNodes()) {
        logContainer.insertBefore(line, logContainer.firstChild);
    } else {
        logContainer.appendChild(line);
    }
}

function createHistoryLine(msg) {
    if (!msg.date) {
        msg.date = new Date();
    }
    else if (typeof msg.date === "string") {
        msg.date = new Date(msg.date);
    }
    var logLine = document.createElement("li");
    var data = "<div>Time: <span>" + msg.date.toLocaleString() + "</span></div>\
            <div>URL: <span>" + msg.url + "</span></div>\
            <div>message: <span>" + unescape(msg.message) + "</span></div>";
    logLine.innerHTML = data;
    logLine.onclick = function () {
        historySelect(msg);
    };
    logLine.className = 'list-group-item';
    appendHistoryLine(logLine);
}

function appendHistoryLine(line) {
    if (!historyContainer) {
        historyContainer = document.getElementById("historyContainer");
    }
    if (historyContainer.hasChildNodes()) {
        historyContainer.insertBefore(line, historyContainer.firstChild);
    } else {
        historyContainer.appendChild(line);
    }
}

function formatMessage(msg) {
    try {
        msg = JSON.parse(msg)
    }
    catch (e) {
        console.log('lol')
        msg = msg
    }
    if (typeof msg === "object") {
        return JSON.stringify(msg);
    }
    return msg;
}

function getInTwoDigits(num) {
    return num < 10 ? '0' + num : '' + num;
}

function disconnectToServer() {
    ws.close();
}

function historySelect(msg) {
    document.getElementById("serverSelected").value = msg.url;
    document.getElementById("msgToServer").value = msg.message;
}

function loadHistory() {
    getHistory();
    if (messagesHistory && messagesHistory.length) {
        for (var i = messagesHistory.length - 1; i >= 0; i--) {
            createHistoryLine(messagesHistory[i]);
        }
    }
}