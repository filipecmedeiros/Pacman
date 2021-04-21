// Variaveis inicialização
let nx = 0, ny = 0
let px = -1, py = -1
const ghosts = []
let relogio = null
let relogioGhosts = null
let paused = false

// Canvas
const canvas = document.getElementById("tela")
const ctx = canvas.getContext('2d')

//Botões
const btnStartStop = document.querySelector('.btnStartStop')
const btnNewGame = document.querySelector('.btnNewGame')

// Imagens para canvas
let ponto = new Image()
let poder = new Image()

ponto.onload = function(){
  desenharTudo
}
poder.onload = function() {
  desenharTudo
}

ponto.src = "../img/ponto.png"
poder.src = "../img/poder.png"

//Só para teste
ctx.fillStyle = "#FF0000"
ctx.fillRect(20,30,50,100)

function newGame() {
  paused = false
  btnStartStop.disabled = false
  startStop()
  cenario.mapa = []
  ghosts.length = 0
  let nGhosts = 0

  for(i = 0; i < cenarioCriado.length; i++){
    cenario.mapa.push(cenarioCriado[i])
  }

  nx = cenario.mapa[0].length
  ny = cenario.mapa.length
  
  canvas.width = nx * largura
  canvas.height = ny * largura  

  for(y = 0;  y < ny; y++){
    for(x = 0; x < nx; x++){
      if(cenario.mapa[y][x] == cenario.pacman) {
        px = x
        py = y
      }
      if(cenario.mapa[y][x] == cenario.ghost) {
        ghosts.push(new Ghost(x, y, Ghost.cores[nGhosts++]))
      }
    }
  }
  desenharTudo()
}

function desenharTudo() {
  // limpar a tela
  console.log(px, py)
  ctx.clearRect(0,0,canvas.width, canvas.height)

  // Cenario
  ctx.fillStyle = "#9999EE"
  for(y = 0; y < ny; y++) {
    for(x = 0; x < nx; x++) {
      if(cenario.mapa[y][x] == cenario.parede) {
        ctx.fillRect(x * largura, y * largura, largura, largura)
      }
      else if(cenario.mapa[y][x] == cenario.ponto) {
        ctx.drawImage(ponto, x * largura, y * largura, largura, largura)
      }
      else if(cenario.mapa[y][x] == cenario.poder) {
        ctx.drawImage(poder, x * largura, y * largura, largura, largura)
      }
    }
  }

  // Pacman
  ctx.fillStyle = "#FFB00F"
  ctx.beginPath()
  ctx.arc(px * largura + (largura / 2), py * largura + (largura / 2), largura / 2, Math.PI * 2, false)
  ctx.closePath()
  ctx.fill()

  // Fantasmas
  for(i = 0; i < ghosts.length; i++) {
    ghosts[i].desenhar(ctx)
  }
}


// evento de tecla para método onKD
document.onkeydown = onKD
let setaCima = false
let setaBaixo = false
let setaEsquerda = false
let setaDireita = false

function onKD(evt) {
  if(evt.keyCode == teclas.direita) {
    setaDireita = true
  }
  if(evt.keyCode == teclas.esquerda) {
    setaEsquerda = true
  }
  if(evt.keyCode == teclas.cima) {
    setaCima = true
  }
  if(evt.keyCode == teclas.baixo) {
    setaBaixo = true
  }  
}

function moverPacman() {
  if(setaDireita) {
    setaDireita = false
    if(px + 1 < nx) {
      if(cenario.mapa[py][px+1] != cenario.parede) {
        px++
      }
      else if(cenario.mapa[py][0] != cenario.parede) {
        px = 0
      }
    }
  }
  if(setaEsquerda) {
    setaEsquerda = false
    if(px - 1 >= 0) {
      if(cenario.mapa[py][px-1] != cenario.parede) {
        px--
      }
      else if(cenario.mapa[py][nx - 1] != cenario.parede) {
        px = nx - 1
      }
    }
  }
  if(setaCima) {
    setaCima = false
    if(py - 1 >= 0) {
      if(cenario.mapa[py-1][px] != cenario.parede) {
        py--
      }
      else if(cenario.mapa[ny - 1][px] != cenario.parede) {
        py = ny - 1
      }
    }
  }
  if(setaBaixo) {
    setaBaixo = false
    if(py + 1 < ny) {
      if(cenario.mapa[py + 1][px] != cenario.parede) {
        py++
      }
      else if(cenario.mapa[0][px] != cenario.parede) {
        py = 0
      }
    }
  }    
}

function moverGhosts() {
  for(let i = 0; i < ghosts.length; i++) {
    ghosts[i].mover()
  }
}

function pausar() {
  clearInterval(relogio)
  clearInterval(relogioGhosts)
  relogio = null
  relogioGhosts = null 
  btnStartStop.textContent = "Start"
  paused = true
}

function play() {
  relogio = setInterval("atualizaPacman()", intervalo)
  relogioGhosts = setInterval("atualizaGhosts()", Math.round(intervalo * 1.2))
  btnStartStop.textContent = "Pause"
  paused = false
}

function startStop() {
  if(paused) {
    play()
  }
  else {
    pausar()
  }
}

function atualizaGhosts() {
  moverGhosts()
  if(verificaColisoes()) {
    gameOver()
  }
  desenharTudo()
}

function atualizaPacman() {
  moverPacman()
  if(verificaColisoes()) {
    gameOver()
  }
  desenharTudo()
}

function verificaColisoes() {
  //Comer ponto
  if(cenario.mapa[py][px] == cenario.ponto) {
    cenario.mapa[py][px] = cenario.vazio
  }
  // Comer do poder
  else if(cenario.mapa[py][px] == cenario.poder) {
    for(let i = 0; i < ghosts.length; i++) {
      ghosts[i].assustar()
      cenario.mapa[py][px] = cenario.vazio
    }
  }

  //Colisao com fantasmas
  for(let i = 0; i < ghosts.length; i++) {
    if(px == ghosts[i].x && py == ghosts[i].y) {
      if(ghosts[i].assustado == 0) {
        return true
      }
      else {
        ghosts[i].devorado()
      }
    }
  }
  return false
}

function gameOver() {
  pausar()
  btnStartStop.disabled = true
  btnStartStop.textContent = "Game Over!"
}

