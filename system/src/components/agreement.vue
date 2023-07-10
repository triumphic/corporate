<template>
<el-dialog
  v-model="props.visible"
  :title="title"
  center
  width="700px"
  :before-close="handleClose()"
>
  <div class="con" style="white-space: pre-wrap;">{{ content }}</div>
  <template #footer>
    <span class="dialog-footer">
      <el-button type="primary" v-if="props.type !='promise'" @click="handleClose()">我已知晓</el-button>
      <template v-else>
        <el-button @click="handleClose('no')">不接受</el-button>
        <el-button type="primary" @click="handleClose('yes')">接受</el-button>
      </template>
    </span>
  </template>
</el-dialog>
</template>
<script setup lang="ts">
  import { siteAgreement, sitePromise, siteLegalNotice } from '@/api/index.ts'
  import { ref, onBeforeMount } from 'vue'
  const props = defineProps({
    visible: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: ''
    }
  })
  const emits = defineEmits<{
    (event: 'close', value?: any): void
  }>()

  const content = ref('')
  const title = ref('')
  onBeforeMount(()=>{
    if (props.type == 'agreement') {
      siteAgreement().then((res:any)=>{
        content.value = res.data.text
        title.value = '用户服务协议'
      })
    }
    if (props.type == 'promise') {
      sitePromise().then((res:any)=>{
        content.value = res.data.text
        title.value = '保密承诺函'
      })
    }
    if (props.type == 'legalNotice') {
      siteLegalNotice().then((res:any)=>{
        content.value = res.data.text
        title.value = '网站法律声明'
      })
    }
  })
  const handleClose = (val?:string):any => {
    emits('close',val)
  }
</script>
<style scoped lang="scss">
  .con{
    font-size: 16px;
    line-height: 26px;
    color: #666;
}
</style>