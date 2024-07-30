<script setup lang="ts">
import router from "../router";
const navigateBack = () => {
  router.back();
}
</script>

<template>
  <div>
    other page
  </div>
  <hr>
  <button @click="navigateBack">返回</button>
</template>

<style scoped>

</style>