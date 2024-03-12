// import React from 'react';
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
	win.removeMenu();
	// win.loadFile("./src/test/ScollTest.html")
	win.loadURL('http://localhost:3000/');
	win.webContents.openDevTools();
	// app.whenReady().then(createWindow());
	// ！艹为什么一定是这个写法…………上面那个之前明明行的…………
	const runtimeLogFileStream = require("fs");
	// const readLine = require("line-reader");
	// ~~被迫引入模块…………
	ipcMain.once("GetRuntimeLog", DeliverContent)
	// ！最后是改once解决的！！
	runtimeLogFileStream.watch("./src/Monitor/runtimeLog.rlf", DeliverContent)
	function DeliverContent() {
		// ipcMain.("ContentUpdate", runtimeLogFileStream.readFileSync("./src/Monitor/runtimeLog.rlf", "utf8"));
		// let msg = <br />;
		// readLine.eachLine("./src/Monitor/runtimeLog.rlf", (line, last) => {
		// 	msg += line + (<br />);
		// 	win.webContents.send("ContentUpdate", msg)
		// })
		// ！ipcMain不能主动发送消息…………有点复杂…………

		const origContent = runtimeLogFileStream.readFileSync("./src/Monitor/output.rlf", "utf8")
		const lines = origContent.split("\n");
		win.webContents.send("ContentUpdate", lines)
	}
	// DeliverContent();//!在这里调用也没用，react还没创建…………
}
app.on('ready', createWindow);
//!艹注意这个不要放里面…………
