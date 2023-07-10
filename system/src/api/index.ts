import { http } from "@/utils/service"

/**获取省市结构 */
export function eventUserView(params?: object, load?: Boolean) {
  return http.get({url:'/api/user/view', params, load})
}

/**获取省市结构 */
export function uploadImgEvent(params?: object, load?: Boolean) {
  return http.post({url:'/api/api/upload-img', params, load})
}

/**获取省市结构 */
export function getCityEnvent(params?: object, load?: Boolean) {
  return http.get({url:'/api/api/city', params, load})
}

/**完善企业信息 */
export function companyCreate(params?: object, load?: Boolean) {
  return http.post({url:'/api/company/create', params, load})
} 
/**修改企业信息（企业设置页编辑信息 */
export function companyUpdate(params?: object, load?: Boolean) {
  return http.post({url:'/api/company/update', params, load})
}

/**获取企业详情 */
export function companyView(params?: object, load?: Boolean) {
  return http.get({url:'/api/company/view', params, load})
}

/** 网站法律声明 */
export function siteLegalNotice(params?: object, load?: Boolean) {
  return http.get({url:'/api/site/legal-notice', params, load})
}

/**用户协议 */
export function siteAgreement(params?: object, load?: Boolean) {
  return http.get({url:'/api/site/agreement', params, load})
}

/**保密承诺函 */
export function sitePromise(params?: object, load?: Boolean) {
  return http.get({url:'/api/site/promise', params, load})
}
