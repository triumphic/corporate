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
