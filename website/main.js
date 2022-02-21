const ch = new CanvasHandler({divId: "canvas"})

window.onload = () => {
    ch.init()
    
    mainApp()
}

function mainApp() {
    let ball1 = new Ball({canvasHandler: ch, mousecontrolled: true})
    ch.spriteList.push(ball1)

    ball1.physic.position.setXY({x: (ch.canvasElement.width/2+500), y: (ch.canvasElement.height/2)})
    ball1.physic.setForce("GravitationalForce", new Vector2d({x: 0, y: 200}))

    let ball2 = new Ball({canvasHandler: ch})
    ch.spriteList.push(ball2)

    ball2.physic.position.setXY({x: (ch.canvasElement.width/2-500), y: (ch.canvasElement.height/2)})

    //Test object (in mainapp)
    function Test(ch) {
        this.update = () => {
            ch.ctx.font = "30px Arial"; 
            ch.ctx.fillText("Key: " + ch.keydown, 10, 160);
        }
    }
    ch.spriteList.push(new Test(ch))
    //Test object
}

/**
 * 
 * @param {Object} params Object of arguments, Optional
 * @param {canvasHandler} params.canvasHandler the canvas to draw on
 * @param {boolean} params.mousecontrolled if the ball is mouse controlled
 * @param {boolean} params.showForces debug the forces applied on the ball by showing them
 * @param {string} params.color circle color
 * @param {int} params.radius circle radius
 */
function Ball(params) {
    let canvasHandler = params.canvasHandler
    let mousecontrolled = params.hasOwnProperty("mousecontrolled") ? params.mousecontrolled : false
    let showForces = params.hasOwnProperty("showForces") ? params.showForces : true
    let ctx = canvasHandler.ctx
    this.color = params.hasOwnProperty("color") ? params.color : "#000000"
    this.radius = params.hasOwnProperty("color") ? params.color : 50 //px
    this.physic = new ForcePhysic()

    this.control = () => {
        if (canvasHandler.mousedown && mousecontrolled == true) {
            this.physic.setForce("Mouse force", Vector2d.subVectors([canvasHandler.mousePos, this.physic.position]))
        } else {
            this.physic.removeForce("Mouse force")
        }
    }

    this.draw = () => {
        drawCircleVector({ctx: ctx, pos: this.physic.position, radius: this.radius, color: this.color})

        if (showForces == true) {
            for (let force in this.physic.Forces) {
                drawLineVector({ctx: ctx, pos1: this.physic.position, pos2: Vector2d.sumVectors([this.physic.position, this.physic.Forces[force]]), color: getColor(Math.round(force.length/2))})
            }
        }
    }

    this.update = () => {
        if (canvasHandler.keydown == "s") {
            this.physic.forcesOn = false
        }
        if (canvasHandler.keydown == "p") {
            this.physic.forcesOn = true
        }

        this.physic.updatePos(canvasHandler.deltaTime)

        this.draw()

        this.control()
    }
}

/**
 * 
 * @param {Object} params Object of arguments, Optional
 * @param {Context2D} params.ctx 2d context of the canvas to draw on
 * @param {Vector2d} params.pos1 Position vector of the first point
 * @param {Vector2d} params.pos2 Position vector of the second point
 * @param {string} params.color Hex color, Optional
 */
function drawLineVector(params) {
    let ctx = params.ctx
    let pos1 = params.pos1 //Vector2d
    let pos2 = params.pos2 //Vector2d
    let color = params.hasOwnProperty("color") ? params.color : "#000000"
    
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(pos1.getX(), pos1.getY())
    ctx.lineTo(pos2.getX(), pos2.getY())
    ctx.stroke()
}

/**
 * 
 * @param {Object} params Object of arguments, Optional
 * @param {Context2D} params.ctx 2d context of the canvas to draw on
 * @param {Vector2d} params.pos Position vector of the circle
 * @param {int} params.radius Radius of the circle
 * @param {string} params.color Hex color, Optional
 */
function drawCircleVector(params) {
    let ctx = params.ctx
    let pos = params.pos
    let radius = params.radius
    let color = params.hasOwnProperty("color") ? params.color : "#000000"
    
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.arc(pos.getX(), pos.getY(), radius, 0, 2 * Math.PI)
    ctx.stroke()
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getColor (colorNumber) {
    let colors = ["#003399", "#000099", "#0000CC", "#006666", "#0099CC", "#00CCFF", "#00CC99", "#6600FF", "#6600CC", "#339933", "#9999FF", "#9900FF", "#00FF00", "#CC99FF", "#CC33FF", "#003300", "#66FF66", "#FF99FF", "#FF00FF", "#CC00CC", "#009900", "#FFFF66", "#FF9966", "#FF0066", "#999966", "#FFFF00", "#FF9933", "#FF5050", "#CC0066", "#FF9900", "#FF0000"]
    if (typeof colorNumber == "number" && colorNumber >= 0 && colorNumber <= colors.length) {
        return colors[colorNumber]
    }
    return colors[getRndInteger(0, colors.length)]
}