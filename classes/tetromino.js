class Tetromino{

    constructor(x , y , size){

        this.x = x;
        this.y = y;
        this.size = size;
        this.shapes = [

                [
                    [0,1,0],
                    [0,1,0],
                    [1,1,0]
                ],

                [
                    [0,0,1],
                    [1,1,1],
                    [0,0,0]
                ],

                [
                    [0,1,0],
                    [1,1,1],
                    [0,1,0]
                ],

                [
                    [1,0,0],
                    [0,1,0],
                    [0,0,1]
                ],

                [
                    [0,0,0],
                    [0,1,0],
                    [0,0,0]
                ],

                [
                    [1,1,0],
                    [1,1,0],
                    [0,0,0]
                ]
                

        ]

        this.currentshape = Math.floor(Math.random() * this.shapes.length)

        switch(this.currentshape){

            case 0: this.color = "yellow";break;
            case 1: this.color = "dodgerblue";break;
            case 2: this.color = "magenta";break;
            case 3: this.color = "orange";break;
            case 4: this.color = "cyan";break;
            case 5: this.color = "lime";break;
        }

        this.blockpositions = []
        this.oldx = this.x;
        this.oldy = this.y;
        this.dragging = true
        this.opacity = 1
    }

    update(){

        this.blockpositions = []

        for(var i = 0 ; i < this.shapes[this.currentshape].length ; i++){

            for(var j = 0 ; j < this.shapes[this.currentshape][i].length ; j++){

                if(this.shapes[this.currentshape][i][j] === 1){

                    this.blockpositions.push({x:this.x + j * this.size , y: this.y + i * this.size})

                }
            }
        }

    }

    render(){

        for(var i = 0 ; i < this.shapes[this.currentshape].length ; i++){

            for(var j = 0 ; j < this.shapes[this.currentshape][i].length ; j++){

                if(this.shapes[this.currentshape][i][j] === 1){

                    c.save()
                    c.translate(this.x + j * this.size , this.y + i * this.size)
                    c.beginPath()
                    c.fillStyle = this.color
                    c.globalAlpha = this.opacity
                    c.roundRect(-this.size/2 , -this.size/2 , this.size , this.size , this.size/6)
                    c.fill()
                    c.closePath()
                    c.restore()
                }
            }
        }
    }

    isInsideBlock(x,y){

        for(var i = 0 ; i < this.blockpositions.length ; i++){

            if(x > this.blockpositions[i].x - this.size/2 && x < this.blockpositions[i].x + this.size/2 && y > this.blockpositions[i].y - this.size/2 && y < this.blockpositions[i].y + this.size/2){

                return true
            }
        }

        
    }
}