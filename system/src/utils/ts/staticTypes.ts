// 订单类型 MP & QDQ
export const orderTypeOptions = {
  MP: '1',
  ADQ: '2',
  SUM: '0',
}

// 推广类型
export const promotionTypeCode = {
  'h5': 1,
  'mini_program': 0,
}
export const promotionTypeDesc = {
  [promotionTypeCode.h5]: 'H5',
  [promotionTypeCode.mini_program]: '小程序',
}

// 收入来源
export const incomeSourceCode = {
  'launch': 1,
  'operation': 0,
}
export const incomeSourceDesc = {
  [incomeSourceCode.launch]: '投放推广',
  [incomeSourceCode.operation]: '运营推广',
}

// 投放类型
export const launchTypeCode = {
  'mp': 1,
  'adq': 2,
}
export const launchTypeDesc = {
  [launchTypeCode.mp]: 'MP投放',
  [launchTypeCode.adq]: 'ADQ投放',
}

// 页面跳转来源标识
export const pageFromType = {
  PLAYLET_LINK_MINIAPP: 'PLAYLET_LINK_MINIAPP', // 来自"企微助手 - 剧集管理 - 创建小程序链接"
  PLAYLET_LINK_H5: 'PLAYLET_LINK_H5', // 来自"企微助手 - 剧集管理 - 创建H5推广链接"
  PLAYLET_LINK_MULTI: 'PLAYLET_LINK_MULTI', // 来自"企微助手 - 剧集管理 - 批量创建链接"
}

export const linkType = {
  MINIAPP: 0, // 小程序
  H5: 1, // H5推广链接"
}

// 路由路径
export const routePathType = {
  GROUP_SEND: '/employee_bulk_messaging_log', // 客户群发
  WELCOME_MSG: '/welcom_message_create', // 欢迎语
}

// 客服激活状态
export const kfActiveStatusCode = {
  'NOT_ACTIVATED': 0,
  'ACTIVATED': 1,
}
export const kfActiveStatusMap = new Map([
  [kfActiveStatusCode.NOT_ACTIVATED, '未激活'],
  [kfActiveStatusCode.ACTIVATED, '已激活'],
])

// 客服状态
export const customerStaffStatusCode = {
  'USING': 1,
  'STOPPED': 2,
  'BANNED': 3,
}
export const customerStaffStatusMap = new Map([
  [customerStaffStatusCode.USING, '运营中'],
  [customerStaffStatusCode.STOPPED, '已停用'],
  [customerStaffStatusCode.BANNED, '已封禁'],
])
