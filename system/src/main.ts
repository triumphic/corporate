// core 核心
import { createApp } from 'vue'
import App from '@/App.vue'
import router from "./router/index"
import store from "@/stores"
import { getCookie } from './utils/cache/cookies'
// element
import ElementPlus from "element-plus"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import locale from 'element-plus/lib/locale/lang/zh-cn';//变成中文
import "element-plus/dist/index.css"
import './styles/element-variarbles.scss' // element更改主题色及其他
import { ElLoading } from 'element-plus'
let main_el_loading = ElLoading.service({
  lock: true,
  text: '加载中...',
  background: 'rgba(255, 255, 255, 0.7)'
})

// css
import './styles/reset.css'
import './styles/common.scss'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus,{locale})

app.use(store).use(router)

router.beforeEach((to,from, next) =>{
    console.log(from)
  if (!Boolean(getCookie('is_login')) && to.path != '/login' && to.path != '/home') { //未登录
    next('/login')
  } else {
    if (to.path != '/login' && to.path != '/home' && to.path != '/perfect_company') {
      let company_info = getCookie('company_info')
      console.log(company_info,to.path)
      if (!company_info || !company_info.id) {  // 企业不存在
        next('/perfect_company')
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

app.mount('#app')
main_el_loading.close()