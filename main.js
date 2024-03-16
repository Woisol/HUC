// import { spawn } from 'child_process';
// !额不支持ts…………
const spawn = require("child_process").spawn;
const { app, BrowserWindow, ipcMain } = require('electron');
const { event } = require("jquery");
const { monitorEventLoopDelay } = require("perf_hooks");
var win;
var MonitorPcs;
//**----------------------------AppIcons-----------------------------------------------------
var AppIcons = Object.entries(require("./AppIcon.json"));
//**----------------------------AppRunning-----------------------------------------------------
var runningApps = [];
// ！az在electron里面打开没办法初始化文件………………
const createWindow = () => {
	win = new BrowserWindow({
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
}
function UpdateRunningApp(App, Delete = false) {
	if (Delete) {
		if (runningApps.includes(App)) runningApps = runningApps.filter((app) => app !== App);
	}
	else {
		runningApps = [...runningApps, App];
	}
}
app.on('ready', createWindow);
//!艹注意这个不要放里面…………
//**----------------------------ipcMain-----------------------------------------------------
ipcMain.on("UIInited", (event, arg) => {
	MonitorPcs = spawn("./src/Monitor/HUC.exe");
	MonitorPcs.stdout.on("data", (data) => {
		// !这个依然要在定义了以后才能执行………………
		//**----------------------------Console-----------------------------------------------------
		// var datas = d.toString().split("\n");
		// datas.forEach((data) => {
		// 	if (data === "") return;//！原来就是用的return！
		// console.log(`stdout: ${data}`);
		var dataLines = data.toString().split("\n").filter((item) => item !== "");
		win.webContents.send("ContentUpdate", dataLines);
		// });
		// !似乎在这边处理会导致传输过快反应不及时漏掉信息…………去那边处理了…………

		//**----------------------------AppRunning-----------------------------------------------------
		//~~ 为什么不能用foreach…………
		// !woq sb补全…………是forEach！
		dataLines.forEach(cmd => {
			let cmdProps = cmd.toString().split(" ");
			if (cmdProps[2] === "AppStart" || cmdProps[2] === "AppReboot") {
				UpdateRunningApp(cmdProps[3].slice(0, -1));
			}
			else if (cmdProps[2] === "AppEnd") {
				UpdateRunningApp(cmdProps[3].slice(0, -1), true);
			}
			else if (cmdProps[2] === "Monitor") {
				if (cmdProps[3] === "Started\r") {
					win.webContents.send("MonitorStateChange", true);
				}
				else if (cmdProps[3] === "Stop\r") {
					win.webContents.send("MonitorStateChange", false);
				}
			}
		})
		//**----------------------------RunningAppIcons-----------------------------------------------------
		var runningAppsInfo = [];
		runningApps.forEach(app => {
			var tmpAppInfo = [];
			tmpAppInfo.push(app);
			let isPushed = false;
			AppIcons.forEach((appIcon) => {
				if (!isPushed && appIcon[0].toLowerCase() === app.toLowerCase()) {
					tmpAppInfo.push(appIcon[1]);
					isPushed = true;
				}
			})
			if (!isPushed)
				tmpAppInfo.push("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcXVlc3Rpb24iIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPHBhdGggZD0iTTUuMjU1IDUuNzg2YS4yMzcuMjM3IDAgMCAwIC4yNDEuMjQ3aC44MjVjLjEzOCAwIC4yNDgtLjExMy4yNjYtLjI1LjA5LS42NTYuNTQtMS4xMzQgMS4zNDItMS4xMzQuNjg2IDAgMS4zMTQuMzQzIDEuMzE0IDEuMTY4IDAgLjYzNS0uMzc0LjkyNy0uOTY1IDEuMzcxLS42NzMuNDg5LTEuMjA2IDEuMDYtMS4xNjggMS45ODdsLjAwMy4yMTdhLjI1LjI1IDAgMCAwIC4yNS4yNDZoLjgxMWEuMjUuMjUgMCAwIDAgLjI1LS4yNXYtLjEwNWMwLS43MTguMjczLS45MjcgMS4wMS0xLjQ4Ni42MDktLjQ2MyAxLjI0NC0uOTc3IDEuMjQ0LTIuMDU2IDAtMS41MTEtMS4yNzYtMi4yNDEtMi42NzMtMi4yNDEtMS4yNjcgMC0yLjY1NS41OS0yLjc1IDIuMjg2em0xLjU1NyA1Ljc2M2MwIC41MzMuNDI1LjkyNyAxLjAxLjkyNy42MDkgMCAxLjAyOC0uMzk0IDEuMDI4LS45MjcgMC0uNTUyLS40Mi0uOTQtMS4wMjktLjk0LS41ODQgMC0xLjAwOS4zODgtMS4wMDkuOTR6Ii8+Cjwvc3ZnPg==");
			runningAppsInfo.push(tmpAppInfo);
		})
		win.webContents.send("UpdateRunningAppInfo", runningAppsInfo);
	})
	MonitorPcs.on("error", err => {
		win.webContents.send("ContentUpdate", err.toString());
		win.webContents.send("MonitorStateChange", false);
		console.log(`Monitor Failed: ${err}`);
	})
	// ！艹………………在react里面设置的
	MonitorPcs.on("exit", arg => {
		win.webContents.send("ContentUpdate", arg.toString());
		win.webContents.send("MonitorStateChange", false);
		console.log(`Monitor Exit: ${arg}`);
	})
})
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
//**----------------------------AppIcons-----------------------------------------------------
// ！同时不要忘记加了这个以后只有启动第一次才能调试………………………………
ipcMain.on("GetAppIcons", (event, arg) => {
	AppIcons = require("./AppIcon.json");
	event.reply("GetAppIcons", Object.entries(AppIcons))
	// ！艹啊啊啊啊啊啊啊啊啊啊啊
	// ！不要以为debug显示的是“数组”就直接传过去啊啊
	// ！是json的{}不是数组的[]！！！！！！
})