<template>
<div v-loading="loading">
  <div class="setup_item">
    <div class="lebel">公司名称</div>
    <div class="info">{{company_info.name}}</div>
    <el-popover title="公司名称" v-model:visible="form_visible.name_visible" placement="right" :width="400" trigger="click">
      <template #reference>
        <span class="btn">编辑</span>
      </template>
      <el-input class="popover_con" v-model="form.name" placeholder="请输入公司全称" clearable />
      <span class="dialog-footer">
        <el-button @click="submitEvent('name','close')">取消</el-button>
        <el-button type="primary" @click="submitEvent('name')">提交</el-button>
      </span>
    </el-popover>
  </div>
  <div class="setup_item">
    <div class="lebel">公司注册地址</div>
    <div class="info">{{company_info.province_format}}{{ company_info.city_format }}{{ company_info.addr }}</div>

    <el-popover title="公司注册地址" v-model:visible="form_visible.city_visible" placement="right" :width="400" trigger="click">
      <template #reference>
        <span class="btn">编辑</span>
      </template>
      <div class="popover_con">
        <el-cascader v-model="form.city_province_city" style="width:100%" :props="cascaderProps" :options="cityList" placeholder="请选择省份、城市" @change="handleCityChange" />
        <el-input v-model="form.addr" style="margin-top: 10px;" placeholder="请填写具体地址门牌号" clearable />
      </div>
      <span class="dialog-footer">
        <el-button @click="submitEvent('city','close')">取消</el-button>
        <el-button type="primary" @click="submitEvent('city')">提交</el-button>
      </span>
    </el-popover>
  </div>
  <div class="setup_item">
    <div class="lebel">企业认证</div>
    <div class="info">{{ company_info.status_format }}</div>
    <el-popover title="企业营业执照" v-model:visible="form_visible.business_license_id_visible" placement="right" :width="400" trigger="click">
      <template #reference>
        <span v-if="company_info.status != 2" :class="['btn', company_info.status == 2 ? 'btn_yes' : '']">{{ company_info.status == 2 ? '已认证' : '认证'}}</span>
      </template>
      <div class="popover_con">
        <div class="flex" style="margin-top:10px">
          <el-upload
            class="avatar-uploader"
            action=""
            name="image"
            :http-request="importFile"
            :show-file-list="false"
            accept=".jpg,.jpeg,.png,gif,JPG,JPEG,PNG"
            >
            <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <img :src="form.imageUrl" v-if="form.imageUrl" class="avatar" />
        </div>
        <div class="el-upload__tip">提示：仅允许上传"png"、"jpg"、"jpeg"格式文件！</div>
      </div>
      <span class="dialog-footer">
        <el-button @click="submitEvent('business_license_id','close')">取消</el-button>
        <el-button type="primary" @click="submitEvent('business_license_id')">提交</el-button>
      </span>
    </el-popover>

  </div>
  <div class="setup_item">
    <div class="lebel">联系人</div>
    <div class="info">{{company_info.contact}}</div>
    <el-popover title="联系人" v-model:visible="form_visible.contact_visible" placement="right" :width="400" trigger="click">
      <template #reference>
        <span class="btn">编辑</span>
      </template>
      <el-input class="popover_con" v-model="form.contact" placeholder="请输入联系人" clearable />
      <span class="dialog-footer">
        <el-button @click="submitEvent('contact','close')">取消</el-button>
        <el-button type="primary" @click="submitEvent('contact')">提交</el-button>
      </span>
    </el-popover>
  </div>
  <div class="setup_item">
    <div class="lebel">联系方式</div>
    <div class="info">{{company_info.contact_phone}}</div>
    <el-popover title="联系方式" v-model:visible="form_visible.contact_phone_visible" placement="right" :width="400" trigger="click">
      <template #reference>
        <span class="btn">编辑</span>
      </template>
      <el-input class="popover_con" v-model="form.contact_phone" placeholder="请输入联系方式" clearable />
      <span class="dialog-footer">
        <el-button @click="submitEvent('contact_phone','close')">取消</el-button>
        <el-button type="primary" @click="submitEvent('contact_phone')">提交</el-button>
      </span>
    </el-popover>
  </div>
  <div class="setup_item">
    <div class="lebel">联系邮箱</div>
    <div class="info">{{company_info.contact_email}}</div>
    <el-popover title="联系邮箱" v-model:visible="form_visible.contact_email_visible" placement="right" :width="400" trigger="click">
      <template #reference>
        <span class="btn">编辑</span>
      </template>
      <el-input class="popover_con" v-model="form.contact_email" placeholder="请输入联系邮箱" clearable />
      <span class="dialog-footer">
        <el-button @click="submitEvent('contact_email','close')">取消</el-button>
        <el-button type="primary" @click="submitEvent('contact_email')">提交</el-button>
      </span>
    </el-popover>
  </div>
  <div class="setup_item">
    <div class="lebel">公司简介</div>
    <div class="info">{{company_info.intro}}</div>
    <el-popover title="公司简介" v-model:visible="form_visible.intro_visible" placement="right" :width="400" trigger="click">
      <template #reference>
        <span class="btn">编辑</span>
      </template>
      <el-input class="popover_con" v-model="form.intro" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="请输入公司简介" clearable />
      <span class="dialog-footer">
        <el-button @click="submitEvent('intro','close')">取消</el-button>
        <el-button type="primary" @click="submitEvent('intro')">提交</el-button>
      </span>
    </el-popover>
  </div>
</div>
</template>
<script setup lang="ts">
import { companyView, companyUpdate, getCityEnvent, uploadImgEvent} from '@/api/index.ts'
import { ref,reactive, onBeforeMount } from 'vue'
import { setCookie,getCookie } from '@/utils/cache/cookies.ts'
import { ElMessage } from "element-plus"
const company_info:any = ref({})
const loading = ref(false)
let form_visible: any = ref({
  name_visible: false,
  city_visible: false,
  contact_visible: false,
  contact_phone_visible: false,
  contact_email_visible: false,
  intro_visible: false,
  business_license_id_visible:false,
})
const cascaderProps = reactive({
  label: 'name',
  value: 'id'
})
let cityList = reactive([] as any[])
let form:any = reactive({
  name: '',
  city_province_city: '',
  province:'',
  city:'',
  addr: '',
  contact: '',
  contact_phone: '',
  contact_email: '',
  intro: '',
  business_license_id:'',
  imageUrl: ''
})
onBeforeMount(()=>{
  getCityEnvent({}).then((res:any)=>{
    cityList = res.data;
  })
  init()
})
const init = () =>{
  loading.value = true
  companyView({id: getCookie('company_info').id}).then((res:any)=>{
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
    form.imageUrl = res.data.business_license_url
    setCookie('company_info', res.data)

    company_info.value = res.data
    loading.value = false
  }).catch(()=>{
    loading.value = false
  })
}
/**城市选择change */
const handleCityChange = ()=>{
  form.province = form.city_province_city[0]
  form.city = form.city_province_city[1]
}
const submitEvent = (type:string,close?:string) => {
  if(close){
    form_visible.value[`${type}_visible`] = false;
    return
  }
  if (form[type] == '' && type != 'city'){
    type == 'name' && ElMessage.warning('请输入公司全称')
    type == 'business_license_id' && ElMessage.warning('请上传企业营业执照')
    return
  }
  if (type == 'city' && form.addr == '') {
    ElMessage.warning('请输入具体地址')
    return;
  }
  let params:any = {}
  if (type == 'city') {
    params = {
      province: form.province,
      city: form.city,
      addr: form.addr
    }
  } else {
    params = {[type]: form[type]}
  }
  
  form_visible.value[`${type}_visible`] = false;
  companyUpdate(params,true).then(()=>{
    init()
  })
}
/**上传图片 */
const importFile = (options:any):Promise<unknown>=>{
  return new Promise((resolve:any,reject:any)=>{
    const reader = new FileReader();
		reader.readAsDataURL(options.file);
		reader.onload = () => {
      uploadImgEvent({image: reader.result,filename: options.file.name},true).then((res:any)=>{
        form.imageUrl = res.data.url;
        form.business_license_id = res.data.id
        resolve()
      }).catch(()=>{
        reject()
      })
		};
  })
}
</script>
<style lang="scss" scoped>
.setup_item{
  display: flex;
  align-items: center;
  margin: 20px;
  border-bottom: 1px solid #f4f4f4;
  padding: 10px 20px;
  .lebel{
    font-size: 14px;
    line-height: 20px;
    color: #333;
    width: 160px;
  }
  .info{
    flex: 1;
    margin: 0 10px;
    color: #999;
    font-size: 13px;
    line-height: 20px;
  }
  .btn{
    font-size: 14px;
    color: #3D6EDF;
    cursor: pointer;
  }
  .btn_yes{
    cursor: no-drop;
    color: #999;
  }
}
.popover_con{
  margin: 20px 0;
}
.dialog-footer{
  display: flex;
  justify-content: end;
}
.avatar-uploader {
  width: 100px;
  height: 100px;
  display: block;
  border: 1px dashed #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
  }
}
.avatar{
  width: 100px;
  height: 100px;
  margin-left: 20px;
}
</style>