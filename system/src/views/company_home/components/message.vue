<template>
  <div class="container" v-loading="loading">
    <el-empty v-if="tableData.length<=0" :image-size="100" description='暂无消息'></el-empty>
    <template v-else>
      <div class="message_item" v-for="item in tableData">
        <div class="message_item_info">
          <img src="@/assets/img/v2_qm6l4n.png" v-if="item.type == 1" class="company_img" alt="">
          <img src="@/assets/img/qiye.png" v-else class="company_img" alt="">
          <div class="info">
            <div class="company" :style="item.type == 1 ? 'color:#333;cursor: auto;':''" @click="item.type != 1 && item.sender_company ? lookCompany(item.sender_company.id) : ''">{{item.type == 1 ? item.type_format : item.sender_company && item.sender_company.name}}
              <span v-if="item.is_read==0" class="draft">未读</span>
            </div>
            <div class="message" v-if="item.type != 3">{{ item.content }}</div>
            <div class="message" v-else>申请查看 <span @click="onClickDetail(item.event.id)">{{item.event && item.event.title}}</span> 的这篇文章</div>
          </div>
        </div>
        <div class="message_other_info">
          <div class="time">{{item.created_at}}</div>
          <div class="flex">
            <template v-if="item.status == 0">
              <span class="btn" v-if="item.type == 2" @click="messageBlackEvent(item)">拉黑</span>
              <span class="btn" v-if="item.type == 1 || item.type == 2" @click="messageReport(item)">举报</span>
              <span class="btn" v-if="item.type == 3" @click="messageEventApplyAgreeEvent(1, item)">同意</span>
              <span class="btn" v-if="item.type == 3" @click="messageEventApplyAgreeEvent(2, item)">拒绝</span>
              <span class="btn" @click="replyInfo(item)">回复</span>
            </template>
            <span class="btn pointer_drop" style="color:#888;" v-else>{{ item.status==2?'已回复':item.status == 3 ? '已举报': item.status == 4 ? '已拉黑': item.status == 5 ? '已拒绝' : item.status == 6 ? '已同意' : ''}}</span>
          </div>
        </div>
      </div>
      <div class="pagination" v-show="Number(pagination.pages) > 1">
        <el-pagination background :small="true" :current-page="pagination.page" @current-change="handleCurrentChange" layout="prev, pager, next" :page-count='Number(pagination.pages)'>
        </el-pagination>
      </div>
    </template>
  </div>
  <!-- 企业弹框 -->
  <companyDialog v-if="companyDialogVisible" :visible="companyDialogVisible" :id="companyDialogId" @close="companyDialogVisible=false"></companyDialog>
  <!-- 回复消息 -->
  <send_message :visible="sender_info.sendVisible" :reply_id="sender_info.reply_id" :receiver="sender_info.receiver" :title="`回复消息（${sender_info.title}）`" @close="(val:string)=>closeMessage(val)"></send_message>
  <!-- 举报 -->
  <report :visible="report_info.visible" :id="report_info.id" :title="`举报（${report_info.title}）`" @close="(val:string)=>closeMessage(val)"></report>
</template>
<script setup lang="ts">
import { messageIndex, messageBlack, messageEventApplyAgree, messageEventApplyEefuse } from '@/api/message.ts'
import { ref,reactive, onBeforeMount } from 'vue'
import companyDialog from '@/components/company.vue'
import send_message from '@/components/send_message.vue'
import report from '@/components/report.vue'
import { useRouter } from 'vue-router'
import { ElMessage,ElMessageBox } from "element-plus"
import { messageUnreadCount } from '@/api/message.ts'
import { messageStore } from '@/stores/modules/app.ts'

const router = useRouter()
let pagination = reactive({
  page: 1,
  pages: 0,
  page_size: 20,
  total: 0,
})
let sender_info = reactive({
  sendVisible: false,
  receiver: '',
  reply_id: '',
  title: ''
})
let report_info = reactive({
  visible: false,
  id: '',
  title: ''
})
const loading = ref(false)
const companyDialogVisible = ref(false)
const companyDialogId = ref('')
let tableData = reactive([] as any[])
onBeforeMount(()=>{
  init(1)
})
const init = (page:number) => {
  pagination.page = page
  loading.value = true
  messageIndex({'page': pagination.page, 'per-page': pagination.page_size}).then((res:any)=>{
    tableData = res.data.list
    pagination.total = res.data._meta.totalCount;
    pagination.pages = res.data._meta.pageCount;
    loading.value = false
    messageUnreadCount().then((res:any)=>{
      messageStore().setInfo(res.data)
    })
  }).catch(()=>{
    loading.value = false
  })
}
const handleCurrentChange = (val:number) => {
  init(val)
}
/**查看企业详情 */
const lookCompany = (id:string) => {
  companyDialogId.value = id;
  companyDialogVisible.value = true;
}
/**去事件详情 */
const onClickDetail = (id:string) => {
  router.push({path: `/event_detail/${id}`})
}
/**回复消息 */
const replyInfo = (info:any) => {
  if ( info.type == '1' ){
    sender_info.receiver = '';
  } else {
    sender_info.receiver = info.sender_company.id;
  }
  sender_info.reply_id = info.id;
  sender_info.title = info.type == 1 ? info.type_format : info.sender_company && info.sender_company.name
  sender_info.sendVisible = true;
}
const closeMessage = (val?:string) => {
  sender_info.sendVisible=false
  report_info.visible=false
  val == 'true' && init(pagination.page)
}
/**拉黑企业 */
const messageBlackEvent = (info:any) => {
  ElMessageBox.confirm(`确定要拉黑该消息?`,'提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    messageBlack({message_id: info.id},true).then(()=>{
      ElMessage.success('拉黑成功！')
      init(pagination.page)
    })
  }).catch(()=>{})
 
}
/**同意/拒绝查看事件申请 1 同意 2 拒绝 */
const messageEventApplyAgreeEvent = (type: number, info:any) => {
  ElMessageBox.confirm(`确定要${type == 1 ? '同意' : '拒绝'}查看事件申请?`,'提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    if (type == 1) {
      messageEventApplyAgree({id:info.id}).then(()=>{
        init(pagination.page)
      })
    }
    if (type == 2) {
      messageEventApplyEefuse({id:info.id}).then(()=>{
        init(pagination.page)
      })
    }
  }).catch(()=>{})
}
/**举报 */
const messageReport = (info:any) => {
  report_info.visible = true;
  report_info.id = info.id
  report_info.title = info.type == 1 ? info.type_format : info.sender_company && info.sender_company.name
}

</script>
<style lang="scss" scoped>
.container{
  background: #fff;
  padding-top: 10px;
}
.message_item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f4f4f4;
  margin: 0 20px;
  padding: 10px 0;
  .message_item_info{
    flex: 1;
    display: flex;
    align-items: center;
    .company_img{
      width: 40px;
      height: 40px;
      border-radius: 4px;
      margin-right: 10px;
    }
    .info{
      margin-right: 20px;
      .company{
        color: #3D6EDF;
        font-size: 14px;
        line-height: 20px;
        cursor: pointer;        
      }
      .message{
        font-size: 13px;
        line-height: 20px;
        color: #666;
        margin-top: 2px;
        span{
          color: #3D6EDF;
          cursor: pointer;
        }
      }
    }
    
  }
  .message_other_info{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
      .time{
        font-size: 13px;
        color: #666;
        margin-bottom: 10px;
      }
      .btn{
        color: #3D6EDF;
        cursor: pointer;
        font-size: 14px;
        margin: 0 4px;
      }
    }
}
.draft{
    display: inline-block;
    background: #c69e25;
    color: #fff;
    font-size: 12px;
    padding:0 2px;
    border-radius: 3px;
    margin-left: 3px;
    transform: scale(0.9);
  }
</style>