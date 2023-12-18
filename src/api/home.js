import request from '@/utils/request'

// 获取首页数据
export function getHomeData() {
    return request({
        url: '/home/data',
    })
}

// 获取首页消息通知
export function getHomeAdvice() {
    return request({
        url: '/home/notice',
    })
}