<template>
  <div class="container">
    <div class="title">企业信鸽网</div>
    <div class="flex-center search_view">
      <el-input class="input_search" size="large" v-model="keyword" placeholder="搜索姓名或身份等信息"></el-input>
      <el-button type="primary" size="large" @click="search">搜索</el-button>
    </div>
   
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from "element-plus"
import { ref } from 'vue'
import { useRouter } from "vue-router"
import { getCookie,setCookie } from '@/utils/cache/cookies.ts'
import { companyView } from '@/api/index.ts'

const router = useRouter()
const keyword = ref('')
const search = () => {
  if (!getCookie('is_login')){
    router.push('/login')
    return
  }
  if (!getCookie('company_info') || !getCookie('company_info').id) { //企业不存在
    router.push('/perfect_company')
    return
  }
  if (keyword.value == '') {
      ElMessage.warning('请输入搜索词')
      return
    }
  if ( getCookie('company_info').status != 2 ) {
    companyView({id: getCookie('company_info').id},true).then((res:any)=>{
      setCookie('company_info', res.data)
      if(res.data.status == 2) {
        router.push('/search/'+keyword.value)
        keyword.value = ''
      } else {
        ElMessage.warning('未完成企业认证，无法使用搜索功能')
      }
    })
  } else {
    router.push('/search/'+keyword.value)
    keyword.value = ''
  }
}
</script>
<style scoped lang="scss">
.container{
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title{
    color: #3D6EDF;
    font-size: 50px;
    line-height: 80px;
    letter-spacing: 0.1em;
    margin-top: 25vh;
  }
}
.input_search{
  width: 350px;
}
.search_view{
  margin-top: 40px;
}
</style>