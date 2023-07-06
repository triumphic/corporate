<template>
  <div class="head_view flex_center_end" v-if="!is_login">
    <div class="btn_login" @click="eventLogin()">登录</div>
    <div class="btn_login" @click="eventLogin('register')">注册</div>
  </div>
  <div class="head_view flex_center_between" v-else>
    <div class="logo_view flex">
      <div class="logo_name">信鸽网</div>
      <p>查询公司企业员工相关记录</p>
    </div>
    <div class="flex search_view">
      <el-input class="input_search" v-model="keyword" placeholder="搜索姓名或身份等信息"></el-input>
      <el-button type="primary">搜索</el-button>
    </div>
    <div class="login_info flex">
      <el-badge :value="12">
        <el-icon><Bell /></el-icon>
      </el-badge>
      <div class="user-wrap">
          <span class="userName">{{ infoStore().value.phone }}</span>
          <el-icon class="login-el-icon-arrow-right"><ArrowRight /></el-icon>
          <div class="userInfo" style="z-index: 3">
            <div class="logoutBox flex" @click="getOut">
              <el-icon style="margin-right:4px;font-size:20px;"><SwitchButton /></el-icon> 退出登录 
            </div>
          </div>
        </div>
    </div>
  </div>
  <div class="main_container" :style="`background-color:${bgColor}`">
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router';
  import { getCookie, delAllCookie } from '@/utils/cache/cookies.ts'
  import { watch, ref, onBeforeMount } from 'vue'
  import { infoStore } from '@/stores/modules/app.ts'
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
    if (!Boolean(getCookie('isLogin'))) {
      router.push({ path: '/login' })
    } else {
      router.push({ path: '/login' })
      delAllCookie()
      localStorage.clear()
      sessionStorage.clear();
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
    background: #f5f6f8;
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