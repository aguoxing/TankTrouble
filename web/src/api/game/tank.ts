import request from '@/utils/request'

export function getMazeMap(roomId: string) {
  return request({
    url: '/game/map/' + roomId,
    method: 'get'
  })
}
