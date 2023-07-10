<template>
  <div v-loading="loading">
    <div class="staff_top">
      <div class="hint">总共有{{ pagination.total }}条记录</div>
      <el-button @click="staffDialogVisible=true;isEdit=false;">添加事件</el-button>
    </div>
    <el-empty v-if="tableData.length<=0" :image-size="100" description='暂无事件'></el-empty>
    <div class="event_con">
      <div class="event_item" v-for="item in tableData">
        <div class="con">
          <div class="title flex"><span class="pointer" @click="onClickDetail(item.id)">{{ item.title }}</span><span v-if="item.biz_status==0" class="draft">草稿</span></div>
          <div class="other">{{ item.summary }}</div>
          <div class="other" v-if="item.relateEmployee&&item.relateEmployee.length>0">相关人员：<span v-for="(yg,yg_ind) in item.relateEmployee">{{ yg.name }}<em v-if="item.relateEmployee.length != (yg_ind+1)">，</em></span></div>
        </div>
        <div class="table_btn">
          <span @click="updateStaff(item)">修改</span>
          <span @click="hideEvent(item.id,item.row_status)" v-if="item.row_status==1" style="color:#00b38a">显示</span>
          <span @click="hideEvent(item.id,item.row_status)" v-if="item.row_status==0">隐藏</span>
          <span @click="deleteEvent(item.id)" v-if="item.row_status!=-1">删除</span>
        </div>
      </div>
    </div>
    <div class="pagination" v-show="Number(pagination.pages) > 1">
      <el-pagination background :small="true" :current-page="pagination.page" @current-change="handleCurrentChange" layout="prev, pager, next" :page-count='Number(pagination.pages)'>
      </el-pagination>
    </div>
  </div>
  <!-- 添加事件 -->
  <el-dialog v-model="staffDialogVisible" title="" width="840px" :before-close="handleClose">
    <template #header>
      <div style="color: #333;font-size: 19px;line-height: 40px;font-weight: bold;border-bottom: 1px solid #eee;margin-left: 10px;">{{ isEdit?'编辑企业事件':'添加企业事件' }}</div>
    </template>
    <div class="dialog_container">
      <div class="info" style="margin-top: 0;">
        <label><em>*</em>标题</label>
        <el-input v-model="form.title" placeholder="请输入标题" clearable />
      </div>
      <div class="info">
        <label>相关员工（多选）</label>
        <el-select v-model="form.relate_employee" multiple style="width:100%" placeholder="相关员工">
          <el-option
            v-for="item in staffList"
            :key="item.id"
            :label="item.text"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="info">
        <label>概要</label>
        <el-input placeholder="请输入概要" v-model="form.summary" />
      </div>
      <div class="info">
        <label>详情描述</label>
        <Editor v-if="staffDialogVisible" style="width: 100%;" @update:editorValue="editorUpdate" ref="editorRef" v-model="form.content" :editorValue="form.content"></Editor>
      </div>
    </div>
    <template #footer>
      <div class="flex_center_between" style="padding: 0 10px 10px;">
        <div class="checkbox">
          <el-checkbox v-model="is_private">隐藏发布</el-checkbox>
          <el-checkbox v-model="auto_agree">默认同意</el-checkbox>
        </div>
        <div>
          <el-button @click="submitEvent(0)">保存草稿</el-button>
          <el-button type="primary" @click="submitEvent(1)">提交</el-button>
        </div>
    </div>
    </template>
  </el-dialog>
  </template>
  <script setup lang="ts">
  import { eventIndex, eventCreate,eventDelete,eventHide,eventUpdate } from '@/api/event.ts'
  import { employeeSelect } from '@/api/staff.ts'
  import { ref,reactive, onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage,ElMessageBox } from "element-plus"
  import Editor from '@/components/Editor.vue'
  // const emits = defineEmits<{
  //   (event: 'resetInit', value?: any): void
  // }>()
  const router = useRouter()
  const loading = ref(false)
  const edit_id = ref('')
  const staffDialogVisible = ref(false)
  const is_private = ref(false)
  const auto_agree = ref(false)
  const isEdit = ref(false)
  let tableData = reactive([] as any[])
  let staffList = reactive([] as any[])
  const form = reactive({
    title: '',
    summary: '',
    relate_employee:'',
    content:'',
    is_private: 0,
    auto_agree: 0
  })
  let pagination = reactive({
    page: 1,
    pages: 0,
    page_size: 20,
    total: 0,
  })
  
  onBeforeMount(()=>{
    employeeSelect().then((res:any)=>{
      staffList = res.data
    })
    init(1)
  })

  const editorUpdate = (value:any) => {
    form.content = value
  }
  /**获取事件列表 */
  const init = (page:number) =>{
    pagination.page = page
    loading.value = true
    eventIndex({'page': pagination.page, 'per-page': pagination.page_size}).then((res:any)=>{
      tableData = res.data.list
      pagination.total = res.data._meta.totalCount;
      pagination.pages = res.data._meta.pageCount;
      loading.value = false
    }).catch(()=>{
      loading.value = false
    })
  }
  /**点击编辑事件 */
  const updateStaff = (info:any) => {
    edit_id.value = info.id
    form.title = info.title,
    form.summary = info.summary
    form.relate_employee = info.relateEmployee.map((v:any)=>{return String(v.id)})
    form.content = info.content
    form.is_private = info.is_private
    form.auto_agree = info.auto_agree
    is_private.value = info.is_private == 1 ? true : false
    auto_agree.value = info.auto_agree == 1 ? true : false
    isEdit.value = true;
    staffDialogVisible.value = true;
  }
  /**添加编辑事件 type 0草稿，1发布*/
  const submitEvent = async (type:number) => {
    if (form.title == '' ){
      ElMessage.warning('请输入标题')
      return
    }
    is_private.value ? form.is_private = 1 : form.is_private = 0
    auto_agree.value ? form.auto_agree = 1 : form.auto_agree = 0
    if (isEdit.value) {
      let obj:any = Object.assign({id: edit_id.value,biz_status: type},form)
      await eventUpdate(obj,true)
    } else {
      let obj:any = Object.assign({biz_status: type},form)
      await eventCreate(obj,true)
    }
    resetEvent()
    staffDialogVisible.value = false;
    init(isEdit.value?pagination.page:1)
  }
  /**隐藏事件 */
  const hideEvent = (id:string,status:number) => {
    ElMessageBox.confirm(`确定要${status == 1 ? '显示' : '隐藏'}该事件?`,'提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      eventHide({id},true).then(()=>{
        ElMessage.success('操作成功')
        init(pagination.page)
      })
    }).catch(() => {})
  }
  /**删除事件 */
  const deleteEvent = (id:string) => {
    ElMessageBox.confirm('确定要删除该事件?','提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      eventDelete({id},true).then(()=>{
        ElMessage.success('删除成功')
        init(pagination.page)
      })
    }).catch(() => {})
  }
  const handleCurrentChange = (val:number) => {
    init(val)
  }
  /** 重置 */
  const resetEvent = () => {
    form.title = '',
    form.summary = ''
    form.relate_employee = ''
    form.content = ''
    form.is_private = 0
    form.auto_agree = 0
    is_private.value = false
    auto_agree.value = false
  }
  const handleClose = () => {
    staffDialogVisible.value = false;
    resetEvent()
  }
  /**去事件详情 */
  const onClickDetail = (id:string) => {
    router.push({path: `/event_detail/${id}`})
  }
  </script>
  <style scoped lang="scss">
  .event_item{
    display: flex;
    align-items: self-end;
    justify-content: space-between;
    margin: 0 20px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    .con{
      flex:1;
      .title{
        color:#3D6EDF;
        font-size: 16px;
        line-height: 20px;
      }
      .other{
        font-size: 13px;
        line-height: 16px;
        color: #777;
        margin-top: 6px;
      }
    }
  }
  .staff_top{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    .hint{
      font-size: 14px;
      color: #777;
    }
  }
  .table_btn{
    display: flex;
    align-items: center;
    justify-content: center;
    span{
      margin: 0 6px;
      font-size: 13px;
      color: #3D6EDF;
      cursor: pointer;
    }
  }s
 :deep(.head){
    color: #333;
    font-size: 20px;
    line-height: 40px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
  }
  .dialog_container{
    width: 800px;
    min-height: 60vh;
    background: #fff;
    margin: auto;
    padding: 0 10px 0px;
   
    .info{
      margin-top: 20px;
      flex: 1;
      label{
        font-size: 14px;
        color: #333;
        line-height: 20px;
        margin-bottom: 8px;
        display: block;
        em{
          color: red;
        }
      }
    }
  }
  .draft{
    display: inline-block;
    background: #666;
    color: #fff;
    font-size: 12px;
    padding:0 2px;
    border-radius: 3px;
    margin-left: 3px;
    transform: scale(0.9);
  }
  
  </style>