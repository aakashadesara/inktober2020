// init
const Init = (container) => {
    var canvas = createCanvas(container)
    initMovingStarryNight(canvas)
}

const starrynight = {
    init: Init
}

const createCanvas = (container) => {
    var canvas = document.createElement("canvas");
    container.appendChild(canvas)
    canvas.setAttribute('width', container.clientWidth + "");
    canvas.setAttribute('height', container.clientHeight + "");
    return canvas;
}

// paint
const generateArcs = (c) => {
    const SATURATION = 50
    const iters = Math.max(c.width, c.height)

    var arcs = []

    for (var i = 0; i < iters; i++) {
        const START = (Math.random() * 2 * Math.PI)
        const END = START + (Math.random() * Math.PI / 2)
        const WIDTH = Math.floor(Math.random() * 3) + 1
        const VELOCITY = (0.00 + Math.random() / 100)/4
        const COLORS = ['#ffefed', '#fad9d4', '#fae1d4', '#fcf2ed', '#fcf8ed', '#fcf2d7', '#fcc7c2']

        if (randomEnabled(SATURATION)) {
            arcs.push(new Arc(
                WIDTH,
                i,
                COLORS[Math.floor(Math.random() * COLORS.length)],
                START,
                END,
                VELOCITY
            ))
        }
    }

    return arcs
}

const paintStars = (c, arcs) => {
    var ctx = c.getContext("2d");

    const width = c.width;
    const height = c.height;

    for (var i = 0; i < arcs.length; i++) {
        var arc = arcs[i]

        ctx.strokeStyle = arc.color
        ctx.lineWidth = arc.width
        ctx.beginPath()
        ctx.arc(width / 2, height, arc.radius, arc.start, arc.end);
        ctx.stroke();
    }
    
}

const initStarryNight = (c) => {
    const arcs = generateArcs(c)
    paintStars(c, arcs)
}

const initMovingStarryNight = (c) => {
    const arcs = generateArcs(c)
    setInterval(
        () => {
            
            for (var i = 0; i < arcs.length; i++) {
                arcs[i].step()
            }

            eraseCanvas(c)
            paintStars(c, arcs)
        },
        20
    )
}

const eraseCanvas = (c) => {
    var ctx = c.getContext("2d");

    const width = c.width;
    const height = c.height;
    ctx.fillStyle = `#0b0929`
    ctx.beginPath();
    
    ctx.fillRect(0, 0, width, height);
    ctx.stroke();
}

// util
const randColorValue = () => {
    return Math.floor(Math.random() * 80)
}

const randomEnabled = (prob) => {
    return Math.floor(Math.random() * 100) < prob
}

// classes
class Arc {
    constructor(width, radius, color, start, end, velocity) {
        this.width      = width
        this.radius     = radius
        this.color      = color
        this.start      = start
        this.end        = end
        this.velocity   = velocity
    }

    step() {
        this.start = this.start + this.velocity
        this.end = this.end + this.velocity
    }
}
