
import {  getUserPermissionList,authorizeCorpList, authorizeAccountGroupList } from '@/api/login/index.ts'
import {  getCookie, setCookie} from './cache/cookies.ts'
import { sideStore, corpListStore } from '@/stores/modules/app.ts'

interface obj {
  [idx: string]: any
}

function permissionInit () {
  return new Promise((resolve:any)=>{
    getUserPermissionList({}).then( ( result:any )  => {
      var res = result.rst
      let side_array = res;
      side_array.forEach((item: obj) => {
        item.sub = item.sub.filter((s_item: obj) => {
          //is_system_admin为1是系统管理员,只有系统管理员有菜单权限 menuManage是菜单路由
          return (s_item.route != 'menuManage' && getCookie('isSuperManage') != '1') || (getCookie('isSuperManage') == '1');
        })
      })
      // 侧边栏数据传给pinia
      sideStore().setSide((Array.isArray(side_array) ? side_array : []));
      setCookie('sideList', JSON.stringify(side_array))
      /** 获取公司主体 */ 
      if (getCookie('isSuperManage') == '1') {//is_system_admin为1是系统管理员
        authorizeAccountGroupList().then((result:any)=>{
          corpListStore().setList(result)
          resolve()
        }).catch(()=>{
          resolve()
        })
      } else {
        console.log('00',authorizeCorpList)
        authorizeCorpList().then((result:any)=>{
          console.log(result)
          corpListStore().setList(result)
          resolve()
        }).catch(()=>{
          resolve()
        })
      }
    }).catch(() => {
      resolve()
    })
  })
  
}




export default permissionInit;
