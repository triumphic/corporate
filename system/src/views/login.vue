<template>
  <div class="container">
    <div class="loginBox" v-loading="loading">
      <div class="formLabelAlign">
        <div class="psd_enter">{{ title }}</div>
        <el-input size="large" type="tel" class="input_item" v-model="form.phone" placeholder="" clearable>
          <template #prefix><span style="margin-right: 10px;">+86</span></template>
        </el-input>
        <el-input size="large" class="input_item" v-model="form.yzm" placeholder="请输入验证码" clearable @keydown.enter.native="submitForm">
          <template #append>
            <div :class="[yzm_hint == '获取验证码' ? 'yzm_btn' : 'pointer_drop']" @click="getYzm()">{{ yzm_hint }}</div>
          </template>
        </el-input>
        <button class="self-button" @click="submitForm()" >登 录</button>
      </div>

      <div class="forgetPsd">
        <el-checkbox v-model="checked"><template #default></template></el-checkbox>
        我已阅读并同意信鸽网<span>《用户服务协议》</span>及<span>《个人信息保护政策》</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref,reactive,onBeforeMount, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from "element-plus"
import { sendCaptcha, captchaLogin} from '@/api/login.ts'
import { setCookie } from '@/utils/cache/cookies.ts'
import { infoStore } from '@/stores/modules/app.ts'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const checked = ref(false)
const title = ref('用户登录')
const yzm_hint = ref('获取验证码')
const form = reactive({
  phone: '',
  yzm: ''
})
let djs_count:number = 60
let timell: NodeJS.Timeout

onBeforeMount(()=>{
  if(route.query.id == 'register') {
    title.value = '用户注册'
  }
})
onUnmounted(()=>{
  clearInterval(timell)
})
/**登录 */
const submitForm = ()=>{
  // router.push({path:'company_home'})
  let reg = /^1[3|4|5|7|8][0-9]{9}/;
  if(!reg.test(form.phone)){
    ElMessage.error('请输入正确手机号！')
    return false;
  }
  if (form.yzm == '') {
    ElMessage.error('请输入验证码')
    return false;
  }
  loading.value = true;
  captchaLogin({
    receiver: form.phone,
    code: form.yzm
  }).then((res:any)=>{
    loading.value = false;
    setCookie('access_token', res.data.access_token)
    setCookie('is_login', true)
    infoStore().setInfo(res.data)
    setCookie('login_info', res.data)
    if (!res.data.company) { // 没有绑定企业，需要跳转到完善企业信息页面
      router.push({path:'perfect_company'})
    }else{
      setCookie('company_info', res.data.company)
    }
    console.log(res)
  }).catch(()=>{
    loading.value = false;
  })
}
/**获取验证码 */
const getYzm = ()=>{
  if( yzm_hint.value != '获取验证码'){
    return
  }
  let reg = /^1[3|4|5|7|8][0-9]{9}/;
  if(!reg.test(form.phone)){
    ElMessage.error('请输入正确手机号！')
    return false;
  }
  loading.value = true;
  sendCaptcha({
    receiver: form.phone
  }).then(()=>{
    loading.value = false;
    djs_count = 60;
    yzm_hint.value = `${djs_count}s`
    timell = setInterval(()=>{
      if (djs_count == 1){
        clearInterval(timell)
        yzm_hint.value = `获取验证码`
        return;
      }
      djs_count--;
      yzm_hint.value = `${djs_count}s`
    },1000)
  }).catch(()=>{
    loading.value = false;
  })
}
</script>
<style scoped lang="scss">
.container{
  background: url('@/assets/img/10.jpg') no-repeat;
  background-size: 100% auto;
  width: 100vw;
  height: 100vh;
}
.yzm_btn{
  color: #3D6EDF;
  cursor: pointer;
}
.loginBox {
  width: 400px;
  height: 380px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 15px 1px rgba(0, 0, 0, 0.08);
  padding: 30px;
  position: fixed;
  top: 0;
  bottom: 0;
  margin: auto;
  right: 200px;
}

.forgetPsd {
  line-height: 20px;
  color: #444;
  font-size: 14px;
  letter-spacing: 0.01rem;
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  span{
    color: #3D6EDF;
  }
  :deep(.el-checkbox__label){
    padding-left: 0;
  }
  :deep(.el-checkbox){
    height: auto;
    margin-right: 6px;
  }
}
.formLabelAlign {
    .self-button {
      width: 100%;
      padding: 0;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      font-weight: bold;
      background: #3D6EDF;
      border-radius: 3px;
      border: 1px solid rgba(32, 53, 128, 0.16);

      margin-top: 30px;
      color: #fff;
      border: none;
    }
    .psd_enter {
      font-size: 26px;
      font-weight: bold;
      color: #585858;
      letter-spacing: 0.1em;
      margin-bottom: 20px;
      text-align: center;
    }
  }
  .input_item{
    margin-top: 20px;
  }
</style>