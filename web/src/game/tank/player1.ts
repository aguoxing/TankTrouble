import Maze from './maze'
import Tank from './tank'

class Player1 extends Tank {
  // private static instance: Player1
  // static getInstance(name: string, color: string): Player1 {
  //   if (!Player1.instance) {
  //     Player1.instance = new Player1(name, color)
  //   }
  //   return Player1.instance
  // }

  move(keys: { [keyCode: string]: [v: boolean] }, mazeMap: Maze, container: any): void {
    if (keys['KeyW']) {
      this.moveForward(mazeMap)
    }
    if (keys['KeyS']) {
      this.moveBackward(mazeMap)
    }
    if (keys['KeyA']) {
      this.rotateLeft()
    }
    if (keys['KeyD']) {
      this.rotateRight()
    }
    if (keys['KeyQ']) {
      this.fire(container)
    }
  }
}

export default Player1
