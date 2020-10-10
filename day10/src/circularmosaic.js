// consts
const COUNT_CIRCLES = 20
const MAX_RADIUS = 400
const RIPPLE_PROBABILITY = 30
const COUNT_RIPPLES = 7
const GRADIENT_WEIGHT = 0.35
const CIRCLES_WEIGHT = 0.65

const R_BASE = 20;
const R_ENTROPY = 60;
const G_BASE = 140;
const G_ENTROPY = 40;
const B_BASE = 110;
const B_ENTROPY = 50;

// init
const Init = (container) => {
    var canvas = createCanvas(container)
    initCircularMosaic(canvas)
}

const circularMosaic = {
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
const generateCircles = (c) => {
    const width = c.width
    const height = c.height
    var circles = []

    for (var i = 0; i < COUNT_CIRCLES; i++) {
        const x = Math.floor(Math.random() * width)
        const y = Math.floor(Math.random() * height)
        const radius = Math.random() * MAX_RADIUS
        const ripples = randomEnabled(RIPPLE_PROBABILITY) ? COUNT_RIPPLES : 0

        circles.push(new Circle(x, y, radius))
        for (var j = 1; j < ripples + 1; j++) {
            circles.push(new Circle(x, y, radius + (j * 20)))
        }
    }
    return circles
}

const paintCircles = (c, circles) => {
    const width = c.width
    const height = c.height

    // make 2d array of all pixels with a set for each pixel
    var pixelMap = generatePixelMap(width, height)

    // calculate hashes for all pixels and store in the sets
    loop(width, height, (i, j) => {
        for (var ci = 0; ci < circles.length; ci++) {
            const circle = circles[ci]
            if (circle.contains(i, j)) {
                pixelMap[i][j].add(circle.uuid)
            }
        }
    })

    // calculate color mapping
    var colorMap = {}
    loop(width, height, (i, j) => {
        var setStr = setToString(pixelMap[i][j])
        if (!(setStr in colorMap)) {
            colorMap[setStr] = randomColor()
        }
    })

    // paint pixels in circles with gradient merged
    const gradient = getGradient(c)
    loop(width, height, (i, j) => {
        var setStr = setToString(pixelMap[i][j])
        var color = colorMap[setStr].mergeColor(gradient[i][j], GRADIENT_WEIGHT, CIRCLES_WEIGHT)
        paintPixel(c, i, j, color.rgba)
    })
}

const paintPixel = (c, x, y, color) => {
    const ctx = c.getContext("2d");
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.fillRect(x, y, 1, 1)
    ctx.stroke()
}

const initCircularMosaic = (c) => {
    const circles = generateCircles(c)
    paintCircles(c, circles)
}

// util
const getGradient = (c) => {
    const width = c.width;
    const height = c.height;

    const topLeftColor = randomColor()
    const topRightColor = randomColor()
    const bottomLeftColor = randomColor()
    const bottomRightColor = randomColor()

    const pixelMap = generatePixelMap(width, height)

    const BLOCK_SIZE = 1
    for(var x = 0; x < width; x+=BLOCK_SIZE) {
        for(var y = 0; y < height; y+=BLOCK_SIZE) {
            const div = Math.max(width, height)

            const p_a = (div - Math.sqrt((x) ** 2 + (y) ** 2)) / div
            const p_b = (div - Math.sqrt((x - width) ** 2 + (y) ** 2)) / div
            const p_c = (div - Math.sqrt((x) ** 2 + (y - height) ** 2 )) / div
            const p_d = (div - Math.sqrt((x - width) ** 2, (y - height) ** 2)) / div

            var r = (p_a * topLeftColor.r + p_b * topRightColor.r + p_c * bottomLeftColor.r + p_d * bottomRightColor.r )
            var g = (p_a * topLeftColor.g + p_b * topRightColor.g + p_c * bottomLeftColor.g + p_d * bottomRightColor.g )
            var b = (p_a * topLeftColor.b + p_b * topRightColor.b + p_c * bottomLeftColor.b + p_d * bottomRightColor.b )

            pixelMap[x][y] = new Color(r, g, b)
        }
    }

    return pixelMap
}

const randColorValue = (cap) => {
    return Math.floor(Math.random() * cap)
}

const randomColor = () => {
    const r = randColorValue(R_ENTROPY) + R_BASE
    const g = randColorValue(G_ENTROPY) + G_BASE
    const b = randColorValue(B_ENTROPY) + B_BASE
    return new Color(r, g, b)
}

const loop = (width, height, func) => {
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            func(i, j)
        }
    }
}

const randomEnabled = (prob) => {
    return Math.floor(Math.random() * 100) < prob
}

const randomUUID = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const setToString = (s) => {
    const setList = Array.from(s)
    setList.sort()
    return setList.join("")
}

const generatePixelMap = (width, height) => {
    var pixelMap = new Array(width)
    for (var i = 0; i < width; i++) {
        var col = new Array(height)
        for (var j = 0; j < height; j++) {
            col[j] = new Set()
        }
        pixelMap[i] = col
    }
    return pixelMap
}

// classes
class Color {
    constructor(r, g, b, a = 255) {
        this.r = r
        this.g = g
        this.b = b
        this.rgba = `rgba(${r}, ${g}, ${b}, ${a})`
    }

    mergeColor(otherColor, weight, otherWeight) {
        var mergedR = this.r * weight + otherColor.r * otherWeight
        var mergedG = this.g * weight+ otherColor.g * otherWeight
        var mergedB = this.b * weight + otherColor.b * otherWeight

        return new Color(mergedR, mergedG, mergedB)
    } 
}

class Circle {
    constructor(x, y, radius, ripples) {
        this.x      = x
        this.y      = y
        this.radius = radius
        this.uuid = randomUUID()
        this.ripples = ripples
    }

    contains(x, y) {
        var distance = ((this.x - x) ** 2 + (this.y - y) ** 2) ** (1/2)
        return distance <= this.radius
    }
}
