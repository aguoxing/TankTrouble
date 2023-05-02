export interface GameReq {
  roomId?: string
  playerId?: string
  messageType?: string
  messageValue?: string
}

export function encodeGameReq(message: GameReq): Uint8Array {
  let bb = popByteBuffer()
  _encodeGameReq(message, bb)
  return toUint8Array(bb)
}

function _encodeGameReq(message: GameReq, bb: ByteBuffer): void {
  // optional string roomId = 1;
  let $roomId = message.roomId
  if ($roomId !== undefined) {
    writeVarint32(bb, 10)
    writeString(bb, $roomId)
  }

  // optional string playerId = 2;
  let $playerId = message.playerId
  if ($playerId !== undefined) {
    writeVarint32(bb, 18)
    writeString(bb, $playerId)
  }

  // optional string messageType = 3;
  let $messageType = message.messageType
  if ($messageType !== undefined) {
    writeVarint32(bb, 26)
    writeString(bb, $messageType)
  }

  // optional string messageValue = 4;
  let $messageValue = message.messageValue
  if ($messageValue !== undefined) {
    writeVarint32(bb, 34)
    writeString(bb, $messageValue)
  }
}

export function decodeGameReq(binary: Uint8Array): GameReq {
  return _decodeGameReq(wrapByteBuffer(binary))
}

function _decodeGameReq(bb: ByteBuffer): GameReq {
  let message: GameReq = {} as any

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb)

    switch (tag >>> 3) {
      case 0:
        break end_of_message

      // optional string roomId = 1;
      case 1: {
        message.roomId = readString(bb, readVarint32(bb))
        break
      }

      // optional string playerId = 2;
      case 2: {
        message.playerId = readString(bb, readVarint32(bb))
        break
      }

      // optional string messageType = 3;
      case 3: {
        message.messageType = readString(bb, readVarint32(bb))
        break
      }

      // optional string messageValue = 4;
      case 4: {
        message.messageValue = readString(bb, readVarint32(bb))
        break
      }

      default:
        skipUnknownField(bb, tag & 7)
    }
  }

  return message
}

export interface GameResp {
  roomId?: string
  playerId?: string
  messageType?: string
  messageValue?: string
  mazeMap?: MazeMap
  players?: Tank[]
}

export function encodeGameResp(message: GameResp): Uint8Array {
  let bb = popByteBuffer()
  _encodeGameResp(message, bb)
  return toUint8Array(bb)
}

function _encodeGameResp(message: GameResp, bb: ByteBuffer): void {
  // optional string roomId = 1;
  let $roomId = message.roomId
  if ($roomId !== undefined) {
    writeVarint32(bb, 10)
    writeString(bb, $roomId)
  }

  // optional string playerId = 2;
  let $playerId = message.playerId
  if ($playerId !== undefined) {
    writeVarint32(bb, 18)
    writeString(bb, $playerId)
  }

  // optional string messageType = 3;
  let $messageType = message.messageType
  if ($messageType !== undefined) {
    writeVarint32(bb, 26)
    writeString(bb, $messageType)
  }

  // optional string messageValue = 4;
  let $messageValue = message.messageValue
  if ($messageValue !== undefined) {
    writeVarint32(bb, 34)
    writeString(bb, $messageValue)
  }

  // optional MazeMap mazeMap = 5;
  let $mazeMap = message.mazeMap
  if ($mazeMap !== undefined) {
    writeVarint32(bb, 42)
    let nested = popByteBuffer()
    _encodeMazeMap($mazeMap, nested)
    writeVarint32(bb, nested.limit)
    writeByteBuffer(bb, nested)
    pushByteBuffer(nested)
  }

  // repeated Tank players = 6;
  let array$players = message.players
  if (array$players !== undefined) {
    for (let value of array$players) {
      writeVarint32(bb, 50)
      let nested = popByteBuffer()
      _encodeTank(value, nested)
      writeVarint32(bb, nested.limit)
      writeByteBuffer(bb, nested)
      pushByteBuffer(nested)
    }
  }
}

export function decodeGameResp(binary: Uint8Array): GameResp {
  return _decodeGameResp(wrapByteBuffer(binary))
}

function _decodeGameResp(bb: ByteBuffer): GameResp {
  let message: GameResp = {} as any

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb)

    switch (tag >>> 3) {
      case 0:
        break end_of_message

      // optional string roomId = 1;
      case 1: {
        message.roomId = readString(bb, readVarint32(bb))
        break
      }

      // optional string playerId = 2;
      case 2: {
        message.playerId = readString(bb, readVarint32(bb))
        break
      }

      // optional string messageType = 3;
      case 3: {
        message.messageType = readString(bb, readVarint32(bb))
        break
      }

      // optional string messageValue = 4;
      case 4: {
        message.messageValue = readString(bb, readVarint32(bb))
        break
      }

      // optional MazeMap mazeMap = 5;
      case 5: {
        let limit = pushTemporaryLength(bb)
        message.mazeMap = _decodeMazeMap(bb)
        bb.limit = limit
        break
      }

      // repeated Tank players = 6;
      case 6: {
        let limit = pushTemporaryLength(bb)
        let values = message.players || (message.players = [])
        values.push(_decodeTank(bb))
        bb.limit = limit
        break
      }

      default:
        skipUnknownField(bb, tag & 7)
    }
  }

  return message
}

export interface MazeMap {
  id?: string
  width?: number
  height?: number
  cellSize?: number
  color?: string
  wallThickness?: number
  grids?: Grid[]
  gridWalls?: { [key: string]: Wall }
}

export function encodeMazeMap(message: MazeMap): Uint8Array {
  let bb = popByteBuffer()
  _encodeMazeMap(message, bb)
  return toUint8Array(bb)
}

function _encodeMazeMap(message: MazeMap, bb: ByteBuffer): void {
  // optional string id = 1;
  let $id = message.id
  if ($id !== undefined) {
    writeVarint32(bb, 10)
    writeString(bb, $id)
  }

  // optional int32 width = 2;
  let $width = message.width
  if ($width !== undefined) {
    writeVarint32(bb, 16)
    writeVarint64(bb, intToLong($width))
  }

  // optional int32 height = 3;
  let $height = message.height
  if ($height !== undefined) {
    writeVarint32(bb, 24)
    writeVarint64(bb, intToLong($height))
  }

  // optional int32 cellSize = 4;
  let $cellSize = message.cellSize
  if ($cellSize !== undefined) {
    writeVarint32(bb, 32)
    writeVarint64(bb, intToLong($cellSize))
  }

  // optional string color = 5;
  let $color = message.color
  if ($color !== undefined) {
    writeVarint32(bb, 42)
    writeString(bb, $color)
  }

  // optional int32 wallThickness = 6;
  let $wallThickness = message.wallThickness
  if ($wallThickness !== undefined) {
    writeVarint32(bb, 48)
    writeVarint64(bb, intToLong($wallThickness))
  }

  // repeated Grid grids = 7;
  let array$grids = message.grids
  if (array$grids !== undefined) {
    for (let value of array$grids) {
      writeVarint32(bb, 58)
      let nested = popByteBuffer()
      _encodeGrid(value, nested)
      writeVarint32(bb, nested.limit)
      writeByteBuffer(bb, nested)
      pushByteBuffer(nested)
    }
  }

  // optional map<string, Wall> gridWalls = 8;
  let map$gridWalls = message.gridWalls
  if (map$gridWalls !== undefined) {
    for (let key in map$gridWalls) {
      let nested = popByteBuffer()
      let value = map$gridWalls[key]
      writeVarint32(nested, 10)
      writeString(nested, key)
      writeVarint32(nested, 18)
      let nestedValue = popByteBuffer()
      _encodeWall(value, nestedValue)
      writeVarint32(nested, nestedValue.limit)
      writeByteBuffer(nested, nestedValue)
      pushByteBuffer(nestedValue)
      writeVarint32(bb, 66)
      writeVarint32(bb, nested.offset)
      writeByteBuffer(bb, nested)
      pushByteBuffer(nested)
    }
  }
}

export function decodeMazeMap(binary: Uint8Array): MazeMap {
  return _decodeMazeMap(wrapByteBuffer(binary))
}

function _decodeMazeMap(bb: ByteBuffer): MazeMap {
  let message: MazeMap = {} as any

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb)

    switch (tag >>> 3) {
      case 0:
        break end_of_message

      // optional string id = 1;
      case 1: {
        message.id = readString(bb, readVarint32(bb))
        break
      }

      // optional int32 width = 2;
      case 2: {
        message.width = readVarint32(bb)
        break
      }

      // optional int32 height = 3;
      case 3: {
        message.height = readVarint32(bb)
        break
      }

      // optional int32 cellSize = 4;
      case 4: {
        message.cellSize = readVarint32(bb)
        break
      }

      // optional string color = 5;
      case 5: {
        message.color = readString(bb, readVarint32(bb))
        break
      }

      // optional int32 wallThickness = 6;
      case 6: {
        message.wallThickness = readVarint32(bb)
        break
      }

      // repeated Grid grids = 7;
      case 7: {
        let limit = pushTemporaryLength(bb)
        let values = message.grids || (message.grids = [])
        values.push(_decodeGrid(bb))
        bb.limit = limit
        break
      }

      // optional map<string, Wall> gridWalls = 8;
      case 8: {
        let values = message.gridWalls || (message.gridWalls = {})
        let outerLimit = pushTemporaryLength(bb)
        let key: string | undefined
        let value: Wall | undefined
        end_of_entry: while (!isAtEnd(bb)) {
          let tag = readVarint32(bb)
          switch (tag >>> 3) {
            case 0:
              break end_of_entry
            case 1: {
              key = readString(bb, readVarint32(bb))
              break
            }
            case 2: {
              let valueLimit = pushTemporaryLength(bb)
              value = _decodeWall(bb)
              bb.limit = valueLimit
              break
            }
            default:
              skipUnknownField(bb, tag & 7)
          }
        }
        if (key === undefined || value === undefined) throw new Error('Invalid data for map: gridWalls')
        values[key] = value
        bb.limit = outerLimit
        break
      }

      default:
        skipUnknownField(bb, tag & 7)
    }
  }

  return message
}

export interface Grid {
  grid?: SubGrid[]
}

export function encodeGrid(message: Grid): Uint8Array {
  let bb = popByteBuffer()
  _encodeGrid(message, bb)
  return toUint8Array(bb)
}

function _encodeGrid(message: Grid, bb: ByteBuffer): void {
  // repeated SubGrid grid = 1;
  let array$grid = message.grid
  if (array$grid !== undefined) {
    for (let value of array$grid) {
      writeVarint32(bb, 10)
      let nested = popByteBuffer()
      _encodeSubGrid(value, nested)
      writeVarint32(bb, nested.limit)
      writeByteBuffer(bb, nested)
      pushByteBuffer(nested)
    }
  }
}

export function decodeGrid(binary: Uint8Array): Grid {
  return _decodeGrid(wrapByteBuffer(binary))
}

function _decodeGrid(bb: ByteBuffer): Grid {
  let message: Grid = {} as any

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb)

    switch (tag >>> 3) {
      case 0:
        break end_of_message

      // repeated SubGrid grid = 1;
      case 1: {
        let limit = pushTemporaryLength(bb)
        let values = message.grid || (message.grid = [])
        values.push(_decodeSubGrid(bb))
        bb.limit = limit
        break
      }

      default:
        skipUnknownField(bb, tag & 7)
    }
  }

  return message
}

export interface SubGrid {
  X?: number
  Y?: number
  row?: number
  col?: number
  visited?: boolean
  walls?: Walls
}

export function encodeSubGrid(message: SubGrid): Uint8Array {
  let bb = popByteBuffer()
  _encodeSubGrid(message, bb)
  return toUint8Array(bb)
}

function _encodeSubGrid(message: SubGrid, bb: ByteBuffer): void {
  // optional int32 X = 1;
  let $X = message.X
  if ($X !== undefined) {
    writeVarint32(bb, 8)
    writeVarint64(bb, intToLong($X))
  }

  // optional int32 Y = 2;
  let $Y = message.Y
  if ($Y !== undefined) {
    writeVarint32(bb, 16)
    writeVarint64(bb, intToLong($Y))
  }

  // optional int32 row = 3;
  let $row = message.row
  if ($row !== undefined) {
    writeVarint32(bb, 24)
    writeVarint64(bb, intToLong($row))
  }

  // optional int32 col = 4;
  let $col = message.col
  if ($col !== undefined) {
    writeVarint32(bb, 32)
    writeVarint64(bb, intToLong($col))
  }

  // optional bool visited = 5;
  let $visited = message.visited
  if ($visited !== undefined) {
    writeVarint32(bb, 40)
    writeByte(bb, $visited ? 1 : 0)
  }

  // optional Walls walls = 6;
  let $walls = message.walls
  if ($walls !== undefined) {
    writeVarint32(bb, 50)
    let nested = popByteBuffer()
    _encodeWalls($walls, nested)
    writeVarint32(bb, nested.limit)
    writeByteBuffer(bb, nested)
    pushByteBuffer(nested)
  }
}

export function decodeSubGrid(binary: Uint8Array): SubGrid {
  return _decodeSubGrid(wrapByteBuffer(binary))
}

function _decodeSubGrid(bb: ByteBuffer): SubGrid {
  let message: SubGrid = {} as any

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb)

    switch (tag >>> 3) {
      case 0:
        break end_of_message

      // optional int32 X = 1;
      case 1: {
        message.X = readVarint32(bb)
        break
      }

      // optional int32 Y = 2;
      case 2: {
        message.Y = readVarint32(bb)
        break
      }

      // optional int32 row = 3;
      case 3: {
        message.row = readVarint32(bb)
        break
      }

      // optional int32 col = 4;
      case 4: {
        message.col = readVarint32(bb)
        break
      }

      // optional bool visited = 5;
      case 5: {
        message.visited = !!readByte(bb)
        break
      }

      // optional Walls walls = 6;
      case 6: {
        let limit = pushTemporaryLength(bb)
        message.walls = _decodeWalls(bb)
        bb.limit = limit
        break
      }

      default:
        skipUnknownField(bb, tag & 7)
    }
  }

  return message
}

export interface Wall {
  wall?: SubWall[]
}

export function encodeWall(message: Wall): Uint8Array {
  let bb = popByteBuffer()
  _encodeWall(message, bb)
  return toUint8Array(bb)
}

function _encodeWall(message: Wall, bb: ByteBuffer): void {
  // repeated SubWall wall = 1;
  let array$wall = message.wall
  if (array$wall !== undefined) {
    for (let value of array$wall) {
      writeVarint32(bb, 10)
      let nested = popByteBuffer()
      _encodeSubWall(value, nested)
      writeVarint32(bb, nested.limit)
      writeByteBuffer(bb, nested)
      pushByteBuffer(nested)
    }
  }
}

export function decodeWall(binary: Uint8Array): Wall {
  return _decodeWall(wrapByteBuffer(binary))
}

function _decodeWall(bb: ByteBuffer): Wall {
  let message: Wall = {} as any

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb)

    switch (tag >>> 3) {
      case 0:
        break end_of_message

      // repeated SubWall wall = 1;
      case 1: {
        let limit = pushTemporaryLength(bb)
        let values = message.wall || (message.wall = [])
        values.push(_decodeSubWall(bb))
        bb.limit = limit
        break
      }

      default:
        skipUnknownField(bb, tag & 7)
    }
  }

  return message
}

export interface SubWall {
  direction?: string
  centerX?: number
  centerY?: number
  width?: number
  height?: number
}

export function encodeSubWall(message: SubWall): Uint8Array {
  let bb = popByteBuffer()
  _encodeSubWall(message, bb)
  return toUint8Array(bb)
}

function _encodeSubWall(message: SubWall, bb: ByteBuffer): void {
  // optional string direction = 1;
  let $direction = message.direction
  if ($direction !== undefined) {
    writeVarint32(bb, 10)
    writeString(bb, $direction)
  }

  // optional float centerX = 2;
  let $centerX = message.centerX
  if ($centerX !== undefined) {
    writeVarint32(bb, 21)
    writeFloat(bb, $centerX)
  }

  // optional float centerY = 3;
  let $centerY = message.centerY
  if ($centerY !== undefined) {
    writeVarint32(bb, 29)
    writeFloat(bb, $centerY)
  }

  // optional int32 width = 4;
  let $width = message.width
  if ($width !== undefined) {
    writeVarint32(bb, 32)
    writeVarint64(bb, intToLong($width))
  }

  // optional int32 height = 5;
  let $height = message.height
  if ($height !== undefined) {
    writeVarint32(bb, 40)
    writeVarint64(bb, intToLong($height))
  }
}

export function decodeSubWall(binary: Uint8Array): SubWall {
  return _decodeSubWall(wrapByteBuffer(binary))
}

function _decodeSubWall(bb: ByteBuffer): SubWall {
  let message: SubWall = {} as any

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb)

    switch (tag >>> 3) {
      case 0:
        break end_of_message

      // optional string direction = 1;
      case 1: {
        message.direction = readString(bb, readVarint32(bb))
        break
      }

      // optional float centerX = 2;
      case 2: {
        message.centerX = readFloat(bb)
        break
      }

      // optional float centerY = 3;
      case 3: {
        message.centerY = readFloat(bb)
        break
      }

      // optional int32 width = 4;
      case 4: {
        message.width = readVarint32(bb)
        break
      }

      // optional int32 height = 5;
      case 5: {
        message.height = readVarint32(bb)
        break
      }

      default:
        skipUnknownField(bb, tag & 7)
    }
  }

  return message
}

export interface Walls {
  Top?: boolean
  Bottom?: boolean
  Left?: boolean
  Right?: boolean
}

export function encodeWalls(message: Walls): Uint8Array {
  let bb = popByteBuffer()
  _encodeWalls(message, bb)
  return toUint8Array(bb)
}

function _encodeWalls(message: Walls, bb: ByteBuffer): void {
  // optional bool Top = 1;
  let $Top = message.Top
  if ($Top !== undefined) {
    writeVarint32(bb, 8)
    writeByte(bb, $Top ? 1 : 0)
  }

  // optional bool Bottom = 2;
  let $Bottom = message.Bottom
  if ($Bottom !== undefined) {
    writeVarint32(bb, 16)
    writeByte(bb, $Bottom ? 1 : 0)
  }

  // optional bool Left = 3;
  let $Left = message.Left
  if ($Left !== undefined) {
    writeVarint32(bb, 24)
    writeByte(bb, $Left ? 1 : 0)
  }

  // optional bool Right = 4;
  let $Right = message.Right
  if ($Right !== undefined) {
    writeVarint32(bb, 32)
    writeByte(bb, $Right ? 1 : 0)
  }
}

export function decodeWalls(binary: Uint8Array): Walls {
  return _decodeWalls(wrapByteBuffer(binary))
}

function _decodeWalls(bb: ByteBuffer): Walls {
  let message: Walls = {} as any

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb)

    switch (tag >>> 3) {
      case 0:
        break end_of_message

      // optional bool Top = 1;
      case 1: {
        message.Top = !!readByte(bb)
        break
      }

      // optional bool Bottom = 2;
      case 2: {
        message.Bottom = !!readByte(bb)
        break
      }

      // optional bool Left = 3;
      case 3: {
        message.Left = !!readByte(bb)
        break
      }

      // optional bool Right = 4;
      case 4: {
        message.Right = !!readByte(bb)
        break
      }

      default:
        skipUnknownField(bb, tag & 7)
    }
  }

  return message
}

export interface Tank {
  id?: string
  name?: string
  width?: number
  height?: number
  alive?: boolean
  score?: number
  color?: string
  centerX?: number
  centerY?: number
  rotation?: number
  speed?: number
  bulletNum?: number
  bullets?: Bullet[]
  hitWall?: boolean
  nextCenterX?: number
  nextCenterY?: number
}

export function encodeTank(message: Tank): Uint8Array {
  let bb = popByteBuffer()
  _encodeTank(message, bb)
  return toUint8Array(bb)
}

function _encodeTank(message: Tank, bb: ByteBuffer): void {
  // optional string id = 1;
  let $id = message.id
  if ($id !== undefined) {
    writeVarint32(bb, 10)
    writeString(bb, $id)
  }

  // optional string name = 2;
  let $name = message.name
  if ($name !== undefined) {
    writeVarint32(bb, 18)
    writeString(bb, $name)
  }

  // optional int32 width = 3;
  let $width = message.width
  if ($width !== undefined) {
    writeVarint32(bb, 24)
    writeVarint64(bb, intToLong($width))
  }

  // optional int32 height = 4;
  let $height = message.height
  if ($height !== undefined) {
    writeVarint32(bb, 32)
    writeVarint64(bb, intToLong($height))
  }

  // optional bool alive = 5;
  let $alive = message.alive
  if ($alive !== undefined) {
    writeVarint32(bb, 40)
    writeByte(bb, $alive ? 1 : 0)
  }

  // optional int32 score = 6;
  let $score = message.score
  if ($score !== undefined) {
    writeVarint32(bb, 48)
    writeVarint64(bb, intToLong($score))
  }

  // optional string color = 7;
  let $color = message.color
  if ($color !== undefined) {
    writeVarint32(bb, 58)
    writeString(bb, $color)
  }

  // optional float centerX = 8;
  let $centerX = message.centerX
  if ($centerX !== undefined) {
    writeVarint32(bb, 69)
    writeFloat(bb, $centerX)
  }

  // optional float centerY = 9;
  let $centerY = message.centerY
  if ($centerY !== undefined) {
    writeVarint32(bb, 77)
    writeFloat(bb, $centerY)
  }

  // optional float rotation = 10;
  let $rotation = message.rotation
  if ($rotation !== undefined) {
    writeVarint32(bb, 85)
    writeFloat(bb, $rotation)
  }

  // optional float speed = 11;
  let $speed = message.speed
  if ($speed !== undefined) {
    writeVarint32(bb, 93)
    writeFloat(bb, $speed)
  }

  // optional int32 bulletNum = 12;
  let $bulletNum = message.bulletNum
  if ($bulletNum !== undefined) {
    writeVarint32(bb, 96)
    writeVarint64(bb, intToLong($bulletNum))
  }

  // repeated Bullet bullets = 13;
  let array$bullets = message.bullets
  if (array$bullets !== undefined) {
    for (let value of array$bullets) {
      writeVarint32(bb, 106)
      let nested = popByteBuffer()
      _encodeBullet(value, nested)
      writeVarint32(bb, nested.limit)
      writeByteBuffer(bb, nested)
      pushByteBuffer(nested)
    }
  }

  // optional bool hitWall = 14;
  let $hitWall = message.hitWall
  if ($hitWall !== undefined) {
    writeVarint32(bb, 112)
    writeByte(bb, $hitWall ? 1 : 0)
  }

  // optional float nextCenterX = 15;
  let $nextCenterX = message.nextCenterX
  if ($nextCenterX !== undefined) {
    writeVarint32(bb, 125)
    writeFloat(bb, $nextCenterX)
  }

  // optional float nextCenterY = 16;
  let $nextCenterY = message.nextCenterY
  if ($nextCenterY !== undefined) {
    writeVarint32(bb, 133)
    writeFloat(bb, $nextCenterY)
  }
}

export function decodeTank(binary: Uint8Array): Tank {
  return _decodeTank(wrapByteBuffer(binary))
}

function _decodeTank(bb: ByteBuffer): Tank {
  let message: Tank = {} as any

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb)

    switch (tag >>> 3) {
      case 0:
        break end_of_message

      // optional string id = 1;
      case 1: {
        message.id = readString(bb, readVarint32(bb))
        break
      }

      // optional string name = 2;
      case 2: {
        message.name = readString(bb, readVarint32(bb))
        break
      }

      // optional int32 width = 3;
      case 3: {
        message.width = readVarint32(bb)
        break
      }

      // optional int32 height = 4;
      case 4: {
        message.height = readVarint32(bb)
        break
      }

      // optional bool alive = 5;
      case 5: {
        message.alive = !!readByte(bb)
        break
      }

      // optional int32 score = 6;
      case 6: {
        message.score = readVarint32(bb)
        break
      }

      // optional string color = 7;
      case 7: {
        message.color = readString(bb, readVarint32(bb))
        break
      }

      // optional float centerX = 8;
      case 8: {
        message.centerX = readFloat(bb)
        break
      }

      // optional float centerY = 9;
      case 9: {
        message.centerY = readFloat(bb)
        break
      }

      // optional float rotation = 10;
      case 10: {
        message.rotation = readFloat(bb)
        break
      }

      // optional float speed = 11;
      case 11: {
        message.speed = readFloat(bb)
        break
      }

      // optional int32 bulletNum = 12;
      case 12: {
        message.bulletNum = readVarint32(bb)
        break
      }

      // repeated Bullet bullets = 13;
      case 13: {
        let limit = pushTemporaryLength(bb)
        let values = message.bullets || (message.bullets = [])
        values.push(_decodeBullet(bb))
        bb.limit = limit
        break
      }

      // optional bool hitWall = 14;
      case 14: {
        message.hitWall = !!readByte(bb)
        break
      }

      // optional float nextCenterX = 15;
      case 15: {
        message.nextCenterX = readFloat(bb)
        break
      }

      // optional float nextCenterY = 16;
      case 16: {
        message.nextCenterY = readFloat(bb)
        break
      }

      default:
        skipUnknownField(bb, tag & 7)
    }
  }

  return message
}

export interface Bullet {
  id?: string
  from?: string
  firstShoot?: boolean
  color?: string
  radius?: number
  rotation?: number
  speed?: number
  bounces?: number
  centerX?: number
  centerY?: number
}

export function encodeBullet(message: Bullet): Uint8Array {
  let bb = popByteBuffer()
  _encodeBullet(message, bb)
  return toUint8Array(bb)
}

function _encodeBullet(message: Bullet, bb: ByteBuffer): void {
  // optional string id = 1;
  let $id = message.id
  if ($id !== undefined) {
    writeVarint32(bb, 10)
    writeString(bb, $id)
  }

  // optional string from = 2;
  let $from = message.from
  if ($from !== undefined) {
    writeVarint32(bb, 18)
    writeString(bb, $from)
  }

  // optional bool firstShoot = 3;
  let $firstShoot = message.firstShoot
  if ($firstShoot !== undefined) {
    writeVarint32(bb, 24)
    writeByte(bb, $firstShoot ? 1 : 0)
  }

  // optional string color = 4;
  let $color = message.color
  if ($color !== undefined) {
    writeVarint32(bb, 34)
    writeString(bb, $color)
  }

  // optional float radius = 5;
  let $radius = message.radius
  if ($radius !== undefined) {
    writeVarint32(bb, 45)
    writeFloat(bb, $radius)
  }

  // optional float rotation = 6;
  let $rotation = message.rotation
  if ($rotation !== undefined) {
    writeVarint32(bb, 53)
    writeFloat(bb, $rotation)
  }

  // optional float speed = 7;
  let $speed = message.speed
  if ($speed !== undefined) {
    writeVarint32(bb, 61)
    writeFloat(bb, $speed)
  }

  // optional int32 bounces = 8;
  let $bounces = message.bounces
  if ($bounces !== undefined) {
    writeVarint32(bb, 64)
    writeVarint64(bb, intToLong($bounces))
  }

  // optional float centerX = 9;
  let $centerX = message.centerX
  if ($centerX !== undefined) {
    writeVarint32(bb, 77)
    writeFloat(bb, $centerX)
  }

  // optional float centerY = 10;
  let $centerY = message.centerY
  if ($centerY !== undefined) {
    writeVarint32(bb, 85)
    writeFloat(bb, $centerY)
  }
}

export function decodeBullet(binary: Uint8Array): Bullet {
  return _decodeBullet(wrapByteBuffer(binary))
}

function _decodeBullet(bb: ByteBuffer): Bullet {
  let message: Bullet = {} as any

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb)

    switch (tag >>> 3) {
      case 0:
        break end_of_message

      // optional string id = 1;
      case 1: {
        message.id = readString(bb, readVarint32(bb))
        break
      }

      // optional string from = 2;
      case 2: {
        message.from = readString(bb, readVarint32(bb))
        break
      }

      // optional bool firstShoot = 3;
      case 3: {
        message.firstShoot = !!readByte(bb)
        break
      }

      // optional string color = 4;
      case 4: {
        message.color = readString(bb, readVarint32(bb))
        break
      }

      // optional float radius = 5;
      case 5: {
        message.radius = readFloat(bb)
        break
      }

      // optional float rotation = 6;
      case 6: {
        message.rotation = readFloat(bb)
        break
      }

      // optional float speed = 7;
      case 7: {
        message.speed = readFloat(bb)
        break
      }

      // optional int32 bounces = 8;
      case 8: {
        message.bounces = readVarint32(bb)
        break
      }

      // optional float centerX = 9;
      case 9: {
        message.centerX = readFloat(bb)
        break
      }

      // optional float centerY = 10;
      case 10: {
        message.centerY = readFloat(bb)
        break
      }

      default:
        skipUnknownField(bb, tag & 7)
    }
  }

  return message
}

export interface Long {
  low: number
  high: number
  unsigned: boolean
}

interface ByteBuffer {
  bytes: Uint8Array
  offset: number
  limit: number
}

function pushTemporaryLength(bb: ByteBuffer): number {
  let length = readVarint32(bb)
  let limit = bb.limit
  bb.limit = bb.offset + length
  return limit
}

function skipUnknownField(bb: ByteBuffer, type: number): void {
  switch (type) {
    case 0:
      while (readByte(bb) & 0x80) {}
      break
    case 2:
      skip(bb, readVarint32(bb))
      break
    case 5:
      skip(bb, 4)
      break
    case 1:
      skip(bb, 8)
      break
    default:
      throw new Error('Unimplemented type: ' + type)
  }
}

function stringToLong(value: string): Long {
  return {
    low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),
    high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),
    unsigned: false
  }
}

function longToString(value: Long): string {
  let low = value.low
  let high = value.high
  return String.fromCharCode(low & 0xffff, low >>> 16, high & 0xffff, high >>> 16)
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

let f32 = new Float32Array(1)
let f32_u8 = new Uint8Array(f32.buffer)

let f64 = new Float64Array(1)
let f64_u8 = new Uint8Array(f64.buffer)

function intToLong(value: number): Long {
  value |= 0
  return {
    low: value,
    high: value >> 31,
    unsigned: value >= 0
  }
}

let bbStack: ByteBuffer[] = []

function popByteBuffer(): ByteBuffer {
  const bb = bbStack.pop()
  if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 }
  bb.offset = bb.limit = 0
  return bb
}

function pushByteBuffer(bb: ByteBuffer): void {
  bbStack.push(bb)
}

function wrapByteBuffer(bytes: Uint8Array): ByteBuffer {
  return { bytes, offset: 0, limit: bytes.length }
}

function toUint8Array(bb: ByteBuffer): Uint8Array {
  let bytes = bb.bytes
  let limit = bb.limit
  return bytes.length === limit ? bytes : bytes.subarray(0, limit)
}

function skip(bb: ByteBuffer, offset: number): void {
  if (bb.offset + offset > bb.limit) {
    throw new Error('Skip past limit')
  }
  bb.offset += offset
}

function isAtEnd(bb: ByteBuffer): boolean {
  return bb.offset >= bb.limit
}

function grow(bb: ByteBuffer, count: number): number {
  let bytes = bb.bytes
  let offset = bb.offset
  let limit = bb.limit
  let finalOffset = offset + count
  if (finalOffset > bytes.length) {
    let newBytes = new Uint8Array(finalOffset * 2)
    newBytes.set(bytes)
    bb.bytes = newBytes
  }
  bb.offset = finalOffset
  if (finalOffset > limit) {
    bb.limit = finalOffset
  }
  return offset
}

function advance(bb: ByteBuffer, count: number): number {
  let offset = bb.offset
  if (offset + count > bb.limit) {
    throw new Error('Read past limit')
  }
  bb.offset += count
  return offset
}

function readBytes(bb: ByteBuffer, count: number): Uint8Array {
  let offset = advance(bb, count)
  return bb.bytes.subarray(offset, offset + count)
}

function writeBytes(bb: ByteBuffer, buffer: Uint8Array): void {
  let offset = grow(bb, buffer.length)
  bb.bytes.set(buffer, offset)
}

function readString(bb: ByteBuffer, count: number): string {
  // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
  let offset = advance(bb, count)
  let fromCharCode = String.fromCharCode
  let bytes = bb.bytes
  let invalid = '\uFFFD'
  let text = ''

  for (let i = 0; i < count; i++) {
    let c1 = bytes[i + offset],
      c2: number,
      c3: number,
      c4: number,
      c: number

    // 1 byte
    if ((c1 & 0x80) === 0) {
      text += fromCharCode(c1)
    }

    // 2 bytes
    else if ((c1 & 0xe0) === 0xc0) {
      if (i + 1 >= count) text += invalid
      else {
        c2 = bytes[i + offset + 1]
        if ((c2 & 0xc0) !== 0x80) text += invalid
        else {
          c = ((c1 & 0x1f) << 6) | (c2 & 0x3f)
          if (c < 0x80) text += invalid
          else {
            text += fromCharCode(c)
            i++
          }
        }
      }
    }

    // 3 bytes
    else if ((c1 & 0xf0) == 0xe0) {
      if (i + 2 >= count) text += invalid
      else {
        c2 = bytes[i + offset + 1]
        c3 = bytes[i + offset + 2]
        if (((c2 | (c3 << 8)) & 0xc0c0) !== 0x8080) text += invalid
        else {
          c = ((c1 & 0x0f) << 12) | ((c2 & 0x3f) << 6) | (c3 & 0x3f)
          if (c < 0x0800 || (c >= 0xd800 && c <= 0xdfff)) text += invalid
          else {
            text += fromCharCode(c)
            i += 2
          }
        }
      }
    }

    // 4 bytes
    else if ((c1 & 0xf8) == 0xf0) {
      if (i + 3 >= count) text += invalid
      else {
        c2 = bytes[i + offset + 1]
        c3 = bytes[i + offset + 2]
        c4 = bytes[i + offset + 3]
        if (((c2 | (c3 << 8) | (c4 << 16)) & 0xc0c0c0) !== 0x808080) text += invalid
        else {
          c = ((c1 & 0x07) << 0x12) | ((c2 & 0x3f) << 0x0c) | ((c3 & 0x3f) << 0x06) | (c4 & 0x3f)
          if (c < 0x10000 || c > 0x10ffff) text += invalid
          else {
            c -= 0x10000
            text += fromCharCode((c >> 10) + 0xd800, (c & 0x3ff) + 0xdc00)
            i += 3
          }
        }
      }
    } else text += invalid
  }

  return text
}

function writeString(bb: ByteBuffer, text: string): void {
  // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8
  let n = text.length
  let byteCount = 0

  // Write the byte count first
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i)
    if (c >= 0xd800 && c <= 0xdbff && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35fdc00
    }
    byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4
  }
  writeVarint32(bb, byteCount)

  let offset = grow(bb, byteCount)
  let bytes = bb.bytes

  // Then write the bytes
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i)
    if (c >= 0xd800 && c <= 0xdbff && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35fdc00
    }
    if (c < 0x80) {
      bytes[offset++] = c
    } else {
      if (c < 0x800) {
        bytes[offset++] = ((c >> 6) & 0x1f) | 0xc0
      } else {
        if (c < 0x10000) {
          bytes[offset++] = ((c >> 12) & 0x0f) | 0xe0
        } else {
          bytes[offset++] = ((c >> 18) & 0x07) | 0xf0
          bytes[offset++] = ((c >> 12) & 0x3f) | 0x80
        }
        bytes[offset++] = ((c >> 6) & 0x3f) | 0x80
      }
      bytes[offset++] = (c & 0x3f) | 0x80
    }
  }
}

function writeByteBuffer(bb: ByteBuffer, buffer: ByteBuffer): void {
  let offset = grow(bb, buffer.limit)
  let from = bb.bytes
  let to = buffer.bytes

  // This for loop is much faster than subarray+set on V8
  for (let i = 0, n = buffer.limit; i < n; i++) {
    from[i + offset] = to[i]
  }
}

function readByte(bb: ByteBuffer): number {
  return bb.bytes[advance(bb, 1)]
}

function writeByte(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 1)
  bb.bytes[offset] = value
}

function readFloat(bb: ByteBuffer): number {
  let offset = advance(bb, 4)
  let bytes = bb.bytes

  // Manual copying is much faster than subarray+set in V8
  f32_u8[0] = bytes[offset++]
  f32_u8[1] = bytes[offset++]
  f32_u8[2] = bytes[offset++]
  f32_u8[3] = bytes[offset++]
  return f32[0]
}

function writeFloat(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4)
  let bytes = bb.bytes
  f32[0] = value

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f32_u8[0]
  bytes[offset++] = f32_u8[1]
  bytes[offset++] = f32_u8[2]
  bytes[offset++] = f32_u8[3]
}

function readDouble(bb: ByteBuffer): number {
  let offset = advance(bb, 8)
  let bytes = bb.bytes

  // Manual copying is much faster than subarray+set in V8
  f64_u8[0] = bytes[offset++]
  f64_u8[1] = bytes[offset++]
  f64_u8[2] = bytes[offset++]
  f64_u8[3] = bytes[offset++]
  f64_u8[4] = bytes[offset++]
  f64_u8[5] = bytes[offset++]
  f64_u8[6] = bytes[offset++]
  f64_u8[7] = bytes[offset++]
  return f64[0]
}

function writeDouble(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 8)
  let bytes = bb.bytes
  f64[0] = value

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f64_u8[0]
  bytes[offset++] = f64_u8[1]
  bytes[offset++] = f64_u8[2]
  bytes[offset++] = f64_u8[3]
  bytes[offset++] = f64_u8[4]
  bytes[offset++] = f64_u8[5]
  bytes[offset++] = f64_u8[6]
  bytes[offset++] = f64_u8[7]
}

function readInt32(bb: ByteBuffer): number {
  let offset = advance(bb, 4)
  let bytes = bb.bytes
  return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)
}

function writeInt32(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4)
  let bytes = bb.bytes
  bytes[offset] = value
  bytes[offset + 1] = value >> 8
  bytes[offset + 2] = value >> 16
  bytes[offset + 3] = value >> 24
}

function readInt64(bb: ByteBuffer, unsigned: boolean): Long {
  return {
    low: readInt32(bb),
    high: readInt32(bb),
    unsigned
  }
}

function writeInt64(bb: ByteBuffer, value: Long): void {
  writeInt32(bb, value.low)
  writeInt32(bb, value.high)
}

function readVarint32(bb: ByteBuffer): number {
  let c = 0
  let value = 0
  let b: number
  do {
    b = readByte(bb)
    if (c < 32) value |= (b & 0x7f) << c
    c += 7
  } while (b & 0x80)
  return value
}

function writeVarint32(bb: ByteBuffer, value: number): void {
  value >>>= 0
  while (value >= 0x80) {
    writeByte(bb, (value & 0x7f) | 0x80)
    value >>>= 7
  }
  writeByte(bb, value)
}

function readVarint64(bb: ByteBuffer, unsigned: boolean): Long {
  let part0 = 0
  let part1 = 0
  let part2 = 0
  let b: number

  b = readByte(bb)
  part0 = b & 0x7f
  if (b & 0x80) {
    b = readByte(bb)
    part0 |= (b & 0x7f) << 7
    if (b & 0x80) {
      b = readByte(bb)
      part0 |= (b & 0x7f) << 14
      if (b & 0x80) {
        b = readByte(bb)
        part0 |= (b & 0x7f) << 21
        if (b & 0x80) {
          b = readByte(bb)
          part1 = b & 0x7f
          if (b & 0x80) {
            b = readByte(bb)
            part1 |= (b & 0x7f) << 7
            if (b & 0x80) {
              b = readByte(bb)
              part1 |= (b & 0x7f) << 14
              if (b & 0x80) {
                b = readByte(bb)
                part1 |= (b & 0x7f) << 21
                if (b & 0x80) {
                  b = readByte(bb)
                  part2 = b & 0x7f
                  if (b & 0x80) {
                    b = readByte(bb)
                    part2 |= (b & 0x7f) << 7
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    low: part0 | (part1 << 28),
    high: (part1 >>> 4) | (part2 << 24),
    unsigned
  }
}

function writeVarint64(bb: ByteBuffer, value: Long): void {
  let part0 = value.low >>> 0
  let part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0
  let part2 = value.high >>> 24

  // ref: src/google/protobuf/io/coded_stream.cc
  let size =
    part2 === 0
      ? part1 === 0
        ? part0 < 1 << 14
          ? part0 < 1 << 7
            ? 1
            : 2
          : part0 < 1 << 21
          ? 3
          : 4
        : part1 < 1 << 14
        ? part1 < 1 << 7
          ? 5
          : 6
        : part1 < 1 << 21
        ? 7
        : 8
      : part2 < 1 << 7
      ? 9
      : 10

  let offset = grow(bb, size)
  let bytes = bb.bytes

  switch (size) {
    case 10:
      bytes[offset + 9] = (part2 >>> 7) & 0x01
    case 9:
      bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7f
    case 8:
      bytes[offset + 7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7f
    case 7:
      bytes[offset + 6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7f
    case 6:
      bytes[offset + 5] = size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7f
    case 5:
      bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7f
    case 4:
      bytes[offset + 3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7f
    case 3:
      bytes[offset + 2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7f
    case 2:
      bytes[offset + 1] = size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7f
    case 1:
      bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7f
  }
}

function readVarint32ZigZag(bb: ByteBuffer): number {
  let value = readVarint32(bb)

  // ref: src/google/protobuf/wire_format_lite.h
  return (value >>> 1) ^ -(value & 1)
}

function writeVarint32ZigZag(bb: ByteBuffer, value: number): void {
  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint32(bb, (value << 1) ^ (value >> 31))
}

function readVarint64ZigZag(bb: ByteBuffer): Long {
  let value = readVarint64(bb, /* unsigned */ false)
  let low = value.low
  let high = value.high
  let flip = -(low & 1)

  // ref: src/google/protobuf/wire_format_lite.h
  return {
    low: ((low >>> 1) | (high << 31)) ^ flip,
    high: (high >>> 1) ^ flip,
    unsigned: false
  }
}

function writeVarint64ZigZag(bb: ByteBuffer, value: Long): void {
  let low = value.low
  let high = value.high
  let flip = high >> 31

  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint64(bb, {
    low: (low << 1) ^ flip,
    high: ((high << 1) | (low >>> 31)) ^ flip,
    unsigned: false
  })
}
