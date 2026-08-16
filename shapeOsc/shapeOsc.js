// based on https://codepen.io/tsuhre/details/xgmEPe
const ns = "http://www.w3.org/2000/svg";
const myCanvas = document.getElementById("svgCanvas");
const canvasWidth = myCanvas.getAttribute("width");
const canvasHeight = myCanvas.getAttribute("height");
const canvasArea = canvasWidth * canvasHeight;

// using this for box colour : contains partial opacity
const colour2 = "#ffffff44";

// currently selected box
let selectedBox = null;

let oscShapes = [
    // template would be
    // {
    //     id: 0,
    //     shape: SVGRect,
    //     osc: Oscillator,
    //     channel: Channel
    // }
];

const oscOptions = {
    frequency: 440,
    type: "sawtooth"
};
const channelOptions = {
    volume: -32
};

const detuneMult = 2;

// const synth = new Tone.PolySynth().toDestination();

myCanvas.addEventListener("mousedown", createOscShape);

function createOscShape(e){
    // check for double mousedown
    if(e.detail === 2){
        // create svg shape
        const shape = document.createElementNS(ns, "polygon");
        const newId = oscShapes.length;
        shape.dataset.shapeID = newId.toString();
        // all four points are at event location
        const pointsList = new Array(4).fill([e.offsetX, e.offsetY]);
        shape.setAttribute("points", pointListToPoints(pointsList));
        shape.setAttribute("fill", colour2);
        myCanvas.appendChild(shape);
        // create oscillator
        const newOsc = new Tone.Oscillator(oscOptions);
        const newChannel = new Tone.Channel(channelOptions);
        // save references to object and add to array of all shapes
        const oscShapeInit = {
            id: newId,
            shape: shape,
            osc: newOsc,
            channel: newChannel,
            // measured from top/right
            pos: [e.offsetX, e.offsetY],
            pointsList: pointsList
        }
        oscShapes.push(oscShapeInit);
        // now we can init audio settings and start oscillator
        newOsc.chain(newChannel, Tone.Destination);
        setOscShapeCentre(oscShapeInit);
        newOsc.start();
        // add the eventListeners
        shape.addEventListener("mousedown", mouseDownHandler);
        const initialScale = (e) => {
            scaleOscShape(e, oscShapeInit);
        }
        myCanvas.addEventListener("mousemove", initialScale);
        window.addEventListener("mouseup", () => {
            myCanvas.removeEventListener("mousemove", initialScale);
        });
    }
}

function setOscShapeCentre(oscShape){
    const centreX = midPoint(oscShape.pointsList[0][0], oscShape.pointsList[2][0]);
    const centreY = midPoint(oscShape.pointsList[0][1], oscShape.pointsList[2][1]);
    oscShape.channel.set({
        //distance from centre x normalised to -1 to 1
       pan: -1 + ((centreX / canvasHeight) * 2)
    });
    oscShape.osc.set({
        //distance from the centre y
       detune: (centreY - (canvasHeight / 2)) / detuneMult
    });
    //update pos tba for normal drag
}

function scaleOscShape(e, oscShape){
    const newWidth = e.offsetX - oscShape.pos[0];
    const newHeight = e.offsetY - oscShape.pos[1];
    let newPointsList = [
        [oscShape.pos[0], oscShape.pos[1]],
        [oscShape.pos[0] + newWidth, oscShape.pos[1]],
        [oscShape.pos[0] + newWidth, oscShape.pos[1] + newHeight],
        [oscShape.pos[0], oscShape.pos[1] + newHeight]
    ];
    oscShape.shape.setAttribute("points", pointListToPoints(newPointsList));
    oscShapes[oscShape.id].pointsList = newPointsList;
    oscShape.channel.set({
        volume: -26 + (16 * ((newWidth * newHeight) / canvasArea))
    });
    setOscShapeCentre(oscShapes[oscShape.id]);
}

function mouseDownHandler(e){
    // if not previously selected box
    if(e.target !== selectedBox){
        selectBox(e.target);
    }
    startDrag(e);
}

function selectBox(box){
    Array.from(document.getElementsByClassName("selectedBox")).forEach((elm) => {
        elm.classList.remove("selectedBox");
    })
    selectedBox = box;
    selectedBox.classList.add("selectedBox");
}

function unselectBox(box){
    box.classList.remove("selectedBox");
}

function startDrag(e) {
    const boxID = e.target.dataset.shapeID;
    const startPoints = oscShapes[boxID].pointsList;
    const startPos = [e.clientX, e.clientY];
    const moveBox = (e) => {
        dragBox(e, boxID, startPoints, startPos);
    };
    myCanvas.addEventListener("mousemove", moveBox);
    window.addEventListener("mouseup", () => {
        myCanvas.removeEventListener("mousemove", moveBox);
    });
}

function dragBox(e, boxID, startPoints, startPos){
    const oscShape = oscShapes[boxID];
    const offset = [
        e.clientX - startPos[0],
        e.clientY - startPos[1]
    ]
    let newPointsList = startPoints.map(
        point => [
            point[0] + offset[0],
            point[1] + offset[1]
        ]
    );
    oscShape.shape.setAttribute("points", pointListToPoints(newPointsList));
    oscShapes[oscShape.id].pointsList = newPointsList;
    setOscShapeCentre(oscShapes[oscShape.id]);
}

function pointListToPoints(pointList){
    let pointsString = ``;
    pointList.forEach((point) => {
       pointsString += `${point[0]},${point[1]} `;
    });
    return pointsString;
}
