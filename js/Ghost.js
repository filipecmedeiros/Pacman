const Ghost = function (x, y, cor) {
  this.xi = x
  this.yi = y
  this.x = x
  this.y = y

  this.cor = cor
  this.direcaoAtual = direcao.naoDefinida
  this.listaDirecoes = []

  this.desenhar = function(ct) {
    ct.fillStyle = this.cor
    ct.fillRect(this.x * largura, this.y * largura,largura,largura)
  }

  this.checarDirecoes = function() {
    let i = 0
    // Limpar o array de possiveis direções
    this.listaDirecoes.length = 0
    if(this.direcaoAtual != direcao.naoDefinida) {
      this.listaDirecoes.push(this.direcaoAtual)
    }
    if(this.direcaoAtual != direcao.cima && this.direcaoAtual != direcao.baixo) {
      this.listaDirecoes.push(direcao.cima)
      this.listaDirecoes.push(direcao.baixo)
    }
    if(this.direcaoAtual != direcao.esquerda && this.direcaoAtual != direcao.direita) {
      this.listaDirecoes.push(direcao.esquerda)
      this.listaDirecoes.push(direcao.direita)
    }

    while(i < this.listaDirecoes.length) {
      let remover = false
      switch(this.listaDirecoes[i]){
        case direcao.cima:
          if(this.y <= i){
            remover = true;
          }
          else {
            if(cenario.mapa[this.y - 1][this.x] == cenario.parede){
              remover = true;
            }
          }
          break;
        case direcao.baixo:
          if(this.y >= ny - 2){
            remover = true;
          }
          else{
            if(cenario.mapa[this.y + 1][this.x] == cenario.parede){
              remover = true;
            }
          }
          break;
        case direcao.esquerda:
          if(this.x <= 1){
            remover = true;
          }
          else{
            if(cenario.mapa[this.y][this.x - 1] == cenario.parede){
              remover = true;
            }
          }
          break;
        case direcao.direita:
          if(x >= nx - 2){
            remover = true;
          }
          else{
            if(cenario.mapa[this.y][this.x + 1] == cenario.parede){
              remover = true;
            }
          }
          break;
      }
      if(remover) {
        this.listaDirecoes.splice(i, 1)
      }
      else {
        i++
      }
    }
  }

  this.mover = function() {
    this.checarDirecoes()
    let movimento = direcao.naoDefinida
    let aleatorio = Math.random()

    //Se o primeiro for sorteado ou a lista tiver apenas 1 opção
    if(aleatorio < Ghost.chanceMovIgual || this.listaDirecoes.length == 1) {
      movimento = this.listaDirecoes[0]
    }
    else {
      chance = (1 - Ghost.chanceMovIgual) / (this.listaDirecoes.length - 1)

      for(let ca = 1; ca < this.listaDirecoes.length; ca++) {
        if(aleatorio < Ghost.chanceMovIgual + (ca * chance)) {
          movimento = this.listaDirecoes[ca]
          break
        }
      }
    }

    this.direcaoAtual = movimento;
    switch(movimento){
      case direcao.cima:
        this.y--;
        break;
      case direcao.baixo:
        this.y++;
        break;
      case direcao.esquerda:
        this.x--;
        break;
      case direcao.direita:
        this.x++;
        break;
    }    
  }


}

Ghost.cores = []
Ghost.cores.push("rgba(85,238,85,0.85)")
Ghost.cores.push("rgba(85,238,238,0.85)")
Ghost.cores.push("rgba(238,238,85,0.85)")
Ghost.cores.push("rgba(238,85,85,0.85)")
Ghost.cores.push("rgba(238,85,238,0.85)")
Ghost.chanceMovIgual = 0.50