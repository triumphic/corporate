import { http } from "@/utils/service"

/**获取省市结构 */
export function eventUserView(params?: object, load?: Boolean) {
  return http.get({url:'/user/view', params, load})
}

/**获取省市结构 */
export function uploadImgEvent(params?: object, load?: Boolean) {
  return http.post({url:'/api/upload-img', params, load})
}

/**获取省市结构 */
export function getCityEnvent(params?: object, load?: Boolean) {
  return http.get({url:'/api/city', params, load})
}

/**完善企业信息 */
export function companyCreate(params?: object, load?: Boolean) {
  return http.post({url:'/company/create', params, load})
} 
/**修改企业信息（企业设置页编辑信息 */
export function companyUpdate(params?: object, load?: Boolean) {
  return http.post({url:'/company/update', params, load})
}

/**获取企业详情 */
export function companyView(params?: object, load?: Boolean) {
  return http.get({url:'/company/view', params, load})
}