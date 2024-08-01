<script setup lang="ts">
import router from "../router";
import {onMounted, reactive, ref} from "vue";
import QRCodeScan from "../components/QRCodeScan.vue";

// onMounted(async () => {
//   const msg = await window.events.rendererToMain('hello from renderer');
//   console.log(msg);
// });

onMounted(() => {
  // renderer进程与主进程的通信函数是异步的
  window.events.rendererToMain('hello from renderer').then((msg: string) => {
    console.log(msg);
  });
})
const navigateBack = () => {
  router.back();
}

const versions = window.versions;

const qrScanCallback = (data: string) => {
  console.log(data);
}
const order = ref(0);

const showQRCodeScan = ref(false);

const date_value = ref(new Date());

const dateChanged = (date: Date) => {
  console.log(date);
}

</script>

<template>
  <v-layout class="rounded rounded-md h-100">
    <v-navigation-drawer>

    </v-navigation-drawer>
    <v-app-bar
        :order="order"
        title="Application bar"
        flat>
      <template v-slot:append>
        <v-switch
            v-model="order"
            false-value="0"
            label="Toggle order"
            true-value="-1"
            hide-details
            inset
        ></v-switch>
      </template>
    </v-app-bar>

    <v-main class="d-flex align-center justify-center flex-column">

      <div>
        本应用正在使用 Chrome {{ versions.chrome() }} Node.js {{ versions.node() }} 和 Electron
        {{ versions.electron() }}
      </div>
      <v-container>
        <v-row justify="space-around">
          <v-date-picker
              show-adjacent-months
              title="日期选择"
              elevation="24"
              v-model="date_value"
              @update:model-value="dateChanged">
          </v-date-picker>
        </v-row>
      </v-container>
      <div>Main Content</div>
      <div style="width: 50%" v-if="showQRCodeScan">
        <QRCodeScan @execute="qrScanCallback"/>
      </div>
      <div>
        <v-btn @click="navigateBack">Back</v-btn>
        <v-btn @click="showQRCodeScan = true" append-icon="mdi-checkbox-marked-circle">
          Toggle QR Code Scan
        </v-btn>
      </div>
    </v-main>
  </v-layout>
</template>

<style scoped>

</style>