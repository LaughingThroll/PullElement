class PullElement {
  /**
   * 
   * @param {HTMLElement} node 
   * only JAVASCRIPT node 
   * @param {string} direction
   * direction where situated element 
   * @example
   * === first ===
   * CSS
   * .btn {
   *  transform: translateX(-80%);
   * } 
   * JS
   * new PullElement(btn, 'left')
   * === second ===
   * .btn {
   *  transform: translateX(80%)
   * }
   * JS 
   * new PullElement(btn, 'right')
   * === third ===
   * .btn {
   *  transform: translateY(-80%);
   * } 
   *  
   * new PullElement(btn, 'right')
   * === fourth === 
   * .btn {
   *  transform: translateY(80%);
   * } 
   * new PullElement(btn, 'bottom')
   * 
   */
  constructor(node, direction = '') {
    this.node = node
    this._direction = direction
    this.startTouchElementXaxix = 0
    this.startTouchElementYaxix = 0
    this.matrix = window.getComputedStyle(node, null).transform
    this.translate = this.#getTranslateWithMatrix(this.matrix)
    this.currentTranslate = Object.assign({}, this.translate)
    this.computedTranslate = Object.assign({}, this.translate)
    this.#main()
  }

  #getTranslateWithMatrix = (matrix) => {
    let pureMatrix
    const translate = {
      x: 0,
      y: 0
    }

    if (matrix === 'none') {
      throw new Error('set transform for element')
    } else {
      // eslint-disable-next-line no-useless-escape 
      pureMatrix = matrix.match(/(\(.*\))/g)[0].match(/[-\d+\.]+/g)
    }

    if (pureMatrix.length === 6) {
      translate.y = +pureMatrix[5]
      translate.x = +pureMatrix[4]
    }
    if (pureMatrix.length === 16) {
      translate.y = +pureMatrix[13]
      translate.x = +pureMatrix[12]
    }

    return translate
  }

  #startTouchOrClick = (e) => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)) {
      this.startTouchElementXaxis = e.changedTouches[0].pageX
      this.startTouchElementYaxis = e.changedTouches[0].pageY
    } else {
      this.startTouchElementXaxis = e.pageX
      this.startTouchElementYaxis = e.pageY
    }
  }

  #moveElement = (e) => {
    let moveX
    let moveY
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)) {
      moveX = e.changedTouches[0].pageX
      moveY = e.changedTouches[0].pageY
    } else {
      moveX = e.pageX
      moveY = e.pageY
    }

    switch (this._direction) {
      case 'left':
        this.currentTranslate.x = this.computedTranslate.x - (this.startTouchElementXaxis - moveX)
        this.node.style.transform = `translate3d(${this.currentTranslate.x >= 0 ? 0 : Math.abs(this.translate.x) <= Math.abs(this.currentTranslate.x) ? this.translate.x : this.currentTranslate.x}px, ${this.translate.y}px, 0)`
        break
      case 'right':
        this.currentTranslate.x = this.computedTranslate.x - (this.startTouchElementXaxis - moveX)
        this.node.style.transform = `translate3d(${this.currentTranslate.x <= 0 ? 0 : this.currentTranslate.x >= this.translate.x ? this.translate.x : this.currentTranslate.x}px, ${this.translate.y}px, 0)`
        break
      case 'top':
        this.currentTranslate.y = this.computedTranslate.y - (this.startTouchElementYaxis - moveY)
        this.node.style.transform = `translate3d(${this.translate.x}px, ${this.currentTranslate.y >= 0 ? 0 : Math.abs(this.translate.y) <= Math.abs(this.currentTranslate.y) ? this.translate.y : this.currentTranslate.y}px, 0)`
        break
      case 'bottom':
        this.currentTranslate.y = this.computedTranslate.y - (this.startTouchElementYaxis - moveY)
        this.node.style.transform = `translate3d(${this.translate.x}px, ${this.currentTranslate.y <= 0 ? 0 : this.currentTranslate.y >= this.translate.y ? this.translate.y : this.currentTranslate.y}px, 0)`
        break
    }
  }

  #saveCurrentPosition = () => {
    switch (this._direction) {
      case 'left':
        this.computedTranslate.x = this.currentTranslate.x >= 0 ? 0 : Math.abs(this.translate.x) <= Math.abs(this.currentTranslate.x) ? this.translate.x : this.currentTranslate.x
        break
      case 'right':
        this.computedTranslate.x = this.currentTranslate.x <= 0 ? 0 : this.currentTranslate.x >= this.translate.x ? this.translate.x : this.currentTranslate.x
        break
      case 'top':
        this.computedTranslate.y = this.currentTranslate.y >= 0 ? 0 : Math.abs(this.translate.y) <= Math.abs(this.currentTranslate.y) ? this.translate.y : this.currentTranslate.y
        break
      case 'bottom':
        this.computedTranslate.y = this.currentTranslate.y <= 0 ? 0 : this.currentTranslate.y >= this.translate.y ? this.translate.y : this.currentTranslate.y
        break
    }
  }

  #mousedownHandler = (e) => {
    this.#startTouchOrClick(e)
    window.addEventListener('mousemove', this.#moveElement)
  }
  #mouseupHandler = (e) => {
    this.#saveCurrentPosition(e)
    window.removeEventListener('mousemove', this.#moveElement)
  }

  #main = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)) {
      this.node.addEventListener('touchstart', this.#startTouchOrClick)
      this.node.addEventListener('touchmove', this.#moveElement)
      this.node.addEventListener('touchend', this.#saveCurrentPosition)
    } else {
      this.node.addEventListener('mousedown', this.#mousedownHandler)
      window.addEventListener('mouseup', this.#mouseupHandler)
    }
    return this 
  }

  destroy = () => {
    this.node.removeEventListener('touchstart', this.#startTouchOrClick)
    this.node.removeEventListener('touchmove', this.#moveElement)
    this.node.removeEventListener('touchend', this.#saveCurrentPosition)

    this.node.removeEventListener('mouseup', this.#mousedownHandler)
    window.removeEventListener('mouseup', this.#mouseupHandler)


    this.node = ''
    this.startTouchElementXaxix = 0
    this.startTouchElementYaxix = 0
    this.matrix = ''
    this.translate = ''
    this.node.style.transform = ''
  }
}





window.addEventListener('DOMContentLoaded', function () {
  let btn = document.querySelector('#btn')
  let pull = new PullElement(btn, 'top')

})






