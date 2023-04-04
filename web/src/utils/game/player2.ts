import Maze from './maze'
import Tank from './tank'

class Player2 extends Tank {
  move(keys: { [keyCode: string]: [v: boolean] }, mazeMap: Maze, container: any): void {
    if (keys['ArrowUp']) {
      this.moveForward(mazeMap)
    }
    if (keys['ArrowDown']) {
      this.moveBackward(mazeMap)
    }
    if (keys['ArrowLeft']) {
      this.rotateLeft()
    }
    if (keys['ArrowRight']) {
      this.rotateRight()
    }
    if (keys['KeyM']) {
      this.fire(container)
    }
  }
}

export default Player2
