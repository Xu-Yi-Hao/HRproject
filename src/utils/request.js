import axios from 'axios'
import store from '@/store';
import { Message } from 'element-ui';
import router from '@/router';
// 创建一个新的axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基础地址
  timeout: 10000
})

// 请求拦截器  
service.interceptors.request.use((config) => {
  // 在发送请求之前做些什么  
  // 例如：添加请求头、公共参数等  
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}` // 添加认证令牌 
  }
  return config;
}, (error) => {
  // 对请求错误做些什么  
  return Promise.reject(error);
});

// 响应拦截器  
service.interceptors.response.use((response) => {
  // 对响应数据做点什么  
  // 例如：对返回的数据进行统一处理、验证等 
  if (response.data instanceof Blob) return response.data
  const { data, message, success } = response.data
  if (success) {
    return data
  } else {
    Message({ type: 'error', message })
    return Promise.reject(new Error(message))
  }
}, async (error) => {
  if (error.response.status === 401) {
    Message({ type: 'warning', message: 'token超时了' })
    await store.dispatch('user/logout') // 调用action，退出登录
    // 主动跳转到登录页
    router.push('/login')
    return Promise.reject(error);
  }
  // 对响应错误做点什么  
  // 例如：对错误进行统一处理、抛出异常等  
  Message({ type: 'error', message: error.message })
  return Promise.reject(error);
});

export default service