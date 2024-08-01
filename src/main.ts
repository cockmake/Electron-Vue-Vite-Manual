import {createApp} from 'vue'
import App from './App.vue'
import router from "./router";

import './style.css'

import 'vuetify/styles'

import {createVuetify} from "vuetify";

import {zhHans} from 'vuetify/locale'

// 图标

import '@mdi/font/css/materialdesignicons.css'

import './demos/ipc'


// If you want to use Node.js, the`nodeIntegration` needs to be enabled in the Main process.

// import './demos/node'


const vuetify = createVuetify({

    // theme: {
    //     defaultTheme: 'light',
    // },

    locale: {
        locale: 'zhHans',
        messages: {zhHans},
    },

})

const app = createApp(App)

app.use(router)
app.use(vuetify)
app
    .mount('#app')
    .$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*')
    })
    .then(() => {
            console.log('App is mounted!')
        }
    )
