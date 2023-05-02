import * as PIXI from 'pixi.js'

class PixiButton {
  _width: number
  _height: number
  _label: string
  _fontSize: number

  constructor(width: number, height: number, label: string, fontSize: number) {
    this._width = width
    this._height = height
    this._label = label
    this._fontSize = fontSize
  }

  createButton(): any {
    const button1 = new PIXI.Graphics()
    button1.lineStyle(2, 0x000000, 1)
    button1.beginFill(0xffffff, 1)
    button1.drawRoundedRect(0, 0, this._width, this._height, 10)
    button1.endFill()

    const buttonText = new PIXI.Text(this._label, {
      fontFamily: 'Arial',
      fontSize: this._fontSize
    })

    buttonText.anchor.set(0.5)
    buttonText.position.set(button1.width / 2, button1.height / 2)
    button1.addChild(buttonText)

    button1.eventMode = 'static'
    button1.cursor = 'pointer'
    button1.on('mouseover', () => {
      // button1.tint = 0xff0000; // 修改矩形颜色为红色
      buttonText.style.fill = 'skyblue'
    })
    button1.on('mouseout', () => {
      // button1.tint = 0xffffff; // 恢复矩形原来的颜色
      buttonText.style.fill = 'black'
    })
    // 居中
    // button1.position.set(mazeWidth.value / 2, mazeHeight.value / 2)
    button1.pivot.set(button1.width / 2, button1.height / 2)
    return button1
  }
}

export default PixiButton
