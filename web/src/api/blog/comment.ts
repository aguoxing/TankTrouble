import request from '@/utils/request'

export function listComment(data) {
  return request({
    url: '/blog/comment/list',
    method: 'post',
    data: data
  })
}
