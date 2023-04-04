import request from '@/utils/request'

export function listCategory(data) {
  return request({
    url: '/blog/category/list',
    method: 'post',
    data: data
  })
}

export function categorySelect() {
  return request({
    url: '/blog/category/categorySelect',
    method: 'get'
  })
}

export function getCategory(id) {
  return request({
    url: '/admin/category/' + id,
    method: 'get'
  })
}

export function addCategory(data) {
  return request({
    url: '/admin/category',
    method: 'post',
    data: data
  })
}

export function updateCategory(data) {
  return request({
    url: '/admin/category',
    method: 'put',
    data: data
  })
}

export function deleteCategory(data) {
  return request({
    url: '/admin/category',
    method: 'delete',
    data: data
  })
}
