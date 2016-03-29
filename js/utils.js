String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

String.prototype.regexLastIndexOf = function(regex, startpos) {
    regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "")
        + (regex.multiLine ? "m" : ""));
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

CanvasRenderingContext2D.prototype.setRotation = function(ang) {
    var angCos = Math.cos(ang);
    var angSin = Math.sin(ang);
    this.setTransform(angCos, angSin, -angSin, angCos, this.canvas.width/2, this.canvas.height/2);
}

CanvasRenderingContext2D.prototype.drawLine = function(x1, y1, x2, y2) {
    this.beginPath();
    this.moveTo(x1,y1);
    this.lineTo(x2, y2);
    this.stroke();
    this.closePath();
}



function copyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
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
function getPointIntersection(a1, a2, b1, b2) {
    return getIntersection(a1.x, a1.y, a2.x, a2.y, b1.x, b1.y, b2.x, b2.y)
}
function getIntersection(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
    var theta_a = Math.atan2(ay2-ay1, ax2-ax1);
    var theta_b = Math.PI - Math.atan2(by2-by1, bx2-bx1);
    var dx = ax2-bx2;
    var dy = ay2-by2;
    var theta_ab = Math.atan2(dy, dx);
    var theta_1 = theta_b + theta_ab;
    var theta_2 = theta_a - theta_ab;
    var l1 = pythag(dx, dy);
    var l2 = l1*(Math.sin(theta_1)/Math.sin(2*Math.PI-(theta_1+theta_2)));
    return {
        x: ax2 + Math.cos(theta_a)*l2,
        y: ay2 + Math.sin(theta_a)*l2
    }
}
function pointOnSegment(a, b, p) { // a and b are ends of line segment. p is point
    var x1, x2, y1, y2;
    x1 = Math.min(a.x,b.x);
    x2 = Math.max(a.x,b.x);
    y1 = Math.min(a.y,b.y);
    y2 = Math.max(a.y,b.y);
    var wobble = 2;
    if (!(p.x >= x1-wobble && p.x <= x2+wobble && p.y >= y1-wobble && p.y <= y2+wobble)) {
        return false;
    }
    else {
        var theta1 = Math.atan2(b.y - p.y, b.x - p.x);
        var theta2 = Math.atan2(b.y - a.y, b.x - a.x);
        return (Math.abs(theta1 - theta2) < 0.1);
    }
}
function intersects(a1, a2, b1, b2) {
    var intersection = getPointIntersection(a1, a2, b1, b2);
    if (pointOnSegment(a1, a2, intersection) && pointOnSegment(b1, b2, intersection)) {
        return intersection;
    }
    else {
        return false;
    }
}
function toCoordinates(array) {
    return array.map(function(obj) {
        return [obj.x, obj.y];
    })
}






