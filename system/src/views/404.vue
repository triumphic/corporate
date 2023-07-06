<template>
  <div class="error">
    <div class="content">
      <img src="@/assets/img/404.png" class="img_404" />
      <p class="hint">您的数据被外星人劫持了….攻城狮正在努力抢救中…</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.error {
  width: 100%;
  height: 100vh;
  background: #ffffff;
  .content {
    text-align: center;
    padding-top: 90px;
    .img_404 {
      width: 483px;
      margin: auto;
    }
    .hint {
      color: #0c0c0c;
      font-size: 14px;
      margin-top: 25px;
    }
  }
}
</style>
