<script setup lang="ts">
import router from "../router";
import {useTheme} from "vuetify";
import {onMounted, onUnmounted, ref} from "vue";

const switchPage = () => {
  router.push('/other');
}
const theme = useTheme()

const key_pressed: Record<string, boolean> = {};

const handleKeyBoardInput = () => {
  if (key_pressed['a'] && key_pressed['d']) {
    console.log('a and d pressed');
  }
}
const keydownHandler = (event: KeyboardEvent) => {
  key_pressed[event.key] = true;
  handleKeyBoardInput();
}
const keyupHandler = (event: KeyboardEvent) => {
  key_pressed[event.key] = false;
}
const net_status = ref('online');

const onlineHandler = () => {
  net_status.value = 'online';
  console.log('online');
}
const offlineHandler = () => {
  net_status.value = 'offline';
  console.log('offline');
}
onMounted(() => {
  document.addEventListener('keyup', keyupHandler)
  document.addEventListener('keydown', keydownHandler)
  window.addEventListener('online', onlineHandler)
  window.addEventListener('offline', offlineHandler)
})

onUnmounted(() => {
  document.removeEventListener('keyup', keyupHandler)
  document.removeEventListener('keydown', keydownHandler)
  window.removeEventListener('online', onlineHandler)
  window.removeEventListener('offline', offlineHandler)
})

const themeSwitch = (color_type: string) => {
  window.themeSwitch.switch(color_type).then((showUseDark: boolean) => {
    if (showUseDark) {
      theme.global.name.value = 'dark';
    } else {
      theme.global.name.value = 'light';
    }
  });
}

const uploaded_files = ref<File[]>([]);
const fileChanged = (files: File[]) => {
  if (files.length === 0) {
    return;
  }
  uploaded_files.value = files;
  console.log(uploaded_files.value);
}
const fileClear = () => {
  uploaded_files.value = [];
  console.log(uploaded_files.value);
}
</script>

<template>
  <br>
  <div class="w-100 d-flex justify-space-evenly align-center">
    <div class="w-50">
      <v-text-field
          disabled>
        当前网络状态为：{{ net_status }}
        <template v-slot:prepend>
          <v-icon
              :color="net_status === 'online' ? 'green' : 'red'"
              icon="mdi-earth">
          </v-icon>
        </template>
      </v-text-field>
    </div>
  </div>
  <div class="w-100 d-flex justify-space-evenly align-center">
    <v-btn @click="switchPage">切换页面</v-btn>
    <a href="https://www.electronjs.org/" target="_blank">
      <img src="../assets/electron.svg" class="logo electron" alt="Electron logo"/>
    </a>
    <a href="https://vitejs.dev/" target="_blank">
      <img src="../assets/vite.svg" class="logo" alt="Vite logo"/>
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="../assets/vue.svg" class="logo vue" alt="Vue logo"/>
    </a>
  </div>
  <br>
  <div class="w-100 d-flex justify-space-evenly align-center">
    <v-btn color="black" @click="themeSwitch('dark')">切换为暗色</v-btn>
    <v-btn color="white" @click="themeSwitch('light')">切换为浅色</v-btn>
    <v-btn color="red" @click="themeSwitch('system')">切换系统适配</v-btn>
  </div>
  <br>
  <div class="w-100 d-flex justify-space-evenly align-center">
    <div class="w-50">
      <v-file-input
          prepend-icon="mdi-file-upload"
          @update:model-value="fileChanged"
          @click:clear="fileClear"
          accept="image/*"
          label="上传文件"
          show-size
          variant="outlined"
          clearable
          chips
          counter
          multiple>
      </v-file-input>
    </div>
    <div class="w-33 flex-center">
      <v-img
          aspect-ratio="16/9"
          cover
          src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
      </v-img>
    </div>

  </div>

  <div class="d-flex justify-center align-center position-fixed bottom-0 w-100">
    Place static files into the <code>/public</code> folder
    <img style="width: 2.4em; margin-left: .4em;" src="/logo.svg" alt="Logo">
  </div>
</template>

<style>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9FEAF9);
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
