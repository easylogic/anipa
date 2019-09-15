import { Length } from "../../unit/Length";
import { makeInterpolateNumber } from "./makeInterpolateNumber";
import { makeInterpolateIdentity } from "./makeInterpolateIdentity";

function getRealAttributeValue (layer, property, value, refType = 'width', refElement = 'parent') {

    var refObject = null

    if (value.isPx()) {
        return value; 
    } 

    if ( refElement === 'parent') {
        refObject = Length.parse(layer.parent().css(refType));
    } else if (refElement === 'self') {
        refObject = Length.parse(layer.css(refType));
    }    

    if (refObject) {
        return value.toPx(refObject.value)
    }

    return value; 
}


function rollbackRealAttributeValue (layer, property, value, unit, refType = 'width', refElement = 'parent') {


    if (value.isPx() && unit === 'px') {
        return value; 
    } 

    var refValue = null
    if (refElement === 'parent') {
        refValue = Length.parse(layer.parent().css(refType)).value;
    } else if (refElement === 'self') {
        refValue = Length.parse(layer.css(refType)).value;
    }

    if (refValue != null) {        
        return value.to(unit, refValue)
    }

    return value; 
}

export function makeInterpolateLength(layer, property, startNumber, endNumber, refType = 'width', refElement = 'parent') {
    var s = Length.parse(startNumber);
    var e = Length.parse(endNumber);    


    if (s.unit === e.unit) {
        return makeInterpolateNumber(layer, property, s.value, e.value, s.unit);
    } else if (s.equals(e)) {
        return makeInterpolateIdentity(layer, property, s);
    }

    return (rate, t) => {
        
        var realStartValue = getRealAttributeValue(layer, property, s, refType, refElement);
        var realEndValue = getRealAttributeValue(layer, property, e, refType, refElement);

        if (t === 0) {
            return realStartValue;
        } else if (t === 1) {
            return realEndValue;
        }

        return rollbackRealAttributeValue(
            layer, 
            property, 
            Length.px(realStartValue.value + (realEndValue.value - realStartValue.value) * rate), 
            s.unit, 
            refType,
            refElement
        );
    }
}
