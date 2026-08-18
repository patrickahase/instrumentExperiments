const ns = "http://www.w3.org/2000/svg";
const myCanvas = document.getElementById("svgCanvas");
const canvasWidth = myCanvas.getAttribute("width");
const canvasHeight = myCanvas.getAttribute("height");
const centrePoint = [canvasWidth / 2, canvasHeight / 2];

let planets = [
    // template would be
    // {
    //     id: 0, // p + id for planet : r + id for ring
    //     planet: circle,
    //     ring: circle,
    //     planetPos: [x,y]
    // }
];

myCanvas.addEventListener("mousedown", createPlanet);

function createPlanet(e){
    // check for double mousedown
    if(e.detail === 2){
        // create svg shape
        const planet = document.createElementNS(ns, "circle");
        const ring = document.createElementNS(ns, "circle");
        const newId = planets.length;
        planet.id = "p" + newId.toString();
        ring.id = "r" + newId.toString();
        // all four points are at event location
        planet.setAttribute("cx", e.offsetX);
        planet.setAttribute("cy", e.offsetY);
        planet.setAttribute("r", "5");
        planet.setAttribute("stroke", "white");
        ring.setAttribute("cx", centrePoint[0]);
        ring.setAttribute("cy", centrePoint[1]);
        ring.setAttribute("r", distance2dPoints([e.offsetX, e.offsetY], centrePoint));
        ring.setAttribute("stroke", "white");
        ring.setAttribute("fill", "none");
        myCanvas.appendChild(ring);
        myCanvas.appendChild(planet);
        const oscShapeInit = {
            id: newId,
            planet: planet,
            ring: ring,
            planetPos: [e.offsetX, e.offsetY]
        }
        planets.push(oscShapeInit);
        // add the eventListeners
        //shape.addEventListener("mousedown", mouseDownHandler);
        //const initialScale = (e) => {
         //   scaleOscShape(e, oscShapeInit);
        //}
        //myCanvas.addEventListener("mousemove", initialScale);
        //window.addEventListener("mouseup", () => {
         //   myCanvas.removeEventListener("mousemove", initialScale);
        //});
    }
}