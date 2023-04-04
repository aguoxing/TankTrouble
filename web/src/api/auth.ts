import request from '@/utils/request'
import { LoginFormData } from '@/types/api/user'

// 登录方法
export function login(data: LoginFormData) {
  return request({
    url: '/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 修改密码
export function updateUserPwd(data) {
  return request({
    url: '/admin/user/updatePwd',
    method: 'put',
    data: data
  })
}

// 获取用户详细信息
export function getUserInfo() {
  return request({
    url: '/getUserInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
