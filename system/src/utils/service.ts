import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"
// import { useUserStoreHook } from "@/store/modules/user"
import { ElMessage, ElLoading } from "element-plus"
import { get } from "lodash-es"
import { getCookie, delAllCookie } from '@/utils/cache/cookies.ts'
// import { getSession, getLocal } from '@/utils/cache/storage.ts'
// import router from "@/router/index"
/** 创建请求实例 */
function createService() {
  // 创建一个 Axios 实例
  const service = axios.create()
  // 请求拦截
  service.interceptors.request.use(
    (config) => {
      config.headers['Access-Token'] = getCookie('access_token')

      let params = {
      }
      if (config.method == "post") {
        config.data = Object.assign(params, (config.data ? config.data : {}))
      } else {
        config.params = Object.assign(params, (config.params ? config.params : {}))
      }
      return config;
    },
    // 发送失败
    (error) => Promise.reject(error)
  )
  // 响应拦截（可根据具体业务作出相应的调整）
  service.interceptors.response.use(
    (response) => {
      // apiData 是 API 返回的数据
      const apiData = response.data as any
      // 这个 Code 是和后端约定的业务 status
      let code = apiData.status
      if (apiData.success) { //通过success判断请求是否成功
        code = '0'
      }
      // 如果没有 Code, 代表这不是项目后端开发的 API
      if (code === undefined) {
        ElMessage.error("非本系统的接口")
        return Promise.reject(new Error("非本系统的接口"))
      } else {
        switch (code) {
          case '0':
            return apiData
          // case '4002':
          //   //登录超时或者多台设备登录
          //   delAllCookie();//清除所以的cookie
          //   localStorage.clear();
          //   sessionStorage.clear()
          //   router.push("/login");
          //   return;
          default:
            if ( typeof apiData.errors == 'string') {
              ElMessage.error(apiData.errors || "Error")
            }
            return Promise.reject(apiData || "Error")
        }
      }
    },
    (error) => {
      // Status 是 HTTP 状态码
      const status = get(error, "response.status")
      switch (status) {
        case 400:
          error.message = "请求错误"
          break
        case 401:
          // Token 过期时，直接退出登录并强制刷新页面（会重定向到登录页）
          // useUserStoreHook().logout()
          location.reload()
          break
        case 403:
          error.message = "拒绝访问"
          break
        case 404:
          error.message = "请求地址出错"
          break
        case 408:
          error.message = "请求超时"
          break
        case 500:
          error.message = "服务器内部错误"
          break
        case 501:
          error.message = "服务未实现"
          break
        case 502:
          error.message = "网关错误"
          break
        case 503:
          error.message = "服务不可用"
          break
        case 504:
          error.message = "网关超时"
          break
        case 505:
          error.message = "HTTP 版本不受支持"
          break
        default:
          break
      }
      ElMessage.error(error.message)
      return Promise.reject(error)
    }
  )
  return service
}

/** 创建请求方法 */
function createRequestFunction(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const configDefault = {
      headers: {
        // Access-Token: 7d43b6s0g6440x_dbdPac163uARX68tp
        // 携带 Token
        // Authorization: "Bearer " + getToken(),
        "Content-Type": get(config, "headers.Content-Type", "application/json")
      },
      timeout: 5000,
      baseURL: import.meta.env.VITE_BASE_API,
      data: {}
    }
    return service(Object.assign(configDefault, config))
  }
}

/** 用于网络请求的实例 */
export const service = createService()
/** 用于网络请求的方法 */
export const request = createRequestFunction(service)

/**判断当前开发环境 */
let BASEURL = '';
if (process.env.NODE_ENV === "development") { // 开发环境
  BASEURL = import.meta.env.VITE_BASE_API
}else { // 生产环境
  BASEURL = '';
}

let loadingConfig = {
  lock: true,
  text: '加载中...',
  background: 'rgba(255, 255, 255, 0.7)'
}
interface customServe {
  url: string, 
  params?: any, 
  load?: Boolean
}
/**服务调用 get post */
export const http = {
  get: <T = any>({url, params, load}:customServe) => {
    return new Promise((resolve, reject) => {
      let loading = load && ElLoading.service(loadingConfig)
      service.get<T>(`${BASEURL}${url}`,{
            params: params,
        }).then(res=>{
          load && loading?.close()
          resolve(res as any)
        }).catch(error=>{
          load && loading?.close()
          reject(error as any)
        })
    })
  },
  post: <T = any>({url, params, load}:customServe) => {
    return new Promise((resolve, reject) => {
      let loading = load && ElLoading.service(loadingConfig)
      service.post<T>(`${BASEURL}${url}`, params, {
            transformRequest: [(params) => {
                return JSON.stringify(params)
            }],
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
          load && loading?.close()
          resolve(res as any)
        }).catch((error) => {
          load && loading?.close()
          reject(error)
        })
    })
  }
}
