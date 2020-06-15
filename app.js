document.addEventListener('DOMContentLoaded', () => {
  //Grid Size
    const GRID_WIDTH = 10
    const GRID = document.querySelector('.grid')
    const SCOREDISPLAY = document.querySelector('#score')
    const STARTBTN = document.querySelector('#start-button')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    let nextRandom = 0
    let timerId
    let score = 0
    
  //The Tetrominoes
    const lTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
    [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2]
    ]
    const ZTETROMINO = [
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1]
    ]
    const TTETROMINO = [
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1]
    ]
    const OTETROMINO = [
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1]
    ]
    const ITETROMINO = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3]
    ]
    const THETETROMINOES = [lTetromino, ZTETROMINO, TTETROMINO, OTETROMINO, ITETROMINO]
    let currentPosition = 4
    let currentRotation = 0

  //Random Select Tetromino
    let random = Math.floor(Math.random()*THETETROMINOES.length)
    let current = THETETROMINOES[random][currentRotation]

  //Draw The Tetromino
function draw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
    })
}
draw()

  //Undraw The Tetromino
  function undraw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
    })
}

  //Move down every second
  //timerId = setInterval(moveDown, 1000)

  //Assign Keys
  function control(e){
      if (e.keyCode === 37){
          moveLeft()
      } else if (e.keyCode === 38){
          rotate()
      } else if (e.keyCode === 39){
          moveRight()
      } else if (e.keyCode === 40){
          moveDown()
      }
  }
  document.addEventListener('keyup', control)

  //Move down Function
  function moveDown(){
      undraw()
      currentPosition += GRID_WIDTH
      draw()
      freeze()
  }

  //Freeze function
  function freeze(){
    if (current.some(index => squares[currentPosition + index + GRID_WIDTH].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        random = nextRandom
        nextRandom = Math.floor(Math.random() * THETETROMINOES.length)
        current = THETETROMINOES[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
    }
  }

  //Move left unless Edge
  function moveLeft(){
      undraw()
      const isAtLeftEdge = current.some(index => (currentPosition + index) % GRID_WIDTH === 0)
      if (!isAtLeftEdge) {
          currentPosition -=1 
      }
      if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition +=1
      }
      draw()
    }

  //Move right unless Edge
  function moveRight(){
      undraw()
      const isAtRightEdge = current.some(index => (currentPosition + index) % GRID_WIDTH === GRID_WIDTH -1)
      if (!isAtRightEdge) {
          currentPosition +=1 
      }
      if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition -=1
      }
      draw()
    }
  
  //Rotate
  function rotate(){
      undraw()
      currentRotation++
      if (currentRotation === current.length){
          currentRotation = 0
      }
      current = THETETROMINOES[random][currentRotation]
      draw()
  }
  
  //Show mini Tetromino
  const DISPLAYSQUARE = document.querySelectorAll('.mini-grid div')
  const DISPLAYWIDTH = 4
  let displayIndex = 0
  

  //Tetromino without rotation
  const UPNEXTTETROMINOES = [
      [1, DISPLAYWIDTH+1, DISPLAYWIDTH*2+1, 2], //L
      [0, DISPLAYWIDTH, DISPLAYWIDTH+1, DISPLAYWIDTH*2+1], //Z
      [1, DISPLAYWIDTH, DISPLAYWIDTH+1, DISPLAYWIDTH+2], //T
      [0, 1, DISPLAYWIDTH, DISPLAYWIDTH+1], //O
      [1, DISPLAYWIDTH+1, DISPLAYWIDTH*2+1, DISPLAYWIDTH*3+1] //I
  ]

  //Display Shape
  function displayShape(){
    DISPLAYSQUARE.forEach(square =>{
        square.classList.remove('tetromino')
    })
    UPNEXTTETROMINOES[nextRandom].forEach( index => {
        DISPLAYSQUARE[displayIndex + index].classList.add('tetromino')
    })
  }

  //Start button
  STARTBTN.addEventListener('click', () => {
      if (timerId) {
          clearInterval(timerId)
          timerId = null
      } else {
          draw()
          timerId = setInterval(moveDown, 1000)
          nextRandom = Math.floor(Math.random()*THETETROMINOES.length)
          displayShape()
      }
  })

  //Add Score     
  function addScore(){
      for (let i=0; i<199; i += GRID_WIDTH){
          const ROW = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

          if (ROW.every(index => squares[index].classList.contains('taken'))) {
              score += 10
              SCOREDISPLAY.innerHTML = score
              ROW.forEach(index => {
                  squares[index].classList.remove('taken')
                  squares[index].classList.remove('tetromino')
              })
            const SQUAREREMOVED = squares.splice(i, GRID_WIDTH)
            squares = SQUAREREMOVED.concat(squares)
            squares.forEach(cell => GRID.appendChild(cell))
          }
      }
  }

  //Gameover
  function gameOver(){
      if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
          SCOREDISPLAY.innerHTML = ' END '
          clearInterval(timerId)
      }
  }
})
