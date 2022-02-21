//Test object (in mainapp)
function TestVectors(ch) {
    this.mousevector = new Vector2d()

    this.update = () => {
        this.mousevector.setXY({x: ch.mousePos.getX() - ch.mousePos.maxWidth/2, y: (ch.mousePos.maxHeight - ch.mousePos.getY()) - ch.mousePos.maxHeight/2})

        ch.ctx.font = "30px Arial"; 
        ch.ctx.fillText("Ang: " + this.mousevector.getAngle() + " rad", 10, 160);
        ch.ctx.fillText("X: " + this.mousevector.getX() + "", 10, 200);
        ch.ctx.fillText("Y: " + this.mousevector.getY() + "", 10, 240);
    }
}
//ch.spriteList.push(new TestVectors(ch))
//Test object

//Debug force (in Ball object)
/*ctx.font = "30px Arial"; 
ctx.fillText("X: " + Math.round(this.physic.resultingForce.getX()) + "N", 10, 80);
ctx.fillText("Y: " + Math.round(this.physic.resultingForce.getY()) + "N", 10, 120); */