<template>
  <div class="container">
    <div class="head">完成企业信息</div>
    <div class="info">
      <label><em>*</em>公司全称</label>
      <el-input v-model="form.name" placeholder="请输入公司全称" clearable />
    </div>
    <div class="info">
      <label><em>*</em>公司地址</label>
      <div class="flex">
        <el-cascader v-loading="cityLoading" v-model="form.city_province_city" style="width:300px" :props="cascaderProps" :options="cityList" placeholder="请选择省份、城市" @change="handleCityChange" />
        <el-input v-model="form.addr" style="margin-left: 4px;" placeholder="请填写具体地址门牌号" clearable />
      </div>
    </div>
    <div class="info">
      <label><em>*</em>联系人</label>
      <el-input v-model="form.contact" placeholder="请输入联系人姓名" clearable />
    </div>
    <div class="flex">
      <div class="info">
        <label><em>*</em>联系电话</label>
        <el-input v-model="form.contact_phone" placeholder="请输入联系电话" clearable />
      </div>
      <div class="info" style="margin-left: 4px;">
        <label>联系邮箱</label>
        <el-input v-model="form.contact_email" placeholder="请输入联系人邮箱" clearable />
      </div>
    </div>
    <div class="info">
      <label>提交企业营业执照（非必填）</label>
      <el-upload
        class="avatar-uploader"
        action=""
        name="image"
        :http-request="importFile"
        :show-file-list="false"
        accept=".jpg,.jpeg,.png,gif,JPG,JPEG,PNG"
        >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
      <div class="el-upload__tip">提示：仅允许上传"png"、"jpg"、"jpeg"格式文件！</div>
    </div>
    <div class="info">
      <label>公司介绍</label>
      <el-input v-model="form.intro" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="请输入公司介绍" clearable />
    </div>
    <div class="btn_view">
      <el-button type="primary" @click="completeRegistration">{{ isEdit ? '提交编辑' : '完成注册' }}</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { setCookie,getCookie } from '@/utils/cache/cookies.ts'
import { getCityEnvent, companyCreate, uploadImgEvent,companyUpdate,companyView,eventUserView } from '@/api/index.ts'
import { ElMessage } from "element-plus"
import { messageUnreadCount } from '@/api/message.ts'
import { messageStore } from '@/stores/modules/app.ts'

interface FormInter {
  name: string
  city_province_city: any
  province: string,
  city: string,
  addr: string
  contact: string
  contact_phone: string,
  contact_email: string,
  intro?: string,
  business_license_id?: string
}
const router = useRouter()
const cityLoading = ref(false)
let cityList = reactive([] as any[])
const imageUrl = ref('')
const cascaderProps = reactive({
  label: 'name',
  value: 'id'
})
let form:FormInter = reactive({
  name: '',
  city_province_city: '',
  province:'',
  city:'',
  addr: '',
  contact: '',
  contact_phone: '',
  contact_email: '',
  intro: '',
  business_license_id:''
})
const isEdit = ref(false)
onBeforeMount(()=>{
  let company_info = getCookie('company_info')
  if (company_info && company_info.id) {
    isEdit.value = true
    companyView({id:company_info.id},true).then((res:any)=>{
      let { name,province,city,addr,contact,contact_phone,contact_email,intro,business_license_id } = res.data
      form.name = name
      form.province = province
      form.city_province_city =  [res.data.province,res.data.city]
      form.city = city
      form.contact = contact
      form.contact_phone = contact_phone
      form.addr = addr
      form.contact_email = contact_email
      form.intro = intro
      form.business_license_id = business_license_id
      imageUrl.value = res.data.business_license_url
    })
  }
  cityLoading.value = true
  getCityEnvent({}).then((res:any)=>{
    cityLoading.value = false
    cityList = res.data;
  }).catch(()=>{
    cityLoading.value = false
  })
})

/**城市选择change */
const handleCityChange = ()=>{
  form.province = form.city_province_city[0]
  form.city = form.city_province_city[1]
}
/**上传图片 */
const importFile = (options:any):Promise<unknown>=>{
  return new Promise((resolve:any,reject:any)=>{
    const reader = new FileReader();
		reader.readAsDataURL(options.file);
		reader.onload = () => {
      uploadImgEvent({image: reader.result,filename: options.file.name},true).then((res:any)=>{
        imageUrl.value = res.data.url;
        form.business_license_id = res.data.id
        resolve()
      }).catch(()=>{
        reject()
      })
		};
  })
}
/**点击完成注册 */
const completeRegistration = () =>{
  if ( form.name == '' ) {
    ElMessage.warning('请输入公司全称')
    return
  }
  if ( form.city_province_city == '' ) {
    ElMessage.warning('请选择省份、城市')
    return
  }
  if ( form.addr == '' ) {
    ElMessage.warning('请填写具体地址门牌号')
    return
  }
  if ( form.contact == '' ) {
    ElMessage.warning('请填写联系人姓名')
    return
  }
  if ( form.contact_phone == '' ) {
    ElMessage.warning('请填写联系方式')
    return
  }
  if ( isEdit.value ) {//编辑
    companyUpdate(form,true).then(()=>{
      lastEvent()
    })
  } else {
    companyCreate(form,true).then(()=>{
      lastEvent()
    })
  }
}
const lastEvent = () => {
  eventUserView({}).then((res:any)=>{
    setCookie('company_info', res.data.company)
    router.push('/company_home')
  })
  messageUnreadCount().then((res:any)=>{
    messageStore().setInfo(res.data)
  })
}
</script>
<style scoped lang="scss">
  .container{
    width: 800px;
    min-height: 60vh;
    background: #fff;
    margin: auto;
    padding: 10px 20px 30px;
  }
  .head{
    color: #333;
    font-size: 20px;
    line-height: 40px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
  }
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
  .btn_view{
    text-align: right;
    margin-top: 30px;
  }

  .avatar-uploader {
    width: 100px;
    height: 100px;
    display: block;
    border: 1px dashed #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: center;
    .avatar{
      width: auto;
      height: 100%;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      text-align: center;
    }
  }
</style>