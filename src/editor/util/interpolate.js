import { createBezierForPattern } from "../../util/functions/bezier";
import { makeInterpolateLength } from "./interpolate-functions/makeInterpolateLength";
import { makeInterpolateBorderRadius } from "./interpolate-functions/makeInterpolateBorderRadius";
import { makeInterpolateBoxShadow } from "./interpolate-functions/makeInterpolateBoxShadow";
import { makeInterpolateColor } from "./interpolate-functions/makeInterpolateColor";
import { makeInterpolateString } from "./interpolate-functions/makeInterpolateString";
import timingFunctions from "./timing-functions";
import { makeInterpolateRotate } from "./interpolate-functions/makeInterpolateRotate";
import { makeInterpolateTextShadow } from "./interpolate-functions/makeInterpolateTextShadow";
import { makeInterpolateBackgroundImage } from "./interpolate-functions/makeInterpolateBackgroundImage";
import { makeInterpolateFilter } from "./interpolate-functions/makeInterpolateFilter";
import { makeInterpolateNumber } from "./interpolate-functions/makeInterpolateNumber";
import { makeInterpolateClipPath } from "./interpolate-functions/makeInterpolateClipPath";
import { makeInterpolateTransform } from "./interpolate-functions/makeInterpolateTransform";
import { makeInterpolateTransformOrigin } from "./interpolate-functions/makeInterpolateTransformOrigin";
import { makeInterpolatePerspectiveOrigin } from "./interpolate-functions/makeInterpolatePerspectiveOrigin";
import { makeInterpolateStrokeDashArrray } from "./interpolate-functions/makeInterpolateStrokeDashArray";
import { makeInterpolatePath } from "./interpolate-functions/svg/makeInterpolatePath";
import { makeInterpolatePolygon } from "./interpolate-functions/svg/makeInterpolatePolygon";
import { makeInterpolateOffsetPath } from "./interpolate-functions/makeInterpolateOffsetPath";
import { makeInterpolateBorder } from "./interpolate-functions/makeInterpolateBorder";
import { makeInterpolateText } from "./interpolate-functions/makeInterpolateText";

const DEFAULT_FUCTION = () => (rate, t) => { } 

function makeInterpolateCustom (property) {

    switch(property) {
    case 'border-radius':
        return makeInterpolateBorderRadius
    case 'border':
        return makeInterpolateBorder
    case 'box-shadow':
        return makeInterpolateBoxShadow        
    case 'text-shadow':
        return makeInterpolateTextShadow
    case 'background-image':
        return makeInterpolateBackgroundImage 
    case 'filter':
    case 'backdrop-filter':
        return makeInterpolateFilter
    case 'clip-path':
        return makeInterpolateClipPath
    case 'transform':
        return makeInterpolateTransform
    case 'transform-origin':
        return makeInterpolateTransformOrigin        
    case 'perspective-origin':
        return makeInterpolatePerspectiveOrigin
    case 'stroke-dasharray':
        return makeInterpolateStrokeDashArrray        
    case 'd':
        return makeInterpolatePath
    case 'points':
        return makeInterpolatePolygon
    case 'offset-path':
        return makeInterpolateOffsetPath
    case 'text': 
        return makeInterpolateText
    }
}


function makeInterpolate (layer, property, startValue, endValue, container) {
    switch(property) {
    case 'width':
    case 'left':
    case 'x':
        return makeInterpolateLength(layer, property, startValue, endValue, 'width', container);
    case 'height':
    case 'top':
    case 'y':        
        return makeInterpolateLength(layer, property, startValue, endValue, 'height', container);
    case 'perspective':
    case 'font-size':
    case 'font-stretch':
    case 'font-weight':
    case 'text-stroke-width':
    case 'border-width':
    case 'border-top-width':
    case 'border-right-width':        
    case 'border-left-width':
    case 'border-bottom-width':        
        return makeInterpolateLength(layer, property, startValue, endValue, property, container);
    case 'fill-opacity':
    case 'opacity':
    case 'stroke-dashoffset':
        return makeInterpolateNumber(layer, property, +startValue, +endValue, container);
    case 'background-color':
    case 'color':
    case 'text-fill-color':
    case 'text-stroke-color':
    case 'fill':
    case 'stroke':
    case 'border-color':
    case 'border-top-color':
    case 'border-right-color':        
    case 'border-left-color':
    case 'border-bottom-color':
        return makeInterpolateColor(layer, property, startValue, endValue, container);
    case 'mix-blend-mode':
    case 'fill-rule':
    case 'stroke-linecap':
    case 'stroke-linejoin':
    case 'border-style':
    case 'border-top-style':
    case 'border-right-style':        
    case 'border-left-style':
    case 'border-bottom-style':        
        return makeInterpolateString(layer, property, startValue, endValue, container); 
    case 'rotate':
        return makeInterpolateRotate(layer, property, startValue, endValue, container);
    }

    
    var func = makeInterpolateCustom(property)

    if (func) {
        return func(layer, property, startValue, endValue, container)
    }

    return DEFAULT_FUCTION
}


export function createInterpolateFunction (layer, property, startValue, endValue, container) {
    return makeInterpolate(layer, property, startValue, endValue, container);
}


export function createTimingFunction(timing = 'linear') {

    var [funcName, params] = timing.split('(').map(it => it.trim())
    params = (params || '').split(')')[0].trim()

    var func = timingFunctions[funcName];

    if (func) {
        
        var args = timing.split('(')[1].split(')')[0].split(',').map(it => it.trim())
        return func(...args);
    } else {
        return createCurveFunction(timing);
    }
}

export function createCurveFunction (timing) {
    var func = createBezierForPattern(timing);
    return (rate) => {
        return func(rate).y;
    }
}


