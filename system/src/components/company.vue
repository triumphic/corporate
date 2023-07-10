<template>
<el-dialog
  v-model="props.visible"
  title=""
  width="700px"
  :before-close="handleClose"
>
  <div class="company_con">
    <img src="@/assets/img/qiye.png" class="company_img" alt="">
    <div class="info">
      <div class="company_name">
        <span>{{ company && company.name }}</span>
        <img src="@/assets/img/qiyerenzheng.png" alt="" v-if="company && company.status == 1" class="rz_img">
      </div>
      <div class="intro">{{ company.intro }}</div>
    </div>
  </div>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="reportEvent">举报</el-button>
      <el-button type="primary" @click="sendEvent">发消息</el-button>
    </span>
  </template>
</el-dialog>
<!-- 发消息 -->
<send_message :visible="sendVisible" :receiver="props.id" :title="`发消息（${company && company.name}）`" @close="(val?:string)=>closeMessage(val)"></send_message>
<!-- 举报 -->
<report :visible="reportVisible" :id="props.id" :title="`举报（${company && company.name}）`" @close="(val:string)=>closeMessage(val)"></report>
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { companyView } from '@/api/index.ts'
import send_message from './send_message.vue'
import report from '@/components/report.vue'
const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  id: {
    type: String,
    default: ''
  }
})
const emits = defineEmits<{
  (event: 'close', value?: any): void
}>()
const company:any = ref({})
const sendVisible = ref(false)
const reportVisible = ref(false)
onBeforeMount(()=>{
  companyView({id: props.id},true).then((res:any)=>{
    company.value = res.data
  })
})
const handleClose = () => {
  emits('close')
}
/**点击发消息 */
const sendEvent = () => {
  sendVisible.value = true
}
const closeMessage = (val?:string) => {
  sendVisible.value=false
  reportVisible.value =false
  if(val == 'true'){//说明发送消息成功，同时关闭企业弹框
    emits('close')
  }
}
/**点击举报 */
const reportEvent = () => {
  reportVisible.value = true
}
</script>
<style scoped lang="scss">
.company_con{
  display: flex;
  align-items: center;
  .company_img{
    width: 70px;
    height: 70px;
    border-radius: 4px;
    margin-right:10px;
  }
  .info{
    .company_name{
      color: #333;
      font-size: 16px;
      line-height: 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      .rz_img{
        width: 16px;
        height: 16px;
        margin-left: 4px;
      }
    }
    .intro{
      font-size: 14px;
      line-height: 20px;
      margin-top: 10px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>