<template>
  <div class="page">
    <div class="back pointer" style="display: inline-block;" @click="back"><el-icon><Back /></el-icon> 返回</div>
    <div class="container" v-if="detail.company">
      <h3 class="title">{{ detail.title }}</h3>
      <div class="company">
        <img src="@/assets/img/qiyerenzheng.png" v-if="detail.company && detail.company.status == 1" alt="" class="rz_img">
        <span class="company_name" @click="lookCompany(detail.company.id)">{{ detail.company && detail.company.name }}</span>
        <span class="rz_status" v-if="detail.company && detail.company.status == 1">已认证</span>
      </div>
      <div class="summary">{{ detail.summary }}</div>
      <div class="relateEmployee" v-if="detail.relateEmployee&&detail.relateEmployee.length>0">相关人员：<span v-for="(yg,yg_ind) in detail.relateEmployee">{{ yg.name }}<em v-if="detail.relateEmployee.length != (yg_ind+1)">、</em></span></div>
      <div class="content" v-html="detail.content"></div>
      <div class="fb_info">由{{ detail.company && detail.company.name }} 发布于 {{ detail.publish_at_format }}</div>
    </div>
  </div>
  <companyDialog v-if="companyDialogVisible" :visible="companyDialogVisible" :id="companyDialogId" @close="companyDialogVisible=false"></companyDialog>
</template>
<script setup lang="ts">
  import { eventView } from '@/api/event.ts'
  import companyDialog from '@/components/company.vue'

  import { ref, onBeforeMount } from 'vue'
  import { useRoute, useRouter } from 'vue-router';
  const route = useRoute()
  const router = useRouter()

const companyDialogId = ref('')
const companyDialogVisible = ref(false)
  let detail:any = ref({})
  onBeforeMount(()=>{
    eventView({id: route.params.id},true).then((res:any)=>{
      detail.value = res.data
      detail.value.publish_at_format = timestampToTime(res.data.publish_at)
    })
  })
  /**查看企业详情 */
const lookCompany = (id:string) => {
  companyDialogId.value = id;
  companyDialogVisible.value = true;
}
  /**返回上一页 */
  const back = () => {
    router.back()
  }
  /**将时间戳转为日期格式 */
  const timestampToTime = (timestamp:any): string => {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y:number = date.getFullYear();
    let M:number | string = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
    let D:string | number = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
    // let h:string = date.getHours() + ':';
    // let m:string = date.getMinutes() + ':';
    // let s:number = date.getSeconds();
    return `${Y}年${M}月${D}日`;
  }

</script>
<style lang="scss" scoped>
.back{
  font-size: 16px;
  line-height: 20px;
  color: #777;
  margin-bottom: 10px;
}
.page{
  width: 1100px;
  margin:auto;
}
.container{
  width: 100%;
  background-color: #fff;
  padding: 20px
}
.title{
  font-size: 18px;
  line-height: 26px;
  font-weight: bold;
  color: #333;
}
.company{
  display: flex;
  align-items: center;
  margin-top: 16px;
  .rz_img{
    width:16px;
    margin-right: 6px;
  }
  .rz_status{
    color:#666;
    font-size: 12px;
    margin-left: 4px;
  }
  .company_name{
    font-size: 14px;
    line-height: 20px;
    font-weight: bold;
    color:#333;
    cursor: pointer;
  }
}
.summary{
  font-size: 14px;
  line-height: 20px;
  color: #333;
  margin-top: 10px;
}
.relateEmployee{
  font-size: 13px;
  line-height: 16px;
  color: #777;
  margin-top: 6px;
}
.content{
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-top: 18px;
  padding: 20px 0;
}
.fb_info{
  font-size: 12px;
  line-height: 20px;
  color: #888;
  margin-top: 15px;
}
</style>