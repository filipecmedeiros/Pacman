// Variaveis inicialização
let nx = 0, ny = 0
let px = -1, py = -1
let ghosts = []
let relogio = null
let relogioGhosts = null
let paused = false
let score = 0
let level = intervalo

let cabCima, cabBaixo, cabEsquerda, cabDireita

let setaCima = false
let setaBaixo = false
let setaEsquerda = false
let setaDireita = false


// Canvas
const canvas = document.getElementById("tela")
const ctx = canvas.getContext('2d')

//Elementos HTML
const btnStartStop = document.querySelector('.btnStartStop')
const btnNewGame = document.querySelector('.btnNewGame')
const btnSave = document.querySelector('.btnSave')
const imgGameOver = document.querySelector(".gameOver")
const imgYouWIN = document.querySelector(".youWIN")

function loadGame(){
  var fileToLoad = document.getElementById("fileToLoad").files[0]
  var fileReader = new FileReader()
  fileReader.onload = function(fileLoadedEvent){ 
      f = fileLoadedEvent.target.result
      // console.log(f)
      let data = JSON.parse(f)
      atualizarScore(data["score"], data["level"])
      px = data["pacman-x"]
      py = data["pacman-y"]
      ghosts = []
      for (i=0; i<data["ghosts"].length; i++){
        ghosts.push(new Ghost(data["ghosts"][i]["x"], data["ghosts"][i]["y"], data["ghosts"][i]["cor"]))
      }
      cenario.mapa = data["cenario"]
      level = data["level"]
      desenharTudo()
      btnStartStop.disabled = false
      btnSave.disabled = false
      imgGameOver.style.display = "none"
      imgYouWIN.style.display = "none"
      document.getElementById("fileToLoad").value = null
  };
  fileReader.readAsText(fileToLoad, "UTF-8")
  btnNewGame.classList.remove('btnGreen')
}

function saveGame(){
    pausar()
    jsonData = {"score": score, "pacman-y":py, "pacman-x": px, "ghosts":ghosts, "cenario": cenario.mapa, "level":level}
    let dataStr = JSON.stringify(jsonData)
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    let exportFileDefaultName = 'pacman.json'

    let linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
}

function atualizarScore(novoScore, novoLevel){
  score = novoScore
  level = novoLevel
  document.getElementById('score').innerText = 'Score: ' + score
  document.getElementById('level').innerText = 'Level: ' + (intervalo - level)/100
}

function newGame(score) {
  atualizarScore(score, level)
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
  imgGameOver.style.display = "none"
  imgYouWIN.style.display = "none"
  btnStartStop.classList.add('btnGreen')
  btnNewGame.classList.remove('btnGreen')
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
  function pacman() {
    if(cabCima) {
      // Cabeça pra cima
      ctx.beginPath();
      ctx.arc(px * largura + (largura / 2), py * largura + (largura / 2), largura/2, 1.75 * Math.PI, 2.75 * Math.PI, false);
      ctx.fillStyle = "rgb(255, 255, 0)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px * largura + (largura / 2), py * largura + (largura / 2), largura/2, 2.25 * Math.PI, 3.25 * Math.PI, false);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px * largura + (largura / 3.75), py * largura + largura/1.50 , largura/8, 0, 2 * Math.PI, false);
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fill();      
    }
    else if(cabBaixo) {
      // Cabeça para baixo
      ctx.beginPath();
      ctx.arc(px * largura + (largura / 2), py * largura + (largura / 2), largura/2, 0.75 * Math.PI, 1.75 * Math.PI, false);
      ctx.fillStyle = "rgb(255, 255, 0)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px * largura + (largura / 2), py * largura + (largura / 2), largura/2, 1.25 * Math.PI, 2.25 * Math.PI, false);
      ctx.fill();
      ctx.beginPath();
      //olhos
      ctx.arc(px * largura + (largura / 1.25), py * largura + (largura / 3), largura/8, 0, 2 * Math.PI, false);
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fill();      
    }
    else if(cabDireita) {
      // Cabeça para direita
      ctx.beginPath();
      ctx.arc(px * largura + (largura / 2), py * largura + (largura / 2), largura/2, 0.25 * Math.PI, 1.25 * Math.PI, false);
      ctx.fillStyle = "rgb(255, 255, 0)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px * largura + (largura / 2), py * largura + (largura / 2), largura/2, 0.75 * Math.PI, 1.75 * Math.PI, false);
      ctx.fill();
      ctx.beginPath();
      //Olhos
      ctx.arc(px * largura + (largura / 2), py * largura + (largura / 5), largura/8, 0, 2 * Math.PI, false);
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fill();      
    }
    else if(cabEsquerda) {
      // Cabeça para esquerda
      ctx.beginPath();
      ctx.arc(px * largura + (largura / 2), py * largura + (largura / 2), largura/2, -0.25 * Math.PI, -1.25 * Math.PI, false);
      ctx.fillStyle = "rgb(255, 255, 0)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px * largura + (largura / 2), py * largura + (largura / 2), largura/2, -0.75 * Math.PI, -1.75 * Math.PI, false);
      ctx.fill();
      ctx.beginPath();    
      //Olhos
      ctx.arc(px * largura + (largura / 2), py * largura + (largura / 5), largura/8, 0, 2 * Math.PI, false);
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fill();      
    }
    else {
      ctx.beginPath();
      ctx.arc(px * largura + (largura / 2), py * largura + (largura / 2), largura/2, 0.25 * Math.PI, 1.25 * Math.PI, false);
      ctx.fillStyle = "rgb(255, 255, 0)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px * largura + (largura / 2), py * largura + (largura / 2), largura/2, 0.75 * Math.PI, 1.75 * Math.PI, false);
      ctx.fill();
      ctx.beginPath();
      //Olhos
      ctx.arc(px * largura + (largura / 2), py * largura + (largura / 5), largura/8, 0, 2 * Math.PI, false);
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fill();         
    }
  }

  pacman()

  // Fantasmas
  for(i = 0; i < ghosts.length; i++) {
    ghosts[i].desenhar(ctx)
  }
}

// evento de tecla para método onKD
document.onkeydown = onKD

function onKD(evt) {
  if(evt.keyCode == teclas.direita) {
    setaDireita = true
    cabDireita = true
    cabEsquerda = false
    cabCima = false
    cabBaixo = false
  }
  if(evt.keyCode == teclas.esquerda) {
    setaEsquerda = true
    cabDireita = false
    cabEsquerda = true
    cabCima = false
    cabBaixo = false
  }
  if(evt.keyCode == teclas.cima) {
    setaCima = true
    cabDireita = false
    cabEsquerda = false
    cabCima = true
    cabBaixo = false
  }
  if(evt.keyCode == teclas.baixo) {
    setaBaixo = true
    cabDireita = false
    cabEsquerda = false
    cabCima = false
    cabBaixo = true
  }  
}

function moverPacman() {
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
    }    else if(cenario.mapa[py][nx - 1] != cenario.parede) {
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
  btnStartStop.classList.add('btnGreen')
  btnStartStop.classList.remove('btnRed')
  paused = true
}

function play() {
  relogio = setInterval("atualizaPacman()", intervalo)
  relogioGhosts = setInterval("atualizaGhosts()", Math.round(level * 1.2))
  btnStartStop.textContent = "Pause"
  btnStartStop.classList.add('btnRed')
  btnStartStop.classList.remove('btnGreen')
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
  newLevel(score)
  winGame()  
}

function verificaColisoes() {
  //Comer ponto
  if(cenario.mapa[py][px] == cenario.ponto) {
    atualizarScore(score+10, level);
    cenario.mapa[py][px] = cenario.vazio;
  }
  // Comer do poder
  else if(cenario.mapa[py][px] == cenario.poder) {
    atualizarScore(score+10, level)
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
        atualizarScore(score+50, level)
      }
    }
  }
  return false
}

function newLevel(score) {
  let searchPoint = false
  let searchPower = false

  for(let y = 0; y < ny; y++) {
    for(let x = 0; x < nx; x++) {
      if(cenario.mapa[y][x] == cenario.ponto) {
        searchPoint = true
      }
      if(cenario.mapa[y][x] == cenario.poder) {
        searchPower = true
      }
    }
  }

  if(searchPoint || searchPower) {
    return
  }
  else {
    newGame(score)
    level = level - 100
    atualizarScore(score, level)
  }
}

function winGame() {
  if(level < 100) {
    pausar()
    imgYouWIN.style.display = "block"
    btnStartStop.disabled = true
    btnSave.disabled = true    
    btnStartStop.textContent = "You win!"
    btnStartStop.classList.remove('btnGreen')
    btnNewGame.classList.add('btnGreen')
    level = intervalo
  }
}

function gameOver() {
  pausar()
  imgGameOver.style.display = "block"
  btnStartStop.disabled = true
  btnSave.disabled = true
  btnStartStop.textContent = "Game Over!"
  btnStartStop.classList.remove('btnGreen')
  btnNewGame.classList.add('btnGreen')
  level = intervalo
}
 
newGame(0)
