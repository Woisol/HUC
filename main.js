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
				tmpAppInfo.push("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwLjAwMDAwMCIgaGVpZ2h0PSI0MDAuMDAwMDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+Cgk8ZGVzYz4KCQkJQ3JlYXRlZCB3aXRoIFBpeHNvLgoJPC9kZXNjPgoJPGRlZnM+CgkJPGZpbHRlciBpZD0iZmlsdGVyXzcwXzE4NF9kZCIgeD0iMjIuNzk0OTIyIiB5PSIzNy4wMDAwMDAiIHdpZHRoPSIzNTQuNDEwMTU2IiBoZWlnaHQ9IjI5Ni43NTAwMDAiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KCQkJPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KCQkJPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CgkJCTxmZU9mZnNldCBkeD0iMCIgZHk9IjQiLz4KCQkJPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMS4zMzMzMyIvPgoJCQk8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiIGsyPSItMSIgazM9IjEiLz4KCQkJPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPgoJCQk8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdF9kcm9wU2hhZG93XzEiLz4KCQkJPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3RfZHJvcFNoYWRvd18xIiByZXN1bHQ9InNoYXBlIi8+CgkJPC9maWx0ZXI+CgkJPGZpbHRlciBpZD0iZmlsdGVyXzcwXzE4OF9kZCIgeD0iMjE2LjAwMDAwMCIgeT0iMjcwLjAwMDAwMCIgd2lkdGg9IjE4OC4wMDAwMDAiIGhlaWdodD0iODguMDAwMDAwIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CgkJCTxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CgkJCTxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgoJCQk8ZmVPZmZzZXQgZHg9IjAiIGR5PSI0Ii8+CgkJCTxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEuMzMzMzMiLz4KCQkJPGZlQ29tcG9zaXRlIGluMj0iaGFyZEFscGhhIiBvcGVyYXRvcj0ib3V0IiBrMj0iLTEiIGszPSIxIi8+CgkJCTxmZUNvbG9yTWF0cml4IHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjI1IDAiLz4KCQkJPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3RfZHJvcFNoYWRvd18xIi8+CgkJCTxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0X2Ryb3BTaGFkb3dfMSIgcmVzdWx0PSJzaGFwZSIvPgoJCTwvZmlsdGVyPgoJCTxjbGlwUGF0aCBpZD0iY2xpcDcwXzE4NiI+CgkJCTxyZWN0IGlkPSLnlLvmnb8gMTgiIHdpZHRoPSI0MDAuMDAwMDAwIiBoZWlnaHQ9IjQwMC4wMDAwMDAiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAiLz4KCQk8L2NsaXBQYXRoPgoJPC9kZWZzPgoJPHJlY3QgaWQ9IueUu+advyAxOCIgd2lkdGg9IjQwMC4wMDAwMDAiIGhlaWdodD0iNDAwLjAwMDAwMCIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwIi8+Cgk8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDcwXzE4NikiPgoJCTxnIGZpbHRlcj0idXJsKCNmaWx0ZXJfNzBfMTg0X2RkKSI+CgkJCTxwYXRoIGlkPSLlt67pm4YiIGQ9Ik0yNi43OTQ5IDMyNS43NUwyMDAgMzdMMzczLjIwNSAzMjUuNzVMMjYuNzk0OSAzMjUuNzVaTTIwMCAxODBDMTYxLjM0IDE4MCAxMzAgMTk3LjkwOSAxMzAgMjIwQzEzMCAyNDIuMDkxIDE2MS4zNCAyNjAgMjAwIDI2MEMyMzguNjYgMjYwIDI3MCAyNDIuMDkxIDI3MCAyMjBDMjcwIDE5Ny45MDkgMjM4LjY2IDE4MCAyMDAgMTgwWiIgY2xpcC1ydWxlPSJldmVub2RkIiBmaWxsPSIjNDQ0NDQ0IiBmaWxsLW9wYWNpdHk9IjEuMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KCQk8L2c+CgkJPGVsbGlwc2UgaWQ9IuakreWchiAyIiBjeD0iMjAwLjAwMDAwMCIgY3k9IjIxOS40Mjg1NzQiIHJ4PSIyMC4wMDAwMDAiIHJ5PSIxMS40Mjg1NzIiIGZpbGw9IiM0NDQ0NDQiIGZpbGwtb3BhY2l0eT0iMS4wMDAwMDAiLz4KCQk8ZyBmaWx0ZXI9InVybCgjZmlsdGVyXzcwXzE4OF9kZCkiPgoJCQk8cmVjdCBpZD0i55+p5b2iIDI3IiB4PSIyMjAuMDAwMDAwIiB5PSIyNzAuMDAwMDAwIiByeD0iMjAuMDAwMDAwIiB3aWR0aD0iMTgwLjAwMDAwMCIgaGVpZ2h0PSI4MC4wMDAwMDAiIGZpbGw9IiNEREREREQiIGZpbGwtb3BhY2l0eT0iMS4wMDAwMDAiLz4KCQk8L2c+CgkJPHJlY3QgaWQ9IuefqeW9oiAyNyIgeD0iMjIwLjUwMDAwMCIgeT0iMjcwLjUwMDAwMCIgcng9IjIwLjAwMDAwMCIgd2lkdGg9IjE3OS4wMDAwMDAiIGhlaWdodD0iNzkuMDAwMDAwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1vcGFjaXR5PSIxLjAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIxLjAwMDAwMCIvPgoJCTxwYXRoIGlkPSJBcHAiIGQ9Ik0yNTcuMDk5IDMyOEwyNTEuMDgzIDMyOEwyNjcuMDIxIDI4MS4wMzFMMjczLjYxNSAyODEuMDMxTDI4OS41NTIgMzI4TDI4My4yODcgMzI4TDI3OC44MDIgMzEzLjY1NkwyNjEuNjQ2IDMxMy42NTZMMjU3LjA5OSAzMjhaTTI3MC4wOTkgMjg1Ljg5MUMyNjguNjMgMjkxLjM5MSAyNjcuMDgzIDI5Ni40NTMgMjY1LjQyNyAzMDEuNzY2TDI2My4xMTUgMzA4LjkyMkwyNzcuMzMzIDMwOC45MjJMMjc1LjA4MyAzMDEuNzY2QzI3My4zNjUgMjk2LjQ1MyAyNzEuODggMjkxLjMyOCAyNzAuMzQ5IDI4NS44OTFMMjcwLjA5OSAyODUuODkxWk0zMDEuNDYzIDM0Mi42NTZMMjk1LjYzNSAzNDIuNjU2TDI5NS42MzUgMjkzLjI1TDMwMC40MzIgMjkzLjI1TDMwMC45NDcgMjk3LjIxOUwzMDEuMTM1IDI5Ny4yMTlDMzA0LjI3NSAyOTQuNjU2IDMwOC4xODIgMjkyLjM1OSAzMTIuMjEzIDI5Mi4zNTlDMzIxLjE2NiAyOTIuMzU5IDMyNi4wMjUgMjk5LjM5MSAzMjYuMDI1IDMxMC4wNzhDMzI2LjAyNSAzMjEuOTg0IDMxOC45MzIgMzI4LjgyOCAzMTAuOTMyIDMyOC44MjhDMzA3Ljc5MSAzMjguODI4IDMwNC40NjMgMzI3LjM1OSAzMDEuMzIyIDMyNC43OTdMMzAxLjQ2MyAzMzAuODc1TDMwMS40NjMgMzQyLjY1NlpNMzQxLjE0MyAzNDIuNjU2TDMzNS4zMTUgMzQyLjY1NkwzMzUuMzE1IDI5My4yNUwzNDAuMTEyIDI5My4yNUwzNDAuNjI3IDI5Ny4yMTlMMzQwLjgxNSAyOTcuMjE5QzM0My45NTUgMjk0LjY1NiAzNDcuODYyIDI5Mi4zNTkgMzUxLjg5MyAyOTIuMzU5QzM2MC44NDYgMjkyLjM1OSAzNjUuNzA1IDI5OS4zOTEgMzY1LjcwNSAzMTAuMDc4QzM2NS43MDUgMzIxLjk4NCAzNTguNjEyIDMyOC44MjggMzUwLjYxMiAzMjguODI4QzM0Ny40NzEgMzI4LjgyOCAzNDQuMTQzIDMyNy4zNTkgMzQxLjAwMiAzMjQuNzk3TDM0MS4xNDMgMzMwLjg3NUwzNDEuMTQzIDM0Mi42NTZaTTMwMS40NjMgMzIwLjMxMkMzMDQuNTg4IDMyMy4wMTYgMzA3LjY2NiAzMjMuOTY5IDMwOS45NjMgMzIzLjk2OUMzMTUuNzI4IDMyMy45NjkgMzE5Ljk0NyAzMTguNzgxIDMxOS45NDcgMzEwLjE0MUMzMTkuOTQ3IDMwMi40NjkgMzE3LjM4NSAyOTcuMjgxIDMxMC44MDcgMjk3LjI4MUMzMDcuODUzIDI5Ny4yODEgMzA0Ljg1MyAyOTguOTM4IDMwMS40NjMgMzAyLjA3OEwzMDEuNDYzIDMyMC4zMTJaTTM0MS4xNDMgMzIwLjMxMkMzNDQuMjY4IDMyMy4wMTYgMzQ3LjM0NiAzMjMuOTY5IDM0OS42NDMgMzIzLjk2OUMzNTUuNDA4IDMyMy45NjkgMzU5LjYyNyAzMTguNzgxIDM1OS42MjcgMzEwLjE0MUMzNTkuNjI3IDMwMi40NjkgMzU3LjA2NSAyOTcuMjgxIDM1MC40ODcgMjk3LjI4MUMzNDcuNTMzIDI5Ny4yODEgMzQ0LjUzMyAyOTguOTM4IDM0MS4xNDMgMzAyLjA3OEwzNDEuMTQzIDMyMC4zMTJaIiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjEuMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KCTwvZz4KPC9zdmc+Cg==");
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
		// win.webContents.send("MonitorStateChange", true);
		// ！\n别忘了不然没用艹
		// !啊啊啊啊啊啊你个s这里写到stdout啦！！！！！！！！！
	}
	else {
		MonitorPcs.stdin.write("Monitor off\n");
		// win.webContents.send("MonitorStateChange", false);
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