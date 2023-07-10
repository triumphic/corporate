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
        <el-button type="primary" @click="sendEvent">提交</el-button>
      </span>
    </template>
  </el-dialog>
  </template>
  <script setup lang="ts">
  import { ref } from 'vue'
  import { messageReport } from '@/api/message.ts'
  import { ElMessage } from "element-plus"
  const props = defineProps({
    visible: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: ''
    },
    title:{
      type: String,
      default: '发消息'
    },
    company_id: {
      type: String,
      default: ''
    }
  })
  const emits = defineEmits<{
    (event: 'close', value?: any): void
  }>()
  
  const textarea = ref('')
  
  const handleClose = () => {
    emits('close')
    textarea.value = ''
  }
  /**发送消息 */
  const sendEvent = () => {
    if (textarea.value == '') {
      ElMessage.warning('请输入消息内容')
      return
    }
    messageReport({message_id: props.id,reason: textarea.value, company_id: props.company_id}).then(()=>{
      ElMessage.success('举报成功')
      emits('close','true')
      textarea.value = ''
    })
  }
  </script>