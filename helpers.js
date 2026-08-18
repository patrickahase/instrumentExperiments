// clamp number between 0 and 1 with options to override 0 - 1 range and throw log if triggered
function clampFloat(value, min = 0, max = 1, log = false){
    const clamped = Math.min(Math.max(value, min), max);
        if(log && clamped !== value){
            console.log(`clamped ${value} to ${clamped}`);
        }
        return clamped;
}

// solution from here
//https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
function scaleFloat(value, [inMin, inMax], [outMin, outMax]){
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function midPoint(startValue, endValue){
    return startValue + ((endValue - startValue) / 2);
}

function distance2dPoints(p1, p2){
    return Math.sqrt( Math.pow((p2[0] - p1[0]),2) + Math.pow((p2[1] - p1[1]),2) );
}