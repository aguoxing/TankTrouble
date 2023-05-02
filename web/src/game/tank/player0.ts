import Tank from './tank'

class AI extends Tank {
  // private static instance: AI
  // static getInstance(name: string, color: string): AI {
  //   if (!AI.instance) {
  //     AI.instance = new AI(name, color)
  //   }
  //   return AI.instance
  // }
  move(): void {
    this.rotateLeft()
  }
}

export default AI
