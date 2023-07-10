import { http } from "@/utils/service"

/**获取员工列表 */
interface IndexParams {
  'page': number,
  'per-page': number
}
export function employeeIndex(params?: IndexParams, load?: Boolean) {
  return http.get({url:'/api/employee/index', params, load})
}

/**获取单个员工详情 */
interface ViewParams {
  'id': string
}
export function employeeView(params: ViewParams, load?: Boolean) {
  return http.get({url:'/api/employee/view', params, load})
}

/**添加员工 */
interface CreateParams {
  'name': string,
  'id_card'?: string,
  'entry_date'?: string,
  'leave_date'?: string,
  'position'?: string,
  'type'?: string,
  'intro'?: string
}
export function employeeCreate(params: CreateParams, load?: Boolean) {
  return http.post({url:'/api/employee/create', params, load})
}

/**编辑员工 */
interface UpdateParams {
  'id': string,
  'name': string,
  'id_card'?: string,
  'entry_date'?: string,
  'leave_date'?: string,
  'position'?: string,
  'type'?: string,
  'intro'?: string
}
export function employeeUpdate(params: UpdateParams, load?: Boolean) {
  return http.post({url:'/api/employee/update', params, load})
}

/**员工隐藏/显示状态切换 */
interface HideParams {
  'id': string
}
export function employeeHide(params: HideParams, load?: Boolean) {
  return http.post({url:'/api/employee/hide', params, load})
}

/**删除员工 */
interface DeleteParams {
  'id': string
}
export function employeeDelete(params: DeleteParams, load?: Boolean) {
  return http.post({url:'/api/employee/delete', params, load})
}

/**员工选择下拉搜索列表（事件表单选择关联员工时用） */
interface SelectParams {
  'q': string
}
export function employeeSelect(params?: SelectParams, load?: Boolean) {
  return http.post({url:'/api/select/employee', params, load})
}