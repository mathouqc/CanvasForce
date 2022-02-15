const ch = new CanvasHandler({divId: "canvas"})

window.onload = () => {
    ch.init()
    
    mainApp()
}

function mainApp() {
    let ball1 = new Ball(ch)
    ch.spriteList.push(ball1)

    ball1.physic.position.setXY({x: (ch.canvasElement.width/2+500), y: (ch.canvasElement.height/2)})
    ball1.physic.setForce("GravitationalForce", new Vector2d({x: 0, y: 200}))

    let ball2 = new Ball(ch)
    ch.spriteList.push(ball2)

    ball2.physic.position.setXY({x: (ch.canvasElement.width/2-500), y: (ch.canvasElement.height/2)})

}

/* function collision() {
    ch.spriteList
} */

function Ball(canvasHandler) {
    let ctx = canvasHandler.ctx
    this.radius = 50 //px
    this.physic = new ForcePhysic()
    
    this.collision = () => {

    }

    this.control = () => {
        if (canvasHandler.mousedown) {
            this.physic.setForce("Mouse force", Vector2d.subVectors([canvasHandler.mousePos, this.physic.position]))
        } else {
            this.physic.removeForce("Mouse force")
        }
    }

    this.draw = () => {
        drawCircleVector({ctx: ctx, pos: this.physic.position, radius: this.radius, color: "#000000"})

        drawLineVector({ctx: ctx, pos1: this.physic.position, pos2: canvasHandler.mousePos, color: "#0FFFFF"})

        //Debug force
        ctx.font = "30px Arial"; 
        ctx.fillText("X: " + Math.round(this.physic.resultingForce.getX()) + "N", 10, 80);
        ctx.fillText("Y: " + Math.round(this.physic.resultingForce.getY()) + "N", 10, 120);
    }

    this.update = () => {
        this.physic.updatePos(canvasHandler.deltaTime)

        this.draw()

        this.control()

        this.collision()
    }
}

/**
 * 
 * @param {Object} params Object of arguments, Optional
 * @param {Context2D} params.ctx 2d context of the canvas to draw on
 * @param {int} params.x1 absciss of the first point
 * @param {int} params.x2 absciss of the second point
 * @param {int} params.y1 ordinate of the first point
 * @param {int} params.y2 ordinate of the second point
 * @param {string} params.color Hex color, Optional
 */
function drawLine(params) {
    let ctx = params.ctx
    let x1 = params.x1
    let x2 = params.x2
    let y1 = params.y1
    let y2 = params.y2
    let color = params.hasOwnProperty("color") ? params.color : "#000000"
    
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
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
 * @param {int} params.x Absciss position of the circle
 * @param {int} params.y Ordinate position of the circle
 * @param {int} params.radius Radius of the circle
 * @param {string} params.color Hex color, Optional
 */
function drawCircle(params) {
    let ctx = params.ctx
    let x = params.x
    let y = params.y
    let radius = params.radius
    let color = params.hasOwnProperty("color") ? params.color : "#000000"
    
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
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