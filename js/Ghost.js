const Ghost = function (x, y, cor) {
  this.xi = x
  this.yi = y
  this.x = x
  this.y = y
  this.cor = cor
  this.direcaoAtual = direcao.naoDefinida

  this.desenhar = function(ct) {
    ct.fillStyle = this.cor
    ct.fillRect(this.x * largura, this.y * largura,largura,largura)
  }
}

Ghost.cores = new Array()
Ghost.cores.push("rgba(85,238,85,0.85)")
Ghost.cores.push("rgba(85,238,238,0.85)")
Ghost.cores.push("rgba(238,238,85,0.85)")
Ghost.cores.push("rgba(238,85,85,0.85)")
Ghost.cores.push("rgba(238,85,238,0.85)")