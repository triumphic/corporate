<template>
  <div class="container">
    <div class="title">企业信鸽网</div>
    <div class="flex-center search_view">
      <el-input class="input_search" size="large" v-model="keyword" placeholder="搜索姓名或身份等信息"></el-input>
      <el-button type="primary" size="large">搜索</el-button>
    </div>
   
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')
</script>
<style scoped lang="scss">
.container{
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title{
    color: #3D6EDF;
    font-size: 50px;
    line-height: 80px;
    letter-spacing: 0.1em;
    margin-top: 25vh;
  }
}
.input_search{
  width: 350px;
}
.search_view{
  margin-top: 40px;
}
</style>