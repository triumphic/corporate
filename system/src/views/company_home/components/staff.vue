<template>
<div v-loading="loading">
  <div class="staff_top">
    <div class="hint">总共有{{ pagination.total }}条记录</div>
    <el-button @click="staffDialogVisible=true;isEdit=false;">添加员工</el-button>
  </div>
  <el-table :data="tableData" height="calc(100vh - 336px)" style="width: 100%">
    <template v-slot:empty>
      <el-empty :image-size="100" description='暂无员工'></el-empty>
    </template>
    <el-table-column prop="name" label="姓名" align="center">
      <template #default="scope">
        <span style="color:#3D6EDF">{{ scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="id_card" label="身份证号" align="center"/>
    <el-table-column prop="position" label="岗位"  align="center"/>
    <el-table-column prop="type_format" label="类型"  align="center"/>
    <el-table-column label="入职时间" align="center"  width="220">
      <template #default="scope">
        {{ scope.row.entry_date}} / {{ scope.row.leave_date }}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <div class="table_btn">
          <span @click="updatestaff(scope.row)">修改</span>
          <span @click="hidestaff(scope.row.id,scope.row.row_status)" v-if="scope.row.row_status==1" style="color:#00b38a">显示</span>
          <span @click="hidestaff(scope.row.id,scope.row.row_status)" v-if="scope.row.row_status==0">隐藏</span>
          <span @click="deletestaff(scope.row.id)" v-if="scope.row.row_status!=-1">删除</span>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination" v-show="Number(pagination.pages) > 1">
    <el-pagination background :small="true" :current-page="pagination.page" @current-change="handleCurrentChange" layout="prev, pager, next" :page-count='Number(pagination.pages)'>
    </el-pagination>
  </div>
</div>
<!-- 添加员工 -->
<el-dialog v-model="staffDialogVisible" :title="isEdit?'编辑员工':'添加员工'" width="400px" :before-close="handleClose">
  <el-form :model="form" label-width="80px">
    <el-form-item required label="员工名称"><el-input placeholder="请输入员工名称" v-model="form.name" /></el-form-item>
    <el-form-item label="身份证号"><el-input placeholder="请输入身份证号" v-model="form.id_card" /></el-form-item>
    <el-form-item label="入职日期"><el-date-picker v-model="form.entry_date" type="date" placeholder="选择日期" /></el-form-item>
    <el-form-item label="离职日期"><el-date-picker v-model="form.leave_date" type="date" placeholder="选择日期" /></el-form-item>
    <el-form-item label="岗位"><el-input placeholder="请输入岗位" v-model="form.position" /></el-form-item>
    <el-form-item label="岗位类型">
        <el-select v-model="form.type" placeholder="岗位类型">
        <el-option
          v-for="item in typeOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="简介"><el-input :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="请输入简介" v-model="form.intro" /></el-form-item>
  </el-form>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="handleClose()">取消</el-button>
      <el-button type="primary" @click="submitstaff">提交</el-button>
    </span>
  </template>
</el-dialog>
</template>
<script setup lang="ts">
import { employeeIndex, employeeCreate,employeeDelete,employeeHide,employeeUpdate } from '@/api/staff.ts'
import { ref,reactive, onBeforeMount } from 'vue'
import { ElMessage,ElMessageBox } from "element-plus"

const emits = defineEmits<{
  (event: 'resetInit', value?: any): void
}>()
const loading = ref(false)
const edit_id = ref('')
const staffDialogVisible = ref(false)
const isEdit = ref(false)
let tableData = reactive([] as any[])
const form = reactive({
  name: '',
  id_card: '',
  entry_date:'',
  leave_date:'',
  position: '',
  type: '',
  intro: ''
})
let pagination = reactive({
  page: 1,
  pages: 0,
  page_size: 20,
  total: 0,
})
const typeOptions = reactive([{id: '1', name: '员工'}, {id: '2', name: '实习生'}])

onBeforeMount(()=>{
  init(1)
})
/**获取员工列表 */
const init = (page:number) =>{
  pagination.page = page
  loading.value = true
  employeeIndex({'page': pagination.page, 'per-page': pagination.page_size}).then((res:any)=>{
    tableData = res.data.list
    pagination.total = res.data._meta.totalCount;
    pagination.pages = res.data._meta.pageCount;
    loading.value = false
  }).catch(()=>{
    loading.value = false
  })
}
/**点击编辑员工 */
const updatestaff = (info:any) => {
  edit_id.value = info.id
  form.name = info.name;
  form.id_card = info.id_card
  form.entry_date = info.entry_date
  form.leave_date = info.leave_date
  form.position = info.position
  form.type = String(info.type)
  form.intro = info.intro
  isEdit.value = true;
  staffDialogVisible.value = true;
}
/**添加编辑员工 */
const submitstaff = async () => {
  if (form.name == '' ){
    ElMessage.warning('请出入员工名称')
    return
  }
  if (isEdit.value) {
    await employeeUpdate(Object.assign({id: edit_id.value},form),true)
  } else {
    await employeeCreate(form,true)
  }
  resetstaff()
  staffDialogVisible.value = false;
  init(isEdit.value?pagination.page:1)
  emits('resetInit')
}
/**隐藏员工 */
const hidestaff = (id:string,status:number) => {
  ElMessageBox.confirm(`确定要${status == 1 ? '显示' : '隐藏'}该员工?`,'提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    employeeHide({id},true).then(()=>{
      ElMessage.success('操作成功')
      init(pagination.page)
    })
  }).catch(() => {})
}
/**删除员工 */
const deletestaff = (id:string) => {
  ElMessageBox.confirm('确定要删除该员工?','提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    employeeDelete({id},true).then(()=>{
      ElMessage.success('删除成功')
      init(pagination.page)
    })
  }).catch(() => {})
}
const handleCurrentChange = (val:number) => {
  init(val)
}
/** 重置 */
const resetstaff = () => {
  form.name = ''
  form.id_card = ''
  form.entry_date = ''
  form.leave_date = ''
  form.position = ''
  form.type = ''
  form.intro = ''
}
const handleClose = () => {
  staffDialogVisible.value = false;
  resetstaff()
}
</script>
<style scoped lang="scss">
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
}
</style>