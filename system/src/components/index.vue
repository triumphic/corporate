<template>
  <div class="head_view flex_center_end" v-if="!is_login">
    <div class="btn_login" @click="eventLogin()">登录</div>
    <div class="btn_login" @click="eventLogin('register')">注册</div>
  </div>
  <div class="head_view flex_center_between" v-else>
    <div class="logo_view flex">
      <div class="logo_name pointer" @click="goHome">信鸽网</div>
      <p>查询公司企业员工相关记录</p>
    </div> 
    <div class="flex search_view" v-if="getCookie('company_info') && getCookie('company_info').id">
      <el-input class="input_search" v-model="keyword" clearable placeholder="搜索姓名或身份等信息"></el-input>
      <el-button type="primary" @click="searchEvent">搜索</el-button>
    </div>
    <div class="login_info flex">
      <el-badge :value="messageStore().value" v-if="messageStore().value > 0">
        <el-icon ><Bell /></el-icon>
      </el-badge>
      <div class="user-wrap">
          <span class="userName">{{ infoStore().value.phone }}</span>
          <el-icon class="login-el-icon-arrow-right"><ArrowRight /></el-icon>
          <div class="userInfo" style="z-index: 3">
            <div class="logoutBox flex" @click="goMainHome">
              <el-icon style="margin-right:4px;font-size:20px;"><User /></el-icon> 我的主页
            </div>
            <div class="logoutBox flex" @click="getOut">
              <el-icon style="margin-right:4px;font-size:20px;"><SwitchButton /></el-icon> 退出登录
            </div>
          </div>
        </div>
    </div>
  </div>
  <div class="main_container" :style="`background-color:${bgColor}`">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router';
  import { getCookie,setCookie, delAllCookie } from '@/utils/cache/cookies.ts'
  import { watch, ref,inject, onBeforeMount } from 'vue'
  import { infoStore } from '@/stores/modules/app.ts'
  import { companyView } from '@/api/index.ts'
  import { ElMessage } from "element-plus"
  import { messageStore } from '@/stores/modules/app.ts'

  const Reload = inject('load',Function,true)
  const router = useRouter()
  const route = useRoute()
  
  const bgColor = ref('')
  const is_login = ref(false)
  const keyword = ref('')

  onBeforeMount(()=>{
    if ( getCookie('is_login') ) {
      is_login.value = true;
      if (!infoStore().value.phone) {
        infoStore().setInfo(getCookie('login_info'))
      }
    }
    bgColor.value = route.meta?.bgColor ? String(route.meta.bgColor) : '#f5f6f8'
  })
  watch(
    () => router.currentRoute.value,
    () => {
      bgColor.value = route.meta?.bgColor ? String(route.meta.bgColor) : '#f5f6f8'
    }
  )

  const eventLogin = (type?:string) => {
    router.push({
      path: '/login',
      query:{
        id: type
      }
    })
  }
  /**退出登录*/
  const getOut = () => {
    delAllCookie()
    localStorage.clear()
    sessionStorage.clear();
    router.push({ path: '/login' })
  }
  /**点击搜索 */
  const searchEvent = () => {
    if (keyword.value == '') {
      ElMessage.warning('请输入搜索词')
      return
    }
    if ( getCookie('company_info').status != 2 ) {
      companyView({id: getCookie('company_info').id},true).then((res:any)=>{
        setCookie('company_info', res.data)
        if(res.data.status == 2) {
          router.push('/search/'+keyword.value).then(()=>{
            Reload()
          })
          Reload()
          keyword.value = ''
        } else {
          ElMessage.warning('未完成企业认证，无法使用搜索功能')
        }
      })
    } else {
      router.push('/search/'+keyword.value).then(()=>{
        Reload()
      })
      keyword.value = ''
    }
  }
  const goHome = () => {
    if (!getCookie('company_info') || !getCookie('company_info').id) {
      router.replace('/')
    } else {
      router.replace('/company_home')
    }
  }
  /**去我的主页 */
  const goMainHome = () => {
    if (!getCookie('company_info') || !getCookie('company_info').id) {
      if (route.path == '/perfect_company') {
        ElMessage.warning('请先完成企业注册')
        return
      }else {
        router.push('/perfect_company')
      }
    } else {
      if (route.path == '/company_home') {
        ElMessage.warning('你已经在我的主页了')
        return
      }else{
        router.push('/company_home')
      }
    }
  }
</script>
<style scoped lang="scss">
.main_container{
  background-color: #f5f6f8;
  height: calc(100vh - 61px);
  padding-top: 10px;
  overflow-y: auto;
}
.head_view{
  width:100vw;
  height: 60px;
  border-bottom: 1px solid #ccc;
  padding: 0 60px;
}
.btn_login{
  margin-left: 20px;
  font-size: 16px;
  line-height: 30px;
  cursor: pointer;
  color: #3D6EDF;
}
.logo_view{
  .logo_name{
    color: #3D6EDF;
    font-size: 30px;
    line-height: 40px;
    font-weight: bold;
    margin-right: 18px;
  }
  p{
    font-size: 14px;
    color: #888;
  }
}
.input_search{
  width: 300px;
  text-align: center;
  margin-right: 10px;
  :deep(.el-input__wrapper){
    background: #f9f9f9;
  }
}
.user-wrap {
  display: flex;
  align-items: center;
  height: 100%;
  height: 60px;
  margin-left: 50px;
  font-size: 16px;
  .login-el-icon-arrow-right{
    margin-left: 4px;
  }
  &:hover {
    .userInfo {
      display: block;
    }

    #login-el-icon-arrow-down {
      display: block;
    }

    .login-el-icon-arrow-right {
      transform: rotate(90deg);
    }
  }
}
.userInfo {
    display: none;
    width: 166px;
    position: absolute;
    top: 50px;
    right: 40px;
    padding: 0 20px;
    text-align: left;
    background: #fff;
    border: 1px solid #ededed;
    box-shadow: 0 2px 4px hsla(0, 0%, 93%, 0.5);
    &:hover {
      display: block;
    }

    .logoutBox {
      color: #333;
      width: 100%;
      font-size: 15px;
      padding: 23px 0 10px 0;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      margin: auto;
      margin-right: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 18px 0 18px 15px;
      // border-top: 1px solid #eee;
      padding-top: 10px;
      margin-top: 10px;
    }

    .smaIcon {
      width: 18px;
      margin-right: 2px;
    }
  }
</style>