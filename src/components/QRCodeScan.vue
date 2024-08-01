<template>
  <div style="height: 100%; width: 100%;">
    <div id="reader"></div>
  </div>
</template>

<script setup lang="ts">

import { Html5Qrcode } from 'html5-qrcode'
import { nextTick, onUnmounted } from 'vue'

const emits = defineEmits(['execute'])
let html5QrCode: any = null
nextTick(() => {
  getCameras()
})
const start = () => {
  html5QrCode.start(
    // environment后置摄像头 user前置摄像头
    { facingMode: 'environment' },
    {
      fps: 10, // 可选，每秒帧扫描二维码
      // qrbox: { width: 200, height: 200 } // 可选，如果你想要有界框UI
      // aspectRatio: 1.777778 // 可选，视频馈送需要的纵横比，(4:3--1.333334, 16:9--1.777778, 1:1--1.0)传递错误的纵横比会导致视频不显示
    },
    (decodedText: any, decodedResult: any) => {
      // console.log('decodedText', decodedText)
      // console.log('decodedResult', decodedResult)
      emits('execute', decodedText)
    }
  )
    .catch((err: any) => {
      console.log('扫码错误信息', err)
      if (typeof err == 'string') {
        console.log(err)
      } else {
        if (err.name == 'NotAllowedError') {
          console.log('你拒绝了访问相机权限')
        } else if (err.name == 'NotFoundError') {
          console.log('没有找到您的摄像头')
        } else if (err.name == 'NotSupportedError') {
          console.log('您处在不安全的环境中，无法访问摄像头')
        } else if (err.name == 'NotReadableError') {
          console.log('相机被占用')
        } else if (err.name == 'OverconstrainedError') {
          console.log('摄像头不合适')
        } else if (err.name == 'StreamApiNotSupportedError') {
          console.log('此浏览器不支持流API')
        }
      }
    })
}

const getCameras = () => {
  Html5Qrcode.getCameras()
    .then((devices: any) => {
      if (devices && devices.length) {
        html5QrCode = new Html5Qrcode('reader')
        start()
      }
    })
    .catch((err: any) => {
      console.log('获取摄像头错误', err)
      html5QrCode = new Html5Qrcode('reader')
    })
}
const stop = () => {
  html5QrCode.stop().then(() => {
    console.log('停止扫码')
  })
    .catch((err: any) => {
      console.log(err)
      console.log('无法停止扫码')
    })
}
onUnmounted(() => {
  stop()
})
</script>