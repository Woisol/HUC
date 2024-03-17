// import { spawn } from 'child_process';
// !额不支持ts…………
const spawn = require("child_process").spawn;
const { app, BrowserWindow, ipcMain, MenuItem } = require('electron');
const $ = require("jquery");
//##----------------------------Initialize-----------------------------------------------------
var win;
var MonitorPcs;
var appConfig = Object.entries(require("./config.json"));
//**----------------------------AppInfo-----------------------------------------------------
var AppInfo = Object.entries(require("./AppInfo.json"));
//**----------------------------AppRunning-----------------------------------------------------
var runningApps = [];
var mntApps = [];
var RunTimeDB = require("mysql");
//**----------------------------ContexMenu-----------------------------------------------------
var ContextMenu_Fresh, ContextMenu_MainSwitch, ContextMenu_Console, ContextMenu_RunTime, ContextMenu_LastSeven
const { Menu } = require("electron/main");
var connection = RunTimeDB.createConnection({
	host: "localhost",
	user: "root",
	password: "60017089",
	database: appConfig[2][1],
	port: 3306
});
connection.connect();
connection.query(`SELECT TABLE_NAME FROM information_schema.tables WHERE TABLE_SCHEMA = ?;`, [appConfig[2][1]], function (err, rows, fields) {
	// ！异步的！！不需要Asyn
	// dtd注意可能有注入攻击…………
	if (err !== null) {
		//!这里为什么为null了还进得来…………
		console.log(`Query Error: ${err}`);
		return;
	}
	mntApps = [];
	// !这里不清掉大问题………………
	rows.forEach(RowDataPacket => {
		mntApps.push(RowDataPacket.TABLE_NAME);
	})
})
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
	//**----------------------------ContextMenu-----------------------------------------------------
	// win.webContents.on("context-menu", (event, params) => {
	// 	// const { } = params;
	// 	ContextMenu_Fresh.popup();
	// })
	// let contextMenuWin = new BrowserWindow({
	// 	width: 50,
	// 	height: 100,
	// });
	ContextMenu_Fresh = Menu.buildFromTemplate([
		{
			label: "刷新",
			accelerator: "F5",
			role: "reload"
			// 	click: (menuItem, browserWindow, event) => {
			// 		switch (menuItem)
			// }
		}])

	ContextMenu_MainSwitch = Menu.buildFromTemplate([
		{
			label: "重启",
			click: (menuItem, browserWindow, event) => {
				MonitorPcs.kill()
				MonitorInit();
				// !注意不能直接spawn完事………………之前的事件都要加回来！
				// !不知道为什么reload后无法重启…………只有在reload前这个功能正常
			}
			// 	click: (menuItem, browserWindow, event) =ContextMenu_RunningApp> {
			// 		switch (menuItem)
			// }
		}])
	ContextMenu_Console = Menu.buildFromTemplate([
		{
			label: "清空",
			click: (menuItem, browserWindow, event) => {
				win.webContents.send("ConsoleClear")
			}
		}])
	ContextMenu_RunTime = Menu.buildFromTemplate([
		{
			label: "刷新今日数据",
			click: (menuItem, browserWindow, event) => {
				UpdateRunTime(new Date());
			}
		}])
	ContextMenu_LastSeven = Menu.buildFromTemplate([
		{
			label: "刷新",
			click: (menuItem, browserWindow, event) => {
				UpdateLastSeven()
			}
		}])
	//**----------------------------ipcMain-----------------------------------------------------
	// $("#MainSwitchImg").on("contextmenu", (event, params) => {
	// 	const { } = params;
	// 	ContextMenu_MainSwitch.popup();
	// })
	// !?jQuery requires a windows with a document?
	// window.getElementById("MainSwitchImg").addEventListener("contextmenu", () => {
	// 	ContextMenu_MainSwitch.popup();
	// })
	// ！注意主进程和渲染进程的DOM是隔离的！不能获取！
	ipcMain.on("ContextMenu_MainSwitch", (event, arg) => {
		event.preventDefault();
		ContextMenu_MainSwitch.popup();
	})
	ipcMain.on("ContextMenu_Console", (event, arg) => {
		event.preventDefault();
		ContextMenu_Console.popup();
	})
	ipcMain.on("ContextMenu_RunTime", (event, arg) => {
		event.preventDefault();
		ContextMenu_RunTime.popup();
	})
	ipcMain.on("ContextMenu_LastSeven", (event, arg) => {
		event.preventDefault();
		ContextMenu_LastSeven.popup();
	})

	// !会和单独元素的右键彩蛋冲突…………
}
function UpdateRunningApp(App, Delete = false) {
	if (Delete) {
		if (runningApps.includes(App)) runningApps = runningApps.filter((app) => app !== App);
	}
	else {
		if (!runningApps.includes(App)) runningApps = [...runningApps, App];
	}
}
app.on('ready', createWindow);
//##----------------------------Event-----------------------------------------------------
ipcMain.on("UpdateRunTime", (event, arg) => {
	UpdateRunTime(arg);
})
// ！az在electron里面打开没办法初始化文件………………
//!艹注意这个不要放里面…………
//**----------------------------UIInit-----------------------------------------------------
ipcMain.on("UIInited", (event, arg) => {
	MonitorInit();
	//**---------------------------------------------------------------------------------
	UpdateRunTime(new Date())
	UpdateLastSeven();

})
//**----------------------------Monitor-----------------------------------------------------
function MonitorInit() {
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
			AppInfo.forEach((appInfo) => {
				if (!isPushed && appInfo[0].toLowerCase() === app.toLowerCase()) {
					tmpAppInfo.push(appInfo[1].Icon);
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
		MonitorPcs.stdin.write("Monitor off\n")
		win.webContents.send("ContentUpdate", `Monitor Exit: ${arg}`);
		win.webContents.send("MonitorStateChange", false);
		console.log(`Monitor Exit: ${arg}`);
		// setTimeout(() => { if ((MonitorPcs = spawn("./src/Monitor/HUC.exe")) !== null) win.webContents.send("ContentUpdate", "Monitor Reboot Successfully!"); }, 1000)
	})
}
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
ipcMain.on("MonitorPcsStdinWrite", (event, arg) => {
	MonitorPcs.stdin.write(`${arg}\n`);
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
// ipcMain.on("GetAppIcons", (event, arg) => {
// 	AppIcons = require("./AppIcon.json");
// 	let ow = Object.entries(AppIcons);
// 	event.reply("GetAppIcons", Object.entries(AppIcons))
// 	// ！艹啊啊啊啊啊啊啊啊啊啊啊
// 	// ！不要以为debug显示的是“数组”就直接传过去啊啊
// 	// ！是json的{}不是数组的[]！！！！！！
// })
//**----------------------------RunTimeShow-----------------------------------------------------
function UpdateRunTime(date) {
	// console.log("Enter Func UpdateRunTime");
	// if (connection.state == "disconnected")
	// ！mysql模块居然是旧版的…………报错说客户端不支持
	// !上网查了说是改plugin，在sqlyog里面改了以后突然登不上
	// !要被吓死还好看到网上，其实这个时候是没有密码，输入密码直接回车就能进了，后续再改密码就行
	// !相关：报错mysql Client does not support authentication protocol requested by server; consider upgrading MySQL client
	// !ERROR 1045(28000)就是密码错误或者服务器关闭之类的无法登录
	// !新版caching_sha2_password旧版mysql_native_password


	// ！艹！！！！终于定位问题了………………………………一直以为执行了两次Update函数，还非常好奇为什么query函数执行完后面为什么断点没用了
	// ！其实本质就是回调………………太慢了导致顺序都反了………………搞一堆log都没用………………………………
	let runTimeInfo = [];
	mntApps.forEach(mntApp => {
		let isPushed = false;
		let tmpRunTimeInfo = [];
		tmpRunTimeInfo.push(mntApp);
		AppInfo.forEach((appInfo) => {
			if (!isPushed && appInfo[0].toLowerCase() === mntApp.toLowerCase()) {
				tmpRunTimeInfo.push(appInfo[1].Class);
				tmpRunTimeInfo.push(appInfo[1].Color);
				tmpRunTimeInfo.push(appInfo[1].Icon);
				isPushed = true;
			}
		})
		if (!isPushed) {
			tmpRunTimeInfo.push("None");
			tmpRunTimeInfo.push("#BFDBFE");
			tmpRunTimeInfo.push("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwLjAwMDAwMCIgaGVpZ2h0PSI0MDAuMDAwMDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+Cgk8ZGVzYz4KCQkJQ3JlYXRlZCB3aXRoIFBpeHNvLgoJPC9kZXNjPgoJPGRlZnM+CgkJPGZpbHRlciBpZD0iZmlsdGVyXzcwXzE4NF9kZCIgeD0iMjIuNzk0OTIyIiB5PSIzNy4wMDAwMDAiIHdpZHRoPSIzNTQuNDEwMTU2IiBoZWlnaHQ9IjI5Ni43NTAwMDAiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KCQkJPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KCQkJPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CgkJCTxmZU9mZnNldCBkeD0iMCIgZHk9IjQiLz4KCQkJPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMS4zMzMzMyIvPgoJCQk8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiIGsyPSItMSIgazM9IjEiLz4KCQkJPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPgoJCQk8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdF9kcm9wU2hhZG93XzEiLz4KCQkJPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3RfZHJvcFNoYWRvd18xIiByZXN1bHQ9InNoYXBlIi8+CgkJPC9maWx0ZXI+CgkJPGZpbHRlciBpZD0iZmlsdGVyXzcwXzE4OF9kZCIgeD0iMjE2LjAwMDAwMCIgeT0iMjcwLjAwMDAwMCIgd2lkdGg9IjE4OC4wMDAwMDAiIGhlaWdodD0iODguMDAwMDAwIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CgkJCTxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CgkJCTxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgoJCQk8ZmVPZmZzZXQgZHg9IjAiIGR5PSI0Ii8+CgkJCTxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEuMzMzMzMiLz4KCQkJPGZlQ29tcG9zaXRlIGluMj0iaGFyZEFscGhhIiBvcGVyYXRvcj0ib3V0IiBrMj0iLTEiIGszPSIxIi8+CgkJCTxmZUNvbG9yTWF0cml4IHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjI1IDAiLz4KCQkJPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3RfZHJvcFNoYWRvd18xIi8+CgkJCTxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0X2Ryb3BTaGFkb3dfMSIgcmVzdWx0PSJzaGFwZSIvPgoJCTwvZmlsdGVyPgoJCTxjbGlwUGF0aCBpZD0iY2xpcDcwXzE4NiI+CgkJCTxyZWN0IGlkPSLnlLvmnb8gMTgiIHdpZHRoPSI0MDAuMDAwMDAwIiBoZWlnaHQ9IjQwMC4wMDAwMDAiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAiLz4KCQk8L2NsaXBQYXRoPgoJPC9kZWZzPgoJPHJlY3QgaWQ9IueUu+advyAxOCIgd2lkdGg9IjQwMC4wMDAwMDAiIGhlaWdodD0iNDAwLjAwMDAwMCIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwIi8+Cgk8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDcwXzE4NikiPgoJCTxnIGZpbHRlcj0idXJsKCNmaWx0ZXJfNzBfMTg0X2RkKSI+CgkJCTxwYXRoIGlkPSLlt67pm4YiIGQ9Ik0yNi43OTQ5IDMyNS43NUwyMDAgMzdMMzczLjIwNSAzMjUuNzVMMjYuNzk0OSAzMjUuNzVaTTIwMCAxODBDMTYxLjM0IDE4MCAxMzAgMTk3LjkwOSAxMzAgMjIwQzEzMCAyNDIuMDkxIDE2MS4zNCAyNjAgMjAwIDI2MEMyMzguNjYgMjYwIDI3MCAyNDIuMDkxIDI3MCAyMjBDMjcwIDE5Ny45MDkgMjM4LjY2IDE4MCAyMDAgMTgwWiIgY2xpcC1ydWxlPSJldmVub2RkIiBmaWxsPSIjNDQ0NDQ0IiBmaWxsLW9wYWNpdHk9IjEuMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KCQk8L2c+CgkJPGVsbGlwc2UgaWQ9IuakreWchiAyIiBjeD0iMjAwLjAwMDAwMCIgY3k9IjIxOS40Mjg1NzQiIHJ4PSIyMC4wMDAwMDAiIHJ5PSIxMS40Mjg1NzIiIGZpbGw9IiM0NDQ0NDQiIGZpbGwtb3BhY2l0eT0iMS4wMDAwMDAiLz4KCQk8ZyBmaWx0ZXI9InVybCgjZmlsdGVyXzcwXzE4OF9kZCkiPgoJCQk8cmVjdCBpZD0i55+p5b2iIDI3IiB4PSIyMjAuMDAwMDAwIiB5PSIyNzAuMDAwMDAwIiByeD0iMjAuMDAwMDAwIiB3aWR0aD0iMTgwLjAwMDAwMCIgaGVpZ2h0PSI4MC4wMDAwMDAiIGZpbGw9IiNEREREREQiIGZpbGwtb3BhY2l0eT0iMS4wMDAwMDAiLz4KCQk8L2c+CgkJPHJlY3QgaWQ9IuefqeW9oiAyNyIgeD0iMjIwLjUwMDAwMCIgeT0iMjcwLjUwMDAwMCIgcng9IjIwLjAwMDAwMCIgd2lkdGg9IjE3OS4wMDAwMDAiIGhlaWdodD0iNzkuMDAwMDAwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1vcGFjaXR5PSIxLjAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIxLjAwMDAwMCIvPgoJCTxwYXRoIGlkPSJBcHAiIGQ9Ik0yNTcuMDk5IDMyOEwyNTEuMDgzIDMyOEwyNjcuMDIxIDI4MS4wMzFMMjczLjYxNSAyODEuMDMxTDI4OS41NTIgMzI4TDI4My4yODcgMzI4TDI3OC44MDIgMzEzLjY1NkwyNjEuNjQ2IDMxMy42NTZMMjU3LjA5OSAzMjhaTTI3MC4wOTkgMjg1Ljg5MUMyNjguNjMgMjkxLjM5MSAyNjcuMDgzIDI5Ni40NTMgMjY1LjQyNyAzMDEuNzY2TDI2My4xMTUgMzA4LjkyMkwyNzcuMzMzIDMwOC45MjJMMjc1LjA4MyAzMDEuNzY2QzI3My4zNjUgMjk2LjQ1MyAyNzEuODggMjkxLjMyOCAyNzAuMzQ5IDI4NS44OTFMMjcwLjA5OSAyODUuODkxWk0zMDEuNDYzIDM0Mi42NTZMMjk1LjYzNSAzNDIuNjU2TDI5NS42MzUgMjkzLjI1TDMwMC40MzIgMjkzLjI1TDMwMC45NDcgMjk3LjIxOUwzMDEuMTM1IDI5Ny4yMTlDMzA0LjI3NSAyOTQuNjU2IDMwOC4xODIgMjkyLjM1OSAzMTIuMjEzIDI5Mi4zNTlDMzIxLjE2NiAyOTIuMzU5IDMyNi4wMjUgMjk5LjM5MSAzMjYuMDI1IDMxMC4wNzhDMzI2LjAyNSAzMjEuOTg0IDMxOC45MzIgMzI4LjgyOCAzMTAuOTMyIDMyOC44MjhDMzA3Ljc5MSAzMjguODI4IDMwNC40NjMgMzI3LjM1OSAzMDEuMzIyIDMyNC43OTdMMzAxLjQ2MyAzMzAuODc1TDMwMS40NjMgMzQyLjY1NlpNMzQxLjE0MyAzNDIuNjU2TDMzNS4zMTUgMzQyLjY1NkwzMzUuMzE1IDI5My4yNUwzNDAuMTEyIDI5My4yNUwzNDAuNjI3IDI5Ny4yMTlMMzQwLjgxNSAyOTcuMjE5QzM0My45NTUgMjk0LjY1NiAzNDcuODYyIDI5Mi4zNTkgMzUxLjg5MyAyOTIuMzU5QzM2MC44NDYgMjkyLjM1OSAzNjUuNzA1IDI5OS4zOTEgMzY1LjcwNSAzMTAuMDc4QzM2NS43MDUgMzIxLjk4NCAzNTguNjEyIDMyOC44MjggMzUwLjYxMiAzMjguODI4QzM0Ny40NzEgMzI4LjgyOCAzNDQuMTQzIDMyNy4zNTkgMzQxLjAwMiAzMjQuNzk3TDM0MS4xNDMgMzMwLjg3NUwzNDEuMTQzIDM0Mi42NTZaTTMwMS40NjMgMzIwLjMxMkMzMDQuNTg4IDMyMy4wMTYgMzA3LjY2NiAzMjMuOTY5IDMwOS45NjMgMzIzLjk2OUMzMTUuNzI4IDMyMy45NjkgMzE5Ljk0NyAzMTguNzgxIDMxOS45NDcgMzEwLjE0MUMzMTkuOTQ3IDMwMi40NjkgMzE3LjM4NSAyOTcuMjgxIDMxMC44MDcgMjk3LjI4MUMzMDcuODUzIDI5Ny4yODEgMzA0Ljg1MyAyOTguOTM4IDMwMS40NjMgMzAyLjA3OEwzMDEuNDYzIDMyMC4zMTJaTTM0MS4xNDMgMzIwLjMxMkMzNDQuMjY4IDMyMy4wMTYgMzQ3LjM0NiAzMjMuOTY5IDM0OS42NDMgMzIzLjk2OUMzNTUuNDA4IDMyMy45NjkgMzU5LjYyNyAzMTguNzgxIDM1OS42MjcgMzEwLjE0MUMzNTkuNjI3IDMwMi40NjkgMzU3LjA2NSAyOTcuMjgxIDM1MC40ODcgMjk3LjI4MUMzNDcuNTMzIDI5Ny4yODEgMzQ0LjUzMyAyOTguOTM4IDM0MS4xNDMgMzAyLjA3OEwzNDEuMTQzIDMyMC4zMTJaIiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjEuMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KCTwvZz4KPC9zdmc+Cg==");
		}
		connection.query(`SELECT * FROM ${mntApp} WHERE StartTime${toQueryString(date, 1)};`, function (error, res) {
			if (error !== null) {
				console.log(`Failed to Read DB: ${error}`)
				return;
			}
			let tmpTime = [];
			res.forEach(row => {
				tmpTime.push([row.StartTime, row.EndTime]);
			})
			// let tmpTime = [];
			// res.forEach(row => {
			// 	let tmpStarMin = row.StartTime.getHours() * 60 + row.StartTime.getMinutes() + row.StartTime.getSeconds() / 60 - 240;
			// 	let tmpEndmin = row.EndTime.getHours() * 60 + row.EndTime.getMinutes() + row.EndTime.getSeconds() / 60 - 240;
			// 	tmpTime.push([tmpStarMin > 0 ? tmpStarMin : tmpStarMin + 1440, tmpEndmin > 0 ? tmpEndmin : tmpEndmin + 1440])
			// })
			tmpRunTimeInfo.push(tmpTime);
			runTimeInfo.push(tmpRunTimeInfo);
			win.webContents.send("UpdateRunTime", [runTimeInfo, date]);
		})
		// connection.end();
	});
}
function toQueryString(startDate, days) {
	let former = startDate;
	let latter = new Date();
	latter.setDate(former.getDate() + days);
	return ` BETWEEN '${former.getFullYear()}-${former.getMonth() + 1}-${former.getDate()} 04:00:00' AND '${latter.getFullYear()}-${latter.getMonth() + 1}-${latter.getDate()} 04:00:00'`
}
//**----------------------------LastSeven-----------------------------------------------------
ipcMain.on("UpdateLastSeven", (event, arg) => {
	UpdateLastSeven(arg);
})
function UpdateLastSeven() {
	// if (connection.state == "disconnected")
	// 	connection.connect();
	let today = new Date();
	var result = [];
	[7, 6, 5, 4, 3, 2, 1].map((value, index) => {
		// !虽然按理来说应该是6~0…………但是不知道为什么就是慢了一天…………面向结果编程了
		let totalMin = 0;
		let i = 0;
		mntApps.forEach(mntApp => {
			console.log(`SELECT * FROM ${mntApp} WHERE StartTime${toQueryString(new Date(today.getTime() - value * 24 * 60 * 60 * 1000), 1)};`)
			connection.query(`SELECT * FROM ${mntApp} WHERE StartTime${toQueryString(new Date(today.getTime() - value * 24 * 60 * 60 * 1000), 1)};`, function (error, res) {
				// !算了如果要用复杂的query语句也是要用mntApps.forEach的…………先不搞了
				if (error !== null) {
					console.log(`Failed to Read DB: ${error}`)
					return;
				}
				res.forEach(row => {
					totalMin += row.LastTime;
				})
				if (++i > mntApps.length - 1) {
					result.push(totalMin / 60);
					if (value === 1)
						win.webContents.send("UpdateLastSeven", result);
					// !md变量乱命名了为………………传错了都不知道………………
				}
			})
		})
		// !艹这个异步好烦啊………………
	})
}