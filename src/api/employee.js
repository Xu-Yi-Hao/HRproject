import request from '@/utils/request'

// 获取员工列表
export function getEmployeeList(params) {
    return request({
        url: '/sys/user',
        params
    })
}

// 导出员工excel
export function exportEmployee() {
    return request({
        url: '/sys/user/export',
        responseType: 'blob', // 使用blob接收二进制文件流
    })
}

// 下载员工excel模板
export function getExportTemplate() {
    return request({
        url: '/sys/user/import/template',
        responseType: 'blob', // 使用blob接收二进制文件流
    })
}

// 上传员工excel
export function uploadExcel(data) {
    return request({
        url: '/sys/user/import',
        method: 'post',
        data
    })
}

// 删除员工
export function delEmployee(id) {
    return request({
        url: `/sys/user/${id}`,
        method: 'delete',
    })
}

// 新增员工
export function addEmployee(data) {
    return request({
        url: `/sys/user`,
        method: 'post',
        data
    })
}

// 获取员工信息
export function getEmployeeInfo(id) {
    return request({
        url: `/sys/user/${id}`,
    })
}

// 修改员工信息
export function updateEmployee(data) {
    return request({
        url: `/sys/user/${data.id}`,
        method: 'put',
        data
    })
}

// 获取可用角色列表
export function getEnableRoleList() {
    return request({
        url: `/sys/role/list/enabled`,
    })
}

// 分配员工角色
export function assignRole(data) {
    return request({
        url: `/sys/user/assignRoles`,
        method: 'put',
        data
    })
}