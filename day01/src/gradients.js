const Init = (container) => {
    var canvas = createCanvas(container)
    initMovingGradient(canvas)
}

const createCanvas = (container) => {
    var canvas = document.createElement("canvas");
    container.appendChild(canvas)
    canvas.setAttribute('width', container.clientWidth + "");
    canvas.setAttribute('height', container.clientHeight + "");
    return canvas;
}

const paintCanvas = (c, topLeftColor, topRightColor, bottomLeftColor, bottomRightColor) => {
    var ctx = c.getContext("2d");
    
    const width = c.width;
    const height = c.height;

    const BLOCK_SIZE = 10
    for(var x = 0; x < width; x+=BLOCK_SIZE) {
        for(var y = 0; y < height; y+=BLOCK_SIZE) {
            ctx.beginPath();

            const div = Math.max(width, height)

            const p_a = (div - Math.sqrt((x) ** 2 + (y) ** 2)) / div
            const p_b = (div - Math.sqrt((x - width) ** 2 + (y) ** 2)) / div
            const p_c = (div - Math.sqrt((x) ** 2 + (y - height) ** 2 )) / div
            const p_d = (div - Math.sqrt((x - width) ** 2, (y - height) ** 2)) / div

            var r = (p_a * topLeftColor.r + p_b * topRightColor.r + p_c * bottomLeftColor.r + p_d * bottomRightColor.r )
            var g = (p_a * topLeftColor.g + p_b * topRightColor.g + p_c * bottomLeftColor.g + p_d * bottomRightColor.g )
            var b = (p_a * topLeftColor.b + p_b * topRightColor.b + p_c * bottomLeftColor.b + p_d * bottomRightColor.b )

            ctx.strokeStyle = `rgba(${r}, ${g}, ${b})`
            ctx.fillStyle = `rgba(${r}, ${g}, ${b})`
            ctx.rect(x, y, BLOCK_SIZE, BLOCK_SIZE);
            ctx.fill()
            ctx.stroke();
        }
    }
}
const mergeColorBasedOnIters = (iter, maxIter, original, target) => {
    var original_p = (maxIter - iter) / maxIter
    var target_p = (iter) / maxIter

    return {
        r: original.r * original_p + target.r * target_p,
        g: original.g * original_p + target.g * target_p,
        b: original.b * original_p + target.b * target_p
    }
}

const initGradient = (c) => {
    var topLeftColor     = {r: randColorValue(), g: randColorValue(), b: randColorValue()}          
    var topRightColor    = {r: randColorValue(), g: randColorValue(), b: randColorValue()}    
    var bottomLeftColor  = {r: randColorValue(), g: randColorValue(), b: randColorValue()}    
    var bottomRightColor = {r: randColorValue(), g: randColorValue(), b: randColorValue()}  

    paintCanvas(c, topLeftColor, topRightColor, bottomLeftColor, bottomRightColor)
}

const initMovingGradient = (c) => {
    var topLeftColor     = {r: randColorValue(), g: randColorValue(), b: randColorValue()}          
    var topRightColor    = {r: randColorValue(), g: randColorValue(), b: randColorValue()}    
    var bottomLeftColor  = {r: randColorValue(), g: randColorValue(), b: randColorValue()}    
    var bottomRightColor = {r: randColorValue(), g: randColorValue(), b: randColorValue()}   

    var target_topLeftColor     = {r: randColorValue(), g: randColorValue(), b: randColorValue()}          
    var target_topRightColor    = {r: randColorValue(), g: randColorValue(), b: randColorValue()}    
    var target_bottomLeftColor  = {r: randColorValue(), g: randColorValue(), b: randColorValue()}    
    var target_bottomRightColor = {r: randColorValue(), g: randColorValue(), b: randColorValue()}   
    
    // repaint canvas every 100ms
    var iter = 0
    const goalRate = 2000
    const refreshRate = 100
    var maxIters = goalRate / refreshRate

    setInterval(
        () => {
            iter++
            var temp_topLeftColor = mergeColorBasedOnIters(iter, maxIters, topLeftColor, target_topLeftColor)
            var temp_topRightColor = mergeColorBasedOnIters(iter, maxIters, topRightColor, target_topRightColor)
            var temp_bottomLeftColor = mergeColorBasedOnIters(iter, maxIters, bottomLeftColor, target_bottomLeftColor)
            var temp_bottomRightColor = mergeColorBasedOnIters(iter, maxIters, bottomRightColor, target_bottomRightColor)

            paintCanvas(c, temp_topLeftColor, temp_topRightColor, temp_bottomLeftColor, temp_bottomRightColor)
        },
        refreshRate
    )

    // reset colors ever 3000ms
    setInterval(
        () => {
            iter = 0

            topLeftColor = target_topLeftColor
            topRightColor = target_topRightColor
            bottomLeftColor = target_bottomLeftColor
            bottomRightColor = target_bottomRightColor

            target_topLeftColor     = {r: randColorValue(), g: randColorValue(), b: randColorValue()}          
            target_topRightColor    = {r: randColorValue(), g: randColorValue(), b: randColorValue()}    
            target_bottomLeftColor  = {r: randColorValue(), g: randColorValue(), b: randColorValue()}    
            target_bottomRightColor = {r: randColorValue(), g: randColorValue(), b: randColorValue()}  
        },
        goalRate
    )
    
}

const randColorValue = () => {
    return Math.floor(Math.random() * 255)
}

const gradient = {
    init: Init
}

