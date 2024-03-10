const { app, BrowserWindow, ipcMain } = require('electron');
const createWindow = () => {
	const win = new BrowserWindow({
		width: 1440,
		height: 1024,

		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			// preload: "./preload.js"
			// !啊所以为什么不用preload了？是因为上面关了上下文隔离？确实…………而且再打开以后react无法使用windows.require了…………
		},
	});
	// win.removeMenu();
	// win.loadFile("./src/test/ScollTest.html")
	win.loadURL('http://localhost:3000/');
	win.webContents.openDevTools();
	// app.whenReady().then(createWindow());
	// ！艹为什么一定是这个写法…………上面那个之前明明行的…………
	const runtimeLogFileStream = require("fs")
	ipcMain.once("GetRuntimeLog", DeliverContent)
	// ！最后是改once解决的！！
	function DeliverContent() {
		// ipcMain.("ContentUpdate", runtimeLogFileStream.readFileSync("./src/Monitor/runtimeLog.rlf", "utf8"));
		win.webContents.send("ContentUpdate", runtimeLogFileStream.readFileSync("./src/Monitor/runtimeLog.rlf", "utf8"))
		// ！ipcMain不能主动发送消息…………有点复杂…………
	}
	DeliverContent();//!不能在这里调用，react还没创建…………
	runtimeLogFileStream.watch("./src/Monitor/runtimeLog.rlf", DeliverContent)
}
app.on('ready', createWindow);
//!艹注意这个不要放里面…………
