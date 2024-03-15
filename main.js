// import React from 'react';
// import { spawn } from 'child_process';
const spawn = require("child_process").spawn;
const { app, BrowserWindow, ipcMain } = require('electron');
var MonitorPcs = spawn("./src/Monitor/HUC.exe");
// ！az在electron里面打开没办法初始化文件………………
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
	// const runtimeLogFileStream = require("fs");
	// const readLine = require("line-reader");
	// ~~被迫引入模块…………
	// ipcMain.once("GetRuntimeLog", DeliverContent)
	// ！最后是改once解决的！！
	// runtimeLogFileStream.watch("./output.rlf", DeliverContent)
	// !真奇怪，这个watch必须要vsc获得了焦点才能即时反应…………其它应用都不行…………希望实际打包以后能实现吧…………
	function DeliverContent() {
		// ipcMain.("ContentUpdate", runtimeLogFileStream.readFileSync("./src/Monitor/runtimeLog.rlf", "utf8"));
		// let msg = <br />;
		// readLine.eachLine("./src/Monitor/runtimeLog.rlf", (line, last) => {
		// 	msg += line + (<br />);
		// 	win.webContents.send("ContentUpdate", msg)
		// })
		// ！ipcMain不能主动发送消息…………有点复杂…………

		// **原方案：读取文件
		// const origContent = runtimeLogFileStream.readFileSync("./output.rlf", "utf8")
		// const lines = origContent.split("\n");
		// win.webContents.send("ContentUpdate", lines)
		// **现方案：读取监视器进程输出
	}
	// DeliverContent();//!在这里调用也没用，react还没创建…………
	MonitorPcs.stdout.on("data", (data) => {
		// var datas = d.toString().split("\n");
		// datas.forEach((data) => {
		// 	if (data === "") return;//！原来就是用的return！
		// console.log(`stdout: ${data}`);
		win.webContents.send("ContentUpdate", data.toString());
		// });
		// !似乎在这边处理会导致传输过快反应不及时漏掉信息…………去那边处理了…………
	})
}
app.on('ready', createWindow);
//!艹注意这个不要放里面…………
ipcMain.on("MonitorStateChange", (event, arg) => {
	console.log(`MonitorStateChange: ${arg}`);
	if (arg) {
		// MonitorPcs = spawn("./src/Monitor/Nodejs Child_Process Test.exe");
		MonitorPcs.stdin.write("Monitor on\n");
		// ！\n别忘了不然没用艹
		// !啊啊啊啊啊啊你个s这里写到stdout啦！！！！！！！！！
	}
	else {
		MonitorPcs.stdin.write("Monitor off\n");
	}
})
// MonitorPcs.on("message", (msg, sendHendle) => {
// 	console.log(`MonitorPcs: ${msg}`);
// })
// MonitorPcs.stdout.on("data", (data) => {
// 	console.log(`stdout: ${data}`);
// 	// !可以证明在运行…………但是就是无法写入文件…………
// })
