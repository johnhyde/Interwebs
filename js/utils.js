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


function nud(a,b) { //not undefined
    return (a===undefined || a===null)?b:a;
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

function choose(array) {
    return array[~~(Math.random()*array.length)];
}

function modulo(num1, num2) {
    return ((num1 % num2)+num2)%num2;
}

function pythag(a, b) {
    return Math.sqrt(a*a + b*b);
}
function isPointLeft(a1, a2, b){
     return isLeft(nud(a1.x,a1[0]), nud(a1.y,a1[1]), nud(a2.x,a2[0]), nud(a2.y,a2[1]), nud(b.x,b[0]), nud(b.y,b[1]));
}
function isLeft(a1x, a1y, a2x, a2y, bx, by){
     return ((a2x - a1x)*(by - a1y) - (a2y - a1y)*(bx - a1x)) > 0;
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
        var theta1 = modulo(Math.atan2(b.y - p.y, b.x - p.x), 2*Math.PI);
        var theta2 = modulo(Math.atan2(b.y - a.y, b.x - a.x), 2*Math.PI);
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
function toCoords(array) {
    return array.map(function(obj) {
        return [nud(obj.x,obj[0]), nud(obj.y,obj[1])];
    })
}
function applyCoords(objects, coords) {
    for (var i in objects) {
        objects[i].x = nud(coords[i][0],coords[i].x);
        objects[i].y = nud(coords[i][1],coords[i].y);
    }
}
function insidePolygon(x, y, coordinates) {
    var coords = toCoords(coordinates);
    // Winding Number Inclusion algorithm. Thanks to http://geomalgorithms.com/a03-_inclusion.html
    var wn = 0; // winding number counter
    // loop through all edges of the polygon
    for (var i = 0; i < coords.length; i++) {
        var j = modulo(i+1, coords.length);
        // if (!isPointLeft(coords[i], coords[j], [x,y])) {
        //     continue;
        // }
        if (coords[i][1] > y && coords[j][1] <= y)  {
            if (!isPointLeft(coords[i], coords[j], [x,y]))    // Rule #4
                 --wn;   // a valid up intersect right of P.x
        }
        else
        if (coords[i][1] <= y && coords[j][1] > y) {
            if (isPointLeft(coords[i], coords[j], [x,y]))   // Rule #4
                 ++wn;   // a valid down intersect right of P.x
        }
    }
    return wn !== 0;    // =0 <=> P is outside the polygon
}

function scaleCoords(icoords, scaleFactor, offX, offY) {
    var coords = copyObject(icoords);
    var coords = math.add(coords,
            math.matrix().resize([coords.length],[-offX, -offY]).toArray());
    coords = math.multiply(coords,
        [[1 - scaleFactor,0],[0,1 - scaleFactor]]);
    coords = math.add(coords,
        math.matrix().resize([coords.length],[offX, offY]).toArray());
    return coords;
}






