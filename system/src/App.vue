<template>
  <router-view v-if="flag"></router-view>
</template>

<script setup lang="ts">
import { provide, ref, nextTick } from 'vue'
const flag = ref(true)
const load = ()=>{
  flag.value = false
  nextTick(()=>{
    flag.value = true
  })
}
provide('load',load)
</script>

<style scoped>

</style>
