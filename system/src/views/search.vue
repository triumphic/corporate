<template>
<div class="page">
    <div class="back pointer" style="display: inline-block;" @click="back"><el-icon><Back /></el-icon> 去企业首页</div>
    <div class="container">
      <div class="search_head">根据关键词“{{keyword}}”查询到相关结果 {{pagination.total}}条</div>
      <el-empty v-if="searchList.length<=0" :image-size="100" description='暂无搜索结果'></el-empty>
      <template v-for="item in searchList">
        <div class="search_item flex_center_between" v-if="item.is_private == 1 && item.can_visit">
          <div v-if="item.company">
            <div class="main_comany">{{ item.company.name }}</div>
            <div class="related">相关员工：<span v-for="(yg,yg_ind) in item.relateEmployee">{{ yg.name }}<em v-if="item.relateEmployee.length != (yg_ind+1)">，</em></span></div>
          </div>
          <el-button plain @click="applyEvent(item)">请求查看</el-button>
        </div>
        <div class="search_item" v-else>
          <div class="pointer" @click="onClickDetail(item.id)">
            <div class="title">{{item.title}}</div>
            <div class="content">{{item.summary}}</div>
            <div class="related">相关员工：<span v-for="(yg,yg_ind) in item.relateEmployee">{{ yg.name }}<em v-if="item.relateEmployee.length != (yg_ind+1)">，</em></span></div>
          </div>
          <div class="other" v-if="item.company"><span class="comany" @click="lookCompany(item.company.id)">{{item.company.name}}</span> 发布于 {{ timestampToTime(item.publish_at) }}</div>
        </div>
      </template>
      <div class="pagination" v-show="Number(pagination.pages) > 1">
        <el-pagination background :small="true" :current-page="pagination.page" @current-change="handleCurrentChange" layout="prev, pager, next" :page-count='Number(pagination.pages)'>
        </el-pagination>
      </div>
    </div>
   
</div>
<!-- 企业弹框 -->
<companyDialog v-if="companyDialogVisible" :visible="companyDialogVisible" :id="companyDialogId" @close="companyDialogVisible=false"></companyDialog>
<!-- 协议弹窗 -->
<agreement v-if="agree_info.visible" :visible="agree_info.visible" :type="agree_info.type" @close="(val?:string)=>agreementClose(val)"></agreement>
</template>
<script setup lang="ts">
import { searchHttp, searchApply } from '@/api/search.ts'
import agreement from '@/components/agreement.vue';
import companyDialog from '@/components/company.vue'
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive, onBeforeMount } from 'vue'
import { setCookie,getCookie } from '@/utils/cache/cookies';
const router = useRouter()
const route = useRoute()
const searchList = ref([] as any[])
const companyDialogVisible = ref(false)
const agree_info = ref({visible:false,type: ''})
const companyDialogId = ref('')
const keyword:any = ref('')
const event_id = ref('')
let pagination = reactive({
  page: 1,
  pages: 0,
  page_size: 20,
  total: 0,
})
onBeforeMount(()=>{
  keyword.value = route.params.key ? route.params.key : '';
  init(1)
})


const init = (page:number) =>{
  pagination.page = page
  searchHttp({'page': pagination.page, 'per-page': pagination.page_size, keyword: keyword.value}).then((res:any)=>{
    searchList.value = res.data.list
    pagination.total = res.data._meta.totalCount;
    pagination.pages = res.data._meta.pageCount;
  })
}

const back = () => {
  router.replace({path:'/company_home'})
}
const handleCurrentChange = (val:number) => {
  init(val)
}
/**保密协议回调 */
const agreementClose = (val?:string) => {
  agree_info.value.visible=false
  if(val == 'yes') {//接受
    setCookie('can_visit_agreement','1')
    searchApplyEvent()
  }
}
/**点击请求查看事件 */
const applyEvent = (info:any) => {
  event_id.value= info.id
  if (getCookie('can_visit_agreement') == '1') { //已同意保密协议
    searchApplyEvent()
  } else {
    agree_info.value.type = 'promise';
    agree_info.value.visible = true;
  }
}
const searchApplyEvent = ()=>{
  searchApply({id: event_id.value},true).then(()=>{
    router.push({path: `/event_detail/${event_id.value}`})
  })
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
<style lang="css" scoped>
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
}
.search_head{
  border-bottom: 1px solid #f4f4f4;
  padding: 15px 20px;
  font-size: 16px;
  line-height: 20px;
  color: #3D6EDF;
}
.search_item{
  margin: 0 20px;
  padding: 20px 0;
  border-bottom: 1px solid #f4f4f4;
  .title{
    color: #333;
    font-size: 16px;
    line-height: 20px;
    font-weight: bold;
  }
  .content{
    font-size: 14px;
    color: #444;
    line-height: 20px;
    margin-top: 6px;
  }
  .related{
    font-size: 14px;
    color: #444;
    line-height: 20px;
    margin-top: 6px;
  }
  .other{
    font-size: 14px;
    line-height: 20px;
    margin-top: 8px;
    .comany{
      color: #3D6EDF;
      cursor: pointer;
    }
  }
  .main_comany{
    color: #3D6EDF;
    cursor: pointer;
    font-size: 14px;
    line-height: 20px;
    font-weight: bold;
  }
}
</style>