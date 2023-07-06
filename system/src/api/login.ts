import { http } from "@/utils/service"

/**用户登录 */
export function sendCaptcha(params?: object, load?: Boolean) {
  return http.post({url:'/user/send-captcha', params, load})
}

/**验证码 */
export function captchaLogin(params?: object, load?: Boolean) {
  return http.post({url:'/user/captcha-login', params, load})
}

/**获取当前用户信息 */
export function userView(params?: object, load?: Boolean) {
  return http.get({url:'/user/view', params, load})
}