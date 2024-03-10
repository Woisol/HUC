const { app, BrowserWindow, ipcMain } = require('electron');
const createWindow = () => {
	const win = new BrowserWindow({
		width: 1440,
		height: 1024,

		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			// preload: "./preload.js"
		},
	});
	// win.removeMenu();
	// win.loadFile("./src/test/ScollTest.html")
	win.loadURL('http://localhost:3000/');
	win.webContents.openDevTools();
	// app.whenReady().then(createWindow());
	// ！艹为什么一定是这个写法…………上面那个之前明明行的…………
	const runtimeLogFileStream = require("fs")
	ipcMain.on("GetRuntimeLog", DeliverContent)
	function DeliverContent() {
		// ipcMain.("ContentUpdate", runtimeLogFileStream.readFileSync("./src/Monitor/runtimeLog.rlf", "utf8"));
		win.webContents.send("ContentUpdate", runtimeLogFileStream.readFileSync("./src/Monitor/runtimeLog.rlf", "utf8"))
		// ！ipcMain不能主动发送消息…………有点复杂…………
	}
	runtimeLogFileStream.watch("./src/Monitor/runtimeLog.rlf", DeliverContent)
}
app.on('ready', createWindow);
//!艹注意这个不要放里面…………
