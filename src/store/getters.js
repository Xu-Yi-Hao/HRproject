const getters = {
  sidebar: state => state.app.sidebar, // 取app模块属性
  device: state => state.app.device,
  token: state => state.user.token, // 取user模块属性
  userId: state => state.user.userInfo.userId,  // 用户ID
  avatar: state => state.user.userInfo.staffPhoto,  // 头像
  name: state => state.user.userInfo.username, // 用户名
  routes: state => state.user.routes,
  company: state => state.user.userInfo.company,
  departmentName: state => state.user.userInfo.departmentName,
}
// getters便捷访问
export default getters
