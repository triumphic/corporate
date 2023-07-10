<template>
  <div class="container">
    <!-- 公司信息 -->
    <div class="company_view" v-loading="loading">
      <img src="@/assets/img/qiye.png" class="company_img" alt="">
      <div class="company_info">
        <div class="company_title">{{company_info.name}}</div>
        <div class="company_other">注册地址：{{ company_info.province_format }}{{ company_info.city_format }}{{ company_info.addr }}</div>
        <div class="company_other">公司介绍：{{ company_info.intro }}</div>
        <div class="company_other">联系方式：{{ company_info.contact_phone }}</div>
        <!-- <el-button type="primary" class="btn" plain>发消息</el-button> -->
      </div>
    </div>
    <div class="con_container">
      <div class="menu_view">
        <el-radio-group class="radioGroup" fill="#fff" text-color="#333" @change="gruopChange" v-model="menuType" size="large">
          <el-radio-button :label="item.id" v-for="item in menuList">
            <el-badge :value="messageStore().value" :hidden="item.id != 3 || messageStore().value <= 0 ? true : false">
              <span>{{ item.name }}</span>
            </el-badge>
          </el-radio-button>
        </el-radio-group>
      </div>
      <staff v-if="menuType == 2"></staff>
      <event v-if="menuType == 1"></event>
      <message v-if="menuType == 3"></message>
      <setup v-if="menuType == 4"></setup>
    </div>
  </div>
</template>
<script setup lang="ts">
import { companyView } from '@/api/index.ts'
import { ref,reactive,onBeforeMount } from 'vue'
import { getCookie } from '@/utils/cache/cookies.ts'
import staff from './components/staff.vue'
import event from './components/event.vue'
import message from './components/message.vue'
import setup from './components/setup.vue'
import { messageStore } from '@/stores/modules/app.ts'

let company_info:any = ref({})
const menuList:Array<any> = reactive([{id:1,name:'企业事件'},{id:2,name:'员工管理'},{id:3,name:'消息通知'},{id:4,name:'设置'}])
const menuType = ref(2)
const loading = ref(false)

onBeforeMount(()=>{
  loading.value = true
  companyView ({id:getCookie('company_info').id}).then((res:any)=>{
    loading.value = false
    company_info.value = res.data
  }).catch(()=>{
    loading.value = true
  })
})


const gruopChange = ()=>{
  // console.log(menuType.value)
}
</script>
<style scoped lang="scss">
  .container{
    width: 1100px;
    margin:auto
  }
  .con_container{
    background-color: #fff;
    margin-top: 10px;
    .menu_view{
      background: #f4f4f4;
      border: 1px solid #eee;
      :deep(.el-radio-button__inner){
        border: none;
        background-color: transparent;
        color:#333;
      }
    }
  }
  .company_view{
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 20px;
    .company_img{
      width: 120px;
      height: 120px;
      margin-right: 20px;
    }
    .company_info{
      flex: 1;
      position: relative;
      .btn{
        position: absolute;
        bottom: 0;
        right: 0;
      }
      .company_title{
        font-size: 16px;
        line-height: 30px;
        color: #444;
        font-weight: bold;
      }
      .company_other{
        font-size: 14px;
        line-height: 20px;
        color: #666;
        margin-top: 4px;
      }
    }
  }
</style>