String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

String.prototype.regexLastIndexOf = function(regex, startpos) {
    regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiLine ? "m" : ""));
    if(typeof (startpos) == "undefined") {
        startpos = this.length;
    } else if(startpos < 0) {
        startpos = 0;
    }
    var stringToWorkWith = this.substring(0, startpos + 1);
    var lastIndexOf = -1;
    var nextStop = 0;
    while((result = regex.exec(stringToWorkWith)) != null) {
        lastIndexOf = result.index;
        regex.lastIndex = ++nextStop;
    }
    return lastIndexOf;
}

function copyJson(json) {
    return JSON.parse(JSON.stringify(json));
}

function numToStringSpecLength(num, length) {
    var str = ~~(num) + '';
    var zeroCount = length - str.length;
    if (zeroCount <= 0) {
        return str;
    }
    else {
        for (var i = 0; i < zeroCount; i++) {
            str = '0' + str;
        }
        return str;
    }
}

function modulo(num1, num2) {

    return ((num1 % num2)+num2)%num2;
}

function pythag(a, b) {
    return Math.sqrt(a*a + b*b);
}