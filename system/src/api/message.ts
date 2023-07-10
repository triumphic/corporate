import { http } from "@/utils/service"

/**未读消息数量 */
interface UnreadCount {
}
export function messageUnreadCount(params?: UnreadCount, load?: Boolean) {
  return http.get({url:'/api/message/unread-count', params, load})
}

/**消息列表 */
interface IndexParams {
  'page': number,
  'per-page': number
}
export function messageIndex(params?: IndexParams, load?: Boolean) {
  return http.get({url:'/api/message/index', params, load})
}

/**获取单个消息详情 */
interface ViewParams {
  'id': string
}
export function messageView(params?: ViewParams, load?: Boolean) {
  return http.get({url:'/api/message/view', params, load})
}

/**发送私信/回复消息 */
interface SendParams {
  'receiver': string,
  'content': string,
  'reply_id'?: string
}
export function messageSend(params?: SendParams, load?: Boolean) {
  return http.post({url:'/api/message/send', params, load})
}

/**同意查看事件申请 */
interface EventApplyAgree {
  'id': string,
}
export function messageEventApplyAgree(params?: EventApplyAgree, load?: Boolean) {
  return http.post({url:'/api/message/event-apply-agree', params, load})
}

/**拒绝查看事件申请 */
interface EventApplyEefuse {
  'id': string,
}
export function messageEventApplyEefuse(params?: EventApplyEefuse, load?: Boolean) {
  return http.post({url:'/api/message/event-apply-refuse', params, load})
}

/**拉黑企业 */
interface BlackParams {
  'message_id': string,
}
export function messageBlack(params?: BlackParams, load?: Boolean) {
  return http.post({url:'/api/message/black', params, load})
}

/**举报企业 */
interface ReportParams {
  'message_id'?: string,
  'company_id'?:string,
  'reason': string
}
export function messageReport(params?: ReportParams, load?: Boolean) {
  return http.post({url:'/api/message/report', params, load})
}
