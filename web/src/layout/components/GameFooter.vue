<template>
  <div class="footer-container">
    <div class="horizontal-divider"></div>
    <div class="footer-content">
      <div>Copyright © 2022-prsent Game All Rights Reserved.</div>
      <!-- <el-link class="beian" :underline="false" href="http://beian.miit.gov.cn" target="_blank">赣ICP备20001850-3号</el-link> -->
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.footer-container {
  margin-top: 10px;
  height: 80px;
  color: #999999;
  flex: 0 0 auto;
}

.footer-content {
  margin: 10px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.beian {
  font-size: 14px;
  color: #999999;
}
</style>
