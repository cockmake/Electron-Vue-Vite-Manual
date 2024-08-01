<script setup lang="ts">

import {useTheme} from "vuetify";
import {onMounted} from "vue";

const theme = useTheme()

window.ipcRenderer.on('theme-changed', (_event, theme_color) => {
  theme.global.name.value = theme_color;
})

onMounted(() => {
  window.themeSwitch.switch('system').then((showUseDark: boolean) => {
    if (showUseDark) {
      theme.global.name.value = 'dark';
    } else {
      theme.global.name.value = 'light';
    }
  });
})
</script>

<template>
  <router-view />
</template>

<style>

</style>
