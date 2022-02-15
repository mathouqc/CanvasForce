class Vector2d {
    /**
     * 
     * @param {Object} params Object of arguments, Optional
     * @param {int} params.x Absciss of the vector
     * @param {int} params.y Ordinate of the vector
     * @param {int} params.angle Angle of the vector in rad
     * @param {int} params.mag Magnitude of the vector
     */
    constructor(params) {
        this.x = (params != undefined && params.hasOwnProperty("x")) ? params.x : 0
        this.y = (params != undefined && params.hasOwnProperty("y")) ? params.y : 0
        this.angleRad = (params != undefined && params.hasOwnProperty("angle")) ? params.angle : 0
        this.magnitude = (params != undefined && params.hasOwnProperty("mag")) ? params.mag : 0
    }

    setXY({ x, y }) {
        this.x = x
        this.y = y
    }
    setX(x) {
        this.x = x
    }
    setY(y) {
        this.y = y
    }

    getXY() {
        return { x: this.x, y: this.y }
    }
    getX() {
        return this.x
    }
    getY() {
        return this.y
    }

    //Function to calculate mag and angle
    
    /**
     * @param {array} vectorArray Array of vector to sum
     */
    static sumVectors(vectorArray) {
        let result = new Vector2d()
        result.setXY(
            vectorArray.reduce((resultantXY, currentVector) => {
                return new Vector2d({
                    x: (resultantXY.x + currentVector.getX()),
                    y: (resultantXY.y + currentVector.getY())
                })
            })
        )
        return result
    }

    /**
     * @param {array} vectorArray Array of vector to substract
     */
    static subVectors(vectorArray) {
        let result = new Vector2d()
        result.setXY(
            vectorArray.reduce((resultantXY, currentVector) => {
                return new Vector2d({
                    x: (resultantXY.x - currentVector.getX()),
                    y: (resultantXY.y - currentVector.getY())
                })
            })
        )
        return result
    }

    /**
     * @param {Vector2d} vector Vector2d to multiply
     * @param {int} constant Constant to multiply with the vector
     */
    static productFromConst(vector, constant) {
        let result = new Vector2d()
        result.setXY(
            {
                x: vector.getX() * constant,
                y: vector.getY() * constant
            }
        )
        return result
    }

    /**
     * @param {Vector2d} vector Vector2d to divide
     * @param {int} constant Constant to divide with the vector
     */
    static quotientFromConst(vector, constant) {
        let result = new Vector2d()
        result.setXY(
            {
                x: vector.getX() / constant,
                y: vector.getY() / constant
            }
        )
        return result
    }

    /**
     * @param {Vector2d} vector1 Vector2d to divide
     * @param {Vector2d} vector2 Constant to divide with the vector
     */
    static vectorMultiplication(vector1, vector2) {
        let result = new Vector2d()
        
    }
}

/**
 * 
 * @param {Object} params Object of arguments, Optional 
 * @param {string} params.divId html id of the div to put the canvas in
 */
function CanvasHandler(params) { //To class
    this.divId = (params != undefined && params.hasOwnProperty("divId")) ? params.divId : undefined

    this.tick = 0 //Int that increase each frame
    this.ctx //Canvas 2d context
    this.stopAnimation = false //Bool, set to true to stop animation
    this.deltaTime //Time in ms since last frame (updated each animationFrame)
    let previousTimeStamp = 0 //TimeStamp in ms of the last frame (updated each animationFrame)
    this.spriteList = [] //List of sprites to draw
    this.mousePos = new Vector2d()
    this.mousedown = false //if mouse click is down
    
    
    this.createCanvas = () => {
        this.canvasParentNode = document.getElementById(this.divId)
        if (this.canvasParentNode === null) {throw 'Wrong div id'}
        this.canvasElement = document.createElement("CANVAS")
        this.canvasParentNode.appendChild(this.canvasElement)
        this.canvasElement.width = parseInt(this.canvasParentNode.offsetWidth)
        this.canvasElement.height = parseInt(this.canvasParentNode.offsetHeight)
        this.ctx = this.canvasElement.getContext('2d')
    }
    
    this.setEventListener = () => {
        //Set mousePos
        this.canvasElement.addEventListener('mousemove', (ev) => {
            this.mousePos.setXY({x: ev.pageX, y: ev.pageY})
        })
        this.canvasElement.addEventListener('mousedown', (ev) => {
            this.mousedown = true
        })
        this.canvasElement.addEventListener('mouseup', (ev) => {
            this.mousedown = false
        })
    }
    
    this.init = () => {
        this.createCanvas()
        
        this.setEventListener()
        
        //Start animation
        requestAnimationFrame(this.animationFrame)
    }
    
    this.setCanvasSize = () => {
        if (this.tick % 100 == 0) {
            this.canvasElement.width = parseInt(this.canvasParentNode.offsetWidth)
            this.canvasElement.height = parseInt(this.canvasParentNode.offsetHeight)
        }
    }
    
    this.updateObjects = () => {
        for (let i = 0; i < this.spriteList.length; i++) {
            sprite = this.spriteList[i]
            
            if (sprite.update != undefined) { //If update exists
                sprite.update()
            }
        }
    }

    
    this.animationFrame = timeStamp => {
        this.deltaTime = timeStamp - previousTimeStamp
        previousTimeStamp = timeStamp
        this.fps = 1/this.deltaTime*1000
        this.tick++
        this.setCanvasSize()
        
        this.ctx.clearRect(0,0, this.canvasElement.width, this.canvasElement.height)
        
        this.updateObjects()
        
        if (this.stopAnimation == false) {
            requestAnimationFrame(this.animationFrame)
        }
    }
}

class ForcePhysic {
    /**
     * @param {Object} params Object of arguments, Optional
     * @param {int} params.mass Mass of the body
     */
    constructor(params) {
        this.mass = (params != undefined && params.hasOwnProperty("mass")) ? params.mass : 1

        this.rotation = 0 //rad

        this.position = new Vector2d() //px
        this.velocity = new Vector2d() //px/s
        this.acceleration = new Vector2d() //px/s2
        
        this.Forces = {} //{forceName: vector(N)} in Newton (kg * m/s2)
        this.resultingForce = new Vector2d()
    }
    setForce(forceName, vector) {
        this.Forces[forceName] = vector
    }
    removeForce(forceName) {
        delete this.Forces[forceName]
    }
    /**
     * calculating the resulting vector from all the forces
     */
    calculateResultingForce() {
        this.resultingForce.setXY({x: 0, y: 0})
        for (let force in this.Forces) {
            this.resultingForce.setXY(
                {
                    x: this.resultingForce.getX() + this.Forces[force].getX(),
                    y: this.resultingForce.getY() + this.Forces[force].getY()
                }
            )
        }
    }
    updatePos(deltaTime) {  //canvasHandler.deltaTime
        this.calculateResultingForce()

        let t = deltaTime / 1000
        
        //calculateAcceleration (a = F/m)
        this.acceleration = Vector2d.quotientFromConst(this.resultingForce, this.mass)

        //calculate final vitesse (vf = vi + at)
        this.velocity = Vector2d.sumVectors([this.velocity, Vector2d.productFromConst(this.acceleration, t)])

        //calculate delta position
        this.position = Vector2d.sumVectors([this.position, Vector2d.productFromConst(this.velocity, t)])
    }
}