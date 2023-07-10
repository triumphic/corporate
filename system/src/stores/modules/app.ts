import { defineStore } from 'pinia'
import { ref } from "vue"

/** 存储主体信息 */
export const infoStore = defineStore('corp', () => {
  let value:any = ref({});
  const setInfo = (val: Object) => {
    value.value = val
  }
  return { value, setInfo }
})

/**消息个数 */
export const messageStore = defineStore('message', () => {
  let value:any = ref(0);
  const setInfo = (val: any) => {
    value.value = val
  }
  return { value, setInfo }
})

