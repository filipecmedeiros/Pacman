// Variaveis inicialização
let nx = 0, ny = 0
let px = -1, py = -1
let ghosts = []
let relogio = null
let relogioGhosts = null
let paused = false
let score = 0


// Canvas
const canvas = document.getElementById("tela")
const ctx = canvas.getContext('2d')

//Botões
const btnStartStop = document.querySelector('.btnStartStop')
const btnNewGame = document.querySelector('.btnNewGame')

function loadGame(){
  var fileToLoad = document.getElementById("fileToLoad").files[0]
  var fileReader = new FileReader()
  fileReader.onload = function(fileLoadedEvent){ 
      f = fileLoadedEvent.target.result
      console.log(f)
      let data = JSON.parse(f)
      atualizarScore(data["score"])
      px = data["pacman-x"]
      py = data["pacman-y"]
      ghosts = []
      for (i=0; i<data["ghosts"].length; i++){
        ghosts.push(new Ghost(data["ghosts"][i]["x"], data["ghosts"][i]["y"], data["ghosts"][i]["cor"]))
      }
      cenario.mapa = data["cenario"]
      desenharTudo()
      btnStartStop.disabled = false
      document.getElementById("fileToLoad").value = null
  };
  fileReader.readAsText(fileToLoad, "UTF-8")
}

function saveGame(){
    pausar()
    jsonData = {"score": score, "pacman-y":py, "pacman-x": px, "ghosts":ghosts, "cenario": cenario.mapa}
    let dataStr = JSON.stringify(jsonData)
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    let exportFileDefaultName = 'pacman.json'

    let linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
}

function atualizarScore(novoScore){
  score = novoScore
  document.getElementById('score').innerText = 'Score: ' + score
}

function newGame() {
  atualizarScore(0)
  paused = false
  btnStartStop.disabled = false
  startStop()
  cenario.mapa = []
  ghosts.length = 0
  let nGhosts = 0

  for(i = 0; i < cenarioCriado1.length; i++){
    cenario.mapa.push(cenarioCriado1[i].slice(0))
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
  ctx.clearRect(0,0,canvas.width, canvas.height)
  // Cenario
  
  for(y = 0; y < ny; y++) {
    for(x = 0; x < nx; x++) {
      if(cenario.mapa[y][x] == cenario.parede) {
        ctx.fillStyle = "#3430FE"
        ctx.fillRect(x * largura, y * largura, largura, largura)
      }
      else if(cenario.mapa[y][x] == cenario.ponto) {
        ctx.fillStyle = "#FEB630"
        ctx.fillRect((x * largura) + (largura/3), (y * largura) + (largura/3), largura/4, largura/4)
      }
      else if(cenario.mapa[y][x] == cenario.poder) {
        ctx.fillStyle = "#B43A23"
        ctx.beginPath()
        ctx.arc(x * largura + (largura / 2), y * largura + (largura / 2), largura / 4, Math.PI * 2, false)
        ctx.closePath()
        ctx.fill()        
      }
    }
  }

  // Pacman
  ctx.fillStyle = "#FFFF01"
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
  console.log(py, px)
  if(setaDireita) {
    setaDireita = false
    if(px + 1 < nx) {
      if(cenario.mapa[py][px+1] != cenario.parede) {
        px++
      }
    } 
    else if(cenario.mapa[py][0] != cenario.parede) {
      px = 0
    }    
  }
  else if(setaEsquerda) {
    setaEsquerda = false
    if(px - 1 >= 0) {
      if(cenario.mapa[py][px-1] != cenario.parede) {
        px--
      }
    }
    else if(cenario.mapa[py][nx - 1] != cenario.parede) {
      px = nx - 1
    }    
  }
  else if(setaCima) {
    setaCima = false
    if(py - 1 >= 0) {
      if(cenario.mapa[py-1][px] != cenario.parede) {
        py--
      }
    }
    else if(cenario.mapa[ny - 1][px] != cenario.parede) {
      py = ny - 1
    }    
  }
  else if(setaBaixo) {
    setaBaixo = false
    if(py + 1 < ny) {
      if(cenario.mapa[py + 1][px] != cenario.parede) {
        py++
      }
    }
    else if(cenario.mapa[0][px] != cenario.parede) {
      py = 0
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
    atualizarScore(score+10);
    cenario.mapa[py][px] = cenario.vazio;
  }
  // Comer do poder
  else if(cenario.mapa[py][px] == cenario.poder) {
    atualizarScore(score+10)
    for(let i = 0; i < ghosts.length; i++) {
      ghosts[i].assustar();
      cenario.mapa[py][px] = cenario.vazio;
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
        atualizarScore(score+50)
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

newGame()
