import { isUndefined } from "./func";

export function round (n, k) {
    k = isUndefined(k) ? 1 : k; 
    return Math.round(n * k) / k;
}


export function degreeToRadian (degrees) {
    return degrees * Math.PI / 180;
}

/**
 * 
 * convert radian to degree 
 * 
 * @param {*} radian 
 * @returns {Number} 0..360
 */
export function radianToDegree(radian) {
    var angle =  radian * 180 / Math.PI;


    if (angle < 0) {   // 각도가 0보다 작으면 360 에서 반전시킨다. 
        angle = 360 + angle
    }

    return angle; 
}


export function getXInCircle (angle, radius, centerX = 0) {
    return centerX + radius * Math.cos(degreeToRadian (angle))
}

export function getYInCircle (angle, radius, centerY = 0) {
    return centerY + radius * Math.sin(degreeToRadian(angle))
}    

export function getXYInCircle (angle, radius, centerX = 0, centerY = 0) {
    return {
        x : getXInCircle(angle, radius, centerX),
        y : getYInCircle(angle, radius, centerY)
    }
}

export function getDist (x, y, centerX = 0, centerY = 0) {
    return Math.sqrt( 
        Math.pow(Math.abs(centerX - x), 2) 
        + 
        Math.pow(Math.abs(centerY - y), 2) 
    )
}

export function calculateAngle (rx, ry) {
    return radianToDegree(Math.atan2(ry, rx))
}

const UUID_REG = /[xy]/g

export function uuid(){
    var dt = new Date().getTime();
    var uuid = 'xxx12-xx-34xx'.replace(UUID_REG, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

export function uuidShort(){
    var dt = new Date().getTime();
    var uuid = 'idxxxxxxx'.replace(UUID_REG, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}