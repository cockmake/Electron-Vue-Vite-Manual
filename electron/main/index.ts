import {
    app, BrowserWindow, shell,
    ipcMain, nativeTheme, globalShortcut,
    Tray, nativeImage,
    Menu, MenuItem, Notification
} from 'electron'
import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import os from 'node:os'
import fs from "node:fs";

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure

// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, 'public')
    : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')


async function createWindow() {
    win = new BrowserWindow({
        // icon使用应用程序图标
        icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
        width: 1200,
        height: 800,

        webPreferences: {
            preload,

            // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
            // nodeIntegration: true,

            // Consider using contextBridge.exposeInMainWorld
            // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
            // contextIsolation: false,
        },
    })

    if (VITE_DEV_SERVER_URL) { // #298
        win.loadURL(VITE_DEV_SERVER_URL)
        // Open devTool if the app is not packaged
        // win.webContents.openDevTools()
    } else {
        win.loadFile(indexHtml)
    }

    win.on('minimize', () => {
        // 隐藏任务栏图标
        win?.setSkipTaskbar(true)

    })
    win.on('restore', () => {
        // 显示任务栏图标
        win?.setSkipTaskbar(false)
    })
    // 发送消息给渲染进程
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // 在新的浏览器窗口中打开链接 而不是在Electron窗口中打开
    // win.webContents.setWindowOpenHandler(({url}) => {
    //     if (url.startsWith('http')) shell.openExternal(url)
    //     return {action: 'deny'}
    // })

    // win.webContents.on('will-navigate', (event, url) => { }) #344
}


const menu = new Menu()
menu.append(new MenuItem({
    label: '马柯',
    submenu: [{
        label: '触发',
        accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
        click: () => {
            console.log('Electron rocks!')
        }
    }]
}))
menu.append(new MenuItem({
    label: '调试',
    submenu: [{
        label: '控制台',
        role: 'toggleDevTools', // role为预定义的操作 不需要写click
        accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+I' : 'Ctrl+Shift+I',
    }]
}))
menu.append(new MenuItem({
    label: '系统',
    submenu: [
        {
            label: '更换主题',
            accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+T' : 'Ctrl+Shift+T',
            click: () => {
                nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark'
                win?.webContents.send('theme-changed', nativeTheme.themeSource)
            }
        },
        {
            label: '刷新',
            role: 'reload'
        },
        {
            label: '强制刷新',
            role: 'forceReload'
        },
        {
            label: '全屏',
            role: 'togglefullscreen'
        }
    ]
}))

Menu.setApplicationMenu(menu)

// 添加最近使用的文档
const fileName = 'recently-used.md'
fs.writeFile(fileName, 'Lorem Ipsum', () => {
    app.addRecentDocument(path.join(__dirname, fileName))
})

// 加载客户端协议
if (process.defaultApp) {
    // 如果是默认应用程序，则将其设置为默认协议客户端
    // 一般情况下，这是在开发环境中
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('make-electron-vue', process.execPath, [path.resolve(process.argv[1])])
    }
} else {
    // 一般情况下，这是在生产环境中
    app.setAsDefaultProtocolClient('make-electron-vue')
}

async function showNotification() {
    const NOTIFICATION_TITLE = '通知'
    const NOTIFICATION_BODY = '页面加载完成'
    const notification = new Notification({
        title: NOTIFICATION_TITLE,
        body: NOTIFICATION_BODY,
        icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico')
    })
    notification.on('click', () => {
        console.log('Notification clicked')
        win.show()
    })
    notification.show()
}
// 配置全局快捷键
async function globalShortcutRegister() {
    globalShortcut.register('Ctrl+Q', () => {
        if (win) win.close()
    })
}
// 创建托盘图标

async function createTray() {
    const tray = new Tray(nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, 'favicon.ico')))

    tray.on('double-click', () => {
        win?.show()
    })
    // 创建两级菜单
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '退出',
            click: () => {
                app.quit()
            }
        },
        {
            label: '打开',
            click: () => {
                win?.show()
            }
        },
        {
            label: '关于',
            click: () => {
                shell.openExternal('https://www.github.com')
            }
        },
        {
            type: 'separator'
        },
        {
            label: '子菜单',
            submenu: [
                { label: 'Item1', type: 'radio' },
                { label: 'Item2', type: 'radio' },
                { label: 'Item3', type: 'radio', checked: true },
                { label: 'Item4', type: 'radio' }
            ]
        }
    ])
    tray.setToolTip('自定义提示')
    tray.setContextMenu(contextMenu)
}

app.whenReady().then(globalShortcutRegister).then(createWindow).then(showNotification).then(createTray)


app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
        // 如果用户尝试打开第二个应用程序实例，则将其带到前台
        if (win.isMinimized()) win.restore()
        win.focus()
    }
    win?.webContents.send('main-process-message', commandLine)
    win?.webContents.send('main-process-message', workingDirectory)

})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})


// ipcMain处理来自渲染进程的消息
ipcMain.handle('open-win', (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    if (VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
    } else {
        childWindow.loadFile(indexHtml, {hash: arg})
    }
})

ipcMain.handle('theme-switch', (_event, color_type) => {
    nativeTheme.themeSource = color_type
    return nativeTheme.shouldUseDarkColors
})
ipcMain.handle('renderer-to-main', (_event, ...args) => {
    console.log('[Receive Renderer-process message]:', ...args)
    return "over from main"
})