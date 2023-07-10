import { http } from "@/utils/service"

/**搜索 */
interface SearchParams {
  'keyword': any,
  'page': number,
  'per-page': number
}
export function searchHttp(params?: SearchParams, load?: Boolean) {
  return http.get({url:'/api/search/search', params, load})
}

/**请求查看事件 */
interface ApplyParams {
  'id': string,
}
export function searchApply(params?: ApplyParams, load?: Boolean) {
  return http.post({url:'/api/search/apply', params, load})
}