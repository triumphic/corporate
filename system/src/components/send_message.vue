<template>
<el-dialog
  v-model="props.visible"
  :title="title"
  width="700px"
  :before-close="handleClose"
>
  <el-input
    v-model="textarea"
    :rows="6"
    type="textarea"
    placeholder="请输入内容"
  />
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="sendEvent">发送</el-button>
    </span>
  </template>
</el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { messageSend } from '@/api/message.ts'
import { ElMessage } from "element-plus"
const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  receiver: {
    type: String,
    default: ''
  },
  title:{
    type: String,
    default: '发消息'
  },
  reply_id: {
    type: String,
    default: ''
  }
})
const emits = defineEmits<{
  (event: 'close', value?: any): void
}>()

const textarea = ref('')

const handleClose = () => {
  textarea.value = ''
  emits('close')
}
/**发送消息 */
const sendEvent = () => {
  if (textarea.value == '') {
    ElMessage.warning('请输入消息内容')
    return
  }
  messageSend({receiver: props.receiver,content: textarea.value, reply_id: props.reply_id}).then(()=>{
    ElMessage.success('发送成功')
    emits('close','true')
    textarea.value = ''
  })
}
</script>