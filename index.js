
//canvas settings
let c = $("canvas")[0].getContext("2d")
let canvas = $("canvas")[0]

let width = innerWidth
let height = innerHeight

$("canvas").css("height" , height)
$("canvas").css("width" , width)

$(canvas).prop("height" , height * devicePixelRatio)
$(canvas).prop("width" , width * devicePixelRatio)

//sounds
let placeTetrominoSnd = new Audio("snd/place_tetromino.mp3")
let gameOverSnd = new Audio("snd/gameOver.mp3")
let errorSnd = new Audio("snd/error.mp3")
let backgroundSnd = new Audio("snd/backgroundmusic.mp3")


backgroundSnd.loop = true

//variables
let offset = 150
let blocksize = offset * .95
let rows = 9
let columns = 9
let blocks = []
let offsetX = (canvas.width - (columns * offset)) / 2
let offsetY = (canvas.height - (rows * offset)) / 2
let tetrominos = []
let numTetrominos = 5
let tetrominoOffset = canvas.height / (numTetrominos + 1)
let mousedown = false
let currentTetromino = undefined
var dx = undefined 
var dy = undefined
let removedblocks = []
let minisize = blocksize/2
var score = 0

createBlocks()
createTetrominos()

function createBlocks(){

    for(var i = 0 ; i < rows ; i++){

        for(var j = 0 ; j < columns ; j++){

            var block = new Block(offsetX + offset/2 + j * offset , offsetY + offset/2 + i * offset , blocksize)
            block.row = i;
            block.column = j 
            blocks.push(block)
        }
    }
}

function createTetrominos(){

    var dist = canvas.width / numTetrominos

    for(var i = 0 ; i < numTetrominos ; i++){

        do{

            var newTetromino = new Tetromino(dist/2 + i * dist , blocksize , minisize)
           

        }while(!isvalid(newTetromino))
       
        newTetromino.update()

        tetrominos.push(newTetromino)
    }
}

function isvalid(tetromino){

    for(var i = 0 ; i < tetrominos.length ; i++){

        if(tetrominos[i].currentshape === tetromino.currentshape){

            return false
        }
    }

    return true
}

function renderCanvas(){

    c.clearRect(0 , 0 , canvas.width , canvas.height)

    //render blocks
    blocks.forEach(block => {block.render()})

    //render display position
    displayCurrentTetrominoPosition(currentTetromino)

    //render tetrominos
    tetrominos.forEach(tetromino => { tetromino.render()})

    requestAnimationFrame(renderCanvas)
}

function canFit(tetromino){

    var count = 0

    for(var i = 0 ; i < tetromino.blockpositions.length ; i++){

        for(var j = 0 ; j < blocks.length ; j++){

            if(blocks[j].isInsideBlock(tetromino.blockpositions[i].x , tetromino.blockpositions[i].y) && blocks[j].color == "rgb(13, 27, 58)"){

               count++
            }
        }
    }


    if(count === tetromino.blockpositions.length ){

        return true

    }else{

        return false
    }

}

function displayCurrentTetrominoPosition(tetromino){

    if(tetromino){

        if(canFit(tetromino)){

            for(var i = 0 ; i < tetromino.blockpositions.length ; i++){

                for(var j = 0 ; j < blocks.length ; j++){
        
                    if(blocks[j].isInsideBlock(tetromino.blockpositions[i].x , tetromino.blockpositions[i].y)){
        
                       c.save()
                       c.beginPath()
                       c.fillStyle = tetromino.color
                       c.globalAlpha = .3
                       c.roundRect(blocks[j].x  - blocksize/2 , blocks[j].y - blocksize/2 , blocksize , blocksize , blocksize/6)
                       c.fill()
                       c.closePath()
                       c.restore()
                    }
                }
            }
        }
    }
 
}

function removeTetromino(){

    for(var i = 0 ; i < tetrominos.length ; i++){

        if(tetrominos[i] === currentTetromino){

            tetrominos.splice(i,1)
        }
    }
}

function createNewTetrominos(){

    if(tetrominos.length === 0){

        createTetrominos()
    }
}

function placeTetromino(tetromino){

    for(var i = 0 ; i < tetromino.blockpositions.length ; i++){

        for(var j = 0 ; j < blocks.length ; j++){

            if(blocks[j].isInsideBlock(tetromino.blockpositions[i].x , tetromino.blockpositions[i].y)){

               blocks[j].color = tetromino.color
            }
        }
    }
}

function checkboard(){

    var count = 0

    for(var i = 0 ; i < tetrominos.length ; i++){

        var current = tetrominos[i]

        for(var j = 0 ; j < blocks.length ; j++){

            current.x = blocks[j].x 
            current.y = blocks[j].y 
            current.size = blocksize
            current.update()

            if(canFit(current)){

                count++

            }else{

                current.x = current.oldx 
                current.y = current.oldy
                current.size = minisize
                current.update()
            }

        }
    }

    if(count === 0){

        console.log("out of moves")
        $("#gameOverUI").css("display" , "block")
        $("#totalpoints").html(score)
        gameOverSnd.play()
        tetrominos.forEach(tetromino => { tetromino.dragging = false ; tetromino.opacity = .3})
    }
}

//events
$("canvas").on("mousedown" , function(event){

    mousedown = true

    //backgroundSnd.play()

    var xcoord = event.clientX * devicePixelRatio
    var ycoord = event.clientY * devicePixelRatio

    for(var i = 0 ; i < tetrominos.length ; i++){

        if(tetrominos[i].isInsideBlock(xcoord , ycoord)){

            currentTetromino = tetrominos[i]
            currentTetromino.size = blocksize

            dx = xcoord - currentTetromino.x 
            dy = ycoord - currentTetromino.y

            return
        }
    }
})

$("canvas").on("mousemove" , function(event){

    if(mousedown){

        var xcoord = event.clientX * devicePixelRatio
        var ycoord = event.clientY * devicePixelRatio

        if(currentTetromino && currentTetromino.dragging){

            currentTetromino.x = xcoord - dx 
            currentTetromino.y = ycoord - dy

            currentTetromino.update()

        }
    }
})

$("canvas").on("mouseup" , function(event){

    mousedown = false

    if(currentTetromino){

        if(canFit(currentTetromino)){

            //console.log("canfit")
            currentTetromino.update()
            placeTetromino(currentTetromino)
            removeTetromino()
            createNewTetrominos()
            score += currentTetromino.blockpositions.length
            currentTetromino = undefined
            placeTetrominoSnd.play()
            $("#score").html("score: " + score)
            
        }else{
    
            currentTetromino.x = currentTetromino.oldx 
            currentTetromino.y = currentTetromino.oldy
            currentTetromino.size = minisize
            currentTetromino.update()
            currentTetromino = undefined
            errorSnd.play()
        }
    }
    
    currentTetromino = undefined 

    checkboard()

    checkrows()

    checkcolumns()

    checksubgrids()

    //update score on full rows , column and subgrids

    if(removedblocks.length > 0){

        score += removedblocks.length * 5
        $("#score").html("score: " + score)
    }

    //remove blocks

    removedblocks.forEach(block => {

        block.color = "rgb(13, 27, 58)"
    })

    removedblocks = []
})


$("#restart").on("click" , function(){

    $("#gameOverUI").css("display" , "none")
    tetrominos = []
    score = 0
    $("#score").html("score: " + score)
    createTetrominos()
    blocks.forEach(block => { block.color = "rgb(13, 27, 58)"})
})

$("#mutesound").on("click" , function(){


    if(backgroundSnd.paused){

        backgroundSnd.play()
        $("#mutesound").html("sound off")
        return

    }else{

        backgroundSnd.pause()
        $("#mutesound").html("sound on")
    }

})

//gameplay full rows , columns and subgrids

function getBlock(row , column){

    for(var i = 0 ; i < blocks.length ; i++){

        if(blocks[i].row === row && blocks[i].column === column){

            return blocks[i]
        }
    }
}

//rows
function isRowComplete(row){

    for(var i = 0 ; i < columns ; i++){

        if(getBlock(row , i).color === "rgb(13, 27, 58)"){

            return false
        }
    }

    return true
}

function checkrows(){

    for(var i = 0 ; i < rows ; i++){

        if(isRowComplete(i)){

            for(var c = 0 ; c < columns ; c++){

                if(removedblocks.indexOf(getBlock(i,c)) === -1){

                    removedblocks.push(getBlock(i,c))
                }
                //getBlock(i,c).color = "rgb(13, 27, 58)"
           }
        }
    }
}

//columns

function isColumnComplete(column){

    for(var i = 0 ; i < rows ; i++){

        if(getBlock(i, column).color === "rgb(13, 27, 58)"){

            return false
        }
    }

    return true
}


function checkcolumns(){

    for(var i = 0 ; i < columns ; i++){

        if(isColumnComplete(i)){

           for(var r = 0 ; r < rows ; r++){

            if(removedblocks.indexOf(getBlock(r,i)) === -1){

                removedblocks.push(getBlock(r,i))
            }
               // getBlock(r,i).color = "rgb(13, 27, 58)"
           }
        }
    }
}


//subgrids

function isSubgridComplete(row , column){

    var startrow = Math.floor(row / 3) * 3
    var startcolumn = Math.floor(column / 3) * 3

    for(var i = startrow ; i < startrow + 3 ; i++){

        for(var j = startcolumn ; j < startcolumn + 3 ; j++){

            if(getBlock(i,j).color === "rgb(13, 27, 58)"){

                return false
            }
        }
    }

    return true
}

function checksubgrids(){

    for(var i = 0 ; i < rows ; i+=3){

        for(var j = 0 ; j < columns ; j+=3){

            if(isSubgridComplete(i,j)){

                for(var a = i ; a < i + 3 ; a++){

                    for(var b = j ; b < j + 3 ; b++){

                        //getBlock(a,b).color = "rgb(13, 27, 58)"
                        if(removedblocks.indexOf(getBlock(a,b)) === -1){

                            removedblocks.push(getBlock(a,b))
                        }
                    }
                }
            }
        }
    }
}

renderCanvas()