class Block{

    constructor(x , y , size){

        this.x = x;
        this.y = y;
        this.size = size
        this.color = "rgb(13, 27, 58)"
        this.row = undefined 
        this.column = undefined
    }

    render(){

        c.save()
        c.translate(this.x , this.y)
        c.beginPath()
        c.strokeStyle = "grey"
        c.fillStyle = this.color
        c.roundRect(-this.size/2 , -this.size/2 , this.size , this.size , this.size/6)
        c.stroke()
        c.fill()
        c.closePath()
        c.restore()
    }

    isInsideBlock(x,y){

        if(x > this.x - this.size/2 && x < this.x + this.size/2 && y > this.y - this.size/2 && y < this.y + this.size/2){

            return true
        }
    }
}