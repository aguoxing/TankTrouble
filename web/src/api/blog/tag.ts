import request from '@/utils/request'

export function listTag(data) {
  return request({
    url: '/blog/tag/list',
    method: 'post',
    data: data
  })
}

export function tagSelect() {
  return request({
    url: '/blog/tag/tagSelect',
    method: 'get'
  })
}

export function getTag(id) {
  return request({
    url: '/admin/tag/' + id,
    method: 'get'
  })
}

export function addTag(data) {
  return request({
    url: '/admin/tag',
    method: 'post',
    data: data
  })
}

export function updateTag(data) {
  return request({
    url: '/admin/tag',
    method: 'put',
    data: data
  })
}

export function deleteTag(data) {
  return request({
    url: '/admin/tag',
    method: 'delete',
    data: data
  })
}
