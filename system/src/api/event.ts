import { http } from "@/utils/service"

/**获取事件列表 */
interface IndexParams {
  'page': number,
  'per-page': number
}
export function eventIndex(params?: IndexParams, load?: Boolean) {
  return http.get({url:'/api/event/index', params, load})
}

/**获取单个事件详情 */
interface ViewParams {
  'id': any,
}
export function eventView(params?: ViewParams, load?: Boolean) {
  return http.get({url:'/api/event/view', params, load})
}

/**添加事件 */
interface CreateParams {
  'title': string,
  'summary'?: string,
  'content'?: string,
  'is_private'?: number,
  'auto_agree'?: number,
  'biz_status'?: number,
  'relate_employee'?:any[]
}
export function eventCreate(params?: CreateParams, load?: Boolean) {
  return http.post({url:'/api/event/create', params, load})
}

/**编辑事件 */
interface UpdateParams {
  'id': string,
  'title': string,
  'summary'?: string,
  'content'?: string,
  'is_private'?: number,
  'auto_agree'?: number,
  'biz_status'?: number,
  'relate_employee'?:any[]
}
export function eventUpdate(params?: UpdateParams, load?: Boolean) {
  return http.post({url:'/api/event/update', params, load})
}

/**事件隐藏/显示状态切换 */
interface HideParams {
  'id': string,
}
export function eventHide(params?: HideParams, load?: Boolean) {
  return http.post({url:'/api/event/hide', params, load})
}

/**删除事件 */
interface DeleteParams {
  'id': string,
}
export function eventDelete(params?: DeleteParams, load?: Boolean) {
  return http.post({url:'/api/event/delete', params, load})
}