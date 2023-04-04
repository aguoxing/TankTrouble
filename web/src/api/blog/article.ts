import request from '@/utils/request'

export function listArticle(data) {
  return request({
    url: '/blog/article/list',
    method: 'post',
    data: data
  })
}

export function listArticleVo(data) {
  return request({
    url: '/blog/article/listVo',
    method: 'post',
    data: data
  })
}

export function listTimeLine() {
  return request({
    url: '/blog/article/timeLine',
    method: 'get'
  })
}

export function getArticle(articleId) {
  return request({
    url: '/blog/article/' + articleId,
    method: 'get'
  })
}

export function addArticle(data) {
  return request({
    url: '/admin/article',
    method: 'post',
    data: data
  })
}

export function updateArticle(data) {
  return request({
    url: '/admin/article',
    method: 'put',
    data: data
  })
}

export function deleteArticle(data) {
  return request({
    url: '/admin/article',
    method: 'delete',
    data: data
  })
}

export function changeArticleStatus(data) {
  return request({
    url: '/admin/article/changeStatus',
    method: 'put',
    data: data
  })
}
