// import { spawn } from 'child_process';
// import Logo from "../public/Logo.ico"
// !Cannot use import outside of moudle…………
// !额不支持ts…………
const spawn = require("child_process").spawn;
const { app, BrowserWindow, ipcMain, Tray, nativeTheme, ipcRenderer } = require('electron');
const $ = require("jquery");
const path = require("path");
const url = require("url");
const iconv = require("iconv-lite");
const fs = require('fs');
//##----------------------------Initialize-----------------------------------------------------
const VERSION = "1.0"
var win, tray, isToQuit = false;
var MonitorPcs, MonitorState = true;
var appConfig = require(path.join(process.cwd(), "config.json"));
//**----------------------------AppInfo-----------------------------------------------------
var AppInfo = require(path.join(process.cwd(), "AppInfo.json"));
//**----------------------------AppRunning-----------------------------------------------------
var runningApps = [];
var mntApps = [];
// !这玩意注意是mysql不是sql（和sql2搞混了）
var RunTimeDB = require("mysql");
var today = adjudgeDateBy4(new Date());
//**----------------------------ContexMenu-----------------------------------------------------
var ContextMenu_Fresh, ContextMenu_MainSwitch, ContextMenu_Console, ContextMenu_RunTime, ContextMenu_LastSeven, ContextMenu_EditAppInfo
const { Menu } = require("electron");
// !用sql2/promise就是pool而不是原来的connection了（虽然也有）
var connection = RunTimeDB.createConnection({
	host: "localhost",
	user: appConfig.SQLUser,
	password: appConfig.SQLPassword,
	database: appConfig.DATABASE_NAME,
	port: appConfig.SQLPort
});
// ！啊啊？？？为什么这里不用{}？
connection.connect();
connection.query(`SELECT TABLE_NAME FROM information_schema.tables WHERE TABLE_SCHEMA = ?;`, [appConfig.DATABASE_NAME], function (err, rows, fields) {
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
		width: 600,
		height: 1024,
		minWidth: 400,
		title: `Healthily Use Computer ${VERSION}`,
		icon: path.join(__dirname, './public/Logo.ico'),

		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
			// preload: "./preload.js"
			// !啊所以为什么不用preload了？是因为上面关了上下文隔离？确实…………而且再打开以后react无法使用windows.require了…………
		},
	});
	if (app.isPackaged) {
		win.removeMenu();

		// win.loadFile(path.join(__dirname, './build/index.html'));
		// ！并不是直接这样加载…………
		win.loadURL(url.format({
			pathname: path.join(__dirname, './build/index.html'),
			protocol: 'file:',
			slashes: true
		}))
	}
	else {
		win.loadURL('http://localhost:3000/');
		win.webContents.openDevTools();
	}
	// ！关于打包
	// 03-17搞了半天了啊啊啊啊啊啊啊啊！！！！！
	// !打包也不容易！React注意先在package里面搞好homepage以后在build react！！不然依然找不到！

	// !似乎不能直接electron-forge make之类，必须用npm run script
	// !You must depend on "electron-prebuilt-compile" in your devDependencies
	// !出现过Cannot convert undefined or null to object；Command failed: npm prune --production；Failed to locate module "@types/testing-library__jest-dom" from "；或者make时提到各种moudle缺失，都能在用forge init以后解决………………
	// !艹用electron-forge好像是初始化然后把moudle都搞坏了差点又跑不了，最后想起来必须用cnpm来装，装了就行了
	// !用https://www.electronjs.org/zh/blog/forge-v6-release官方electorn-forge无法导入electron-forge，参考https://blog.csdn.net/qq_49700358/article/details/126531158直接手动修改package然后cnpm i才装上
	// !多种方式尝试导入electron-forge失败………………最后居然是新建一个forge项目再复制原代码过来才能make………………
	// ！太难了…………最终解决方案是新建react项目然后直接在项目根目录forge init，然后把之前的package对照一下复制过来包括dependence一类然后cnpm i
	// ！指令：npx electron-forge init
	// !但是本页虽然能跑现在依然大量报错不知道为什么………………
	// !报错原来是eslint的问题…………cnpm i不小心也装进来了…………
	// !似乎不需要先react init，慢慢调一下package就行
	// !"main.js不能在项目根目录……"
	// !依然困难……………………怀疑是cnpm i的时候把package里面没有的删掉了，尝试保存forge初始化的moudle再复制进去无效
	// !此时居然electron又坏了说什么找不到electron/main的moudle好不容易明白什么意思，又要重新安装
	// td这个/main在可打包的环境中删掉了不知道是不是关键
	// !还有注意什么resource busy or locked除了可能要删掉那个lock文件还可能是之前启动的进程没有关掉
	// !Could not find any make targets configured for the "win32" platform.时请注意package里面要用forge原生的config
	// !尝试了只复制源码过去在那边再次npm i，似乎forge原生的electron功能不全要再cnpm一次，cnpm也是可能出错的，明显提示了electron可能没正确安装不要放弃试一下重装
	// !终于成功！！！！！！！！！！！！！！！不成功就怪了原生的项目都成功不了就去死吧
	// !啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊现在是01:41了啊啊啊啊啊啊啊啊啊啊
	// !上课折腾…………改变main.js位置后其实有一堆路径不对了打包几次才全部发现
	// !同时注意如果不是import的文件最好用path.join…………不然可能会出现开发环境和生产环境的路径不同………………
	// !注意如果遇到直接estart可以启动用vsc调试却报错找不到什么 - version的考虑重启vsc

	// !尝试使用electron-builder打包，意外地发现居然能打！！而且还挺快艹…………
	// !Application entry file “build/electron.js“是配置下少了"extends": null
	// !同样需要添加配置，其中directories为输出文件夹，extraResources那里应该是需要用到的外部文件比如网页，网上有用files的写法但是一写就报错找不到src/main.js
	// !艹又看到说了这个files加一个main.js就可以打包了
	// !nsis为安装器配置，oneClick是打开后直接安装，具体见https://www.jianshu.com/p/4699b825d285
	// !但是安装完后白屏，再次打开devtool才知道又被限制访问本地文件了…………
	// !尝试把main.js移出来没用
	// !尝试在loadFile和loadURL反复切换最后没变化依然用loadURL
	// !https://blog.csdn.net/weixin_42826294/article/details/113595030以及https://blog.csdn.net/xidianyueyong/article/details/98182687提到和react的build冲突，改个名然后就能开了啊啊啊啊啊啊啊啊啊！！！！！！！！！！！
	// !不过此时依然无法启动监视进程……，尝试https://wenku.csdn.net/answer/7quh6cnm17关掉webSecurity无效
	// !后来注意到files，extrafiles和extrasources，其实files加上main.js就能跑了…………
	// !关于extrafiles和extrasources，字面意思，files为静态文件，直接复制到根目录，source为资源文件要通过api获取
	// ！最终解决！！！外部的exe文件必须通过extraFiles同时在main.js里面用path.join(process.cwd(), '...')来获取！多次验证了！
	// !似乎json文件可以不用这种方式而可以直接require到
	// !搞了一天半了啊啊啊啊啊啊啊啊啊！！！！！！！！
	// !az尝试将json放到extraFiles以便暴露在软件根目录以后就必须要用process.cwd()了……也是毕竟不在asar里面了
	// !然后打包莫名慢了好多………………………………
	// !额不知道为什么打包后点击软件无反应…………
	// !额后来不放在根目录也慢了…………应该不是位置的问题
	// !同时意外测试到了，extraFiles那里开头不能有/！！！一有就废！不过你复制过来也行
	// !同时用builder以后意外也修好了用forge打包时浏览器样式不同的问题（forge那个样式真的丑），同时forge打包也出现了部分样式和开发环境不同，例如侧栏图标无法对齐，控制台文字无法超出隐藏

	// app.whenReady().then(createWindow());
	// ！艹为什么一定是这个写法…………上面那个之前明明行的…………
	// const runtimeLogFileStream = require("fs");
	// const readLine = require("line-reader");
	// ~~被迫引入模块…………
	// ipcMain.once("GetRuntimeLog", DeliverContent)
	// ！最后是改once解决的！！
	// runtimeLogFileStream.watch("./output.rlf", DeliverContent)
	// !真奇怪，这个watch必须要vsc获得了焦点才能即时反应…………其它应用都不行…………希望实际打包以后能实现吧…………

	//**----------------------------Tray-----------------------------------------------------
	const ContextMenu_Tray = Menu.buildFromTemplate([
		{
			label: "重启",
			click: () => { isToQuit = true; app.relaunch(); }
		},
		{
			label: "退出",
			// role: "close"
			click: () => { isToQuit = true; app.quit(); }
			// !额两个都关不了………………
			// !quit关不了…………是下面的win.on("close")导致的…………
		}])
	tray = new Tray(path.join(__dirname, './public/Logo.ico'));
	tray.on("click", () => {
		// if (win.isMinimized()) return;
		// !？？？明明去掉!就可以判断了？？？
		UpdateRunTime(adjudgeDateBy4(new Date()))
		UpdateLastSeven();
		win.show();
	})
	tray.setContextMenu(ContextMenu_Tray)
	tray.setToolTip(`Healthily Use Computer ${VERSION}`)

	// if(dialog.showMessageBoxSync({
	// 	title: "Healthily Use Computer",
	// 	message: "是否退出？",
	// 	buttons: ["是", "否"],
	// 	defaultId: 1,
	// 	cancelId: 1,
	// 	noLink: true
	// }) === 0)
	win.on("close", (event) => {
		if (isToQuit) return;
		event.preventDefault();
		win.hide();
		// win.hide("5s");//!并没有用…………
	})
	app.setLoginItemSettings({ openAtLogin: appConfig.StartBoot })
	ipcMain.on("setting_startboot_change", (event, arg) => {
		appConfig.StartBoot = arg;
		fs.writeFileSync(path.join(process.cwd(), "config.json"), JSON.stringify(appConfig, null, 4))
		app.setLoginItemSettings({ openAtLogin: arg });
		event.reply("setting_startboot_change", arg)
	})
	ipcMain.on('setting_follow_system_dark_mode_change', (event, arg) => {
		appConfig.FollowSystemDarkMode = arg;
		fs.writeFileSync(path.join(process.cwd(), "config.json"), JSON.stringify(appConfig, null, 4))
		setFollowSystemDarkMode(appConfig.FollowSystemDarkMode)
		event.reply("setting_follow_system_dark_mode_change", arg)
	})
}
//**----------------------------ContextMenu-----------------------------------------------------
// !会和单独元素的右键彩蛋冲突…………
// win.webContents.on("context-menu", (event, params) => {
// 	// const { } = params;
// 	ContextMenu_Fresh.popup();
// })
// let contextMenuWin = new BrowserWindow({
// 	width: 50,
// 	height: 100,
// });
// ContextMenu_Fresh = Menu.buildFromTemplate([
// 	{
// 		label: "刷新",
// 		accelerator: "F5",
// 		role: "reload"
// 		// 	click: (menuItem, browserWindow, event) => {
// 		// 		switch (menuItem)
// 		// }
// 	}])

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
			UpdateRunTime(adjudgeDateBy4(new Date()));
		}
	}])
ContextMenu_LastSeven = Menu.buildFromTemplate([
	{
		label: "刷新",
		click: (menuItem, browserWindow, event) => {
			UpdateLastSeven()
		}
	}])
ContextMenu_EditAppInfo = Menu.buildFromTemplate([
	{
		label: "编辑",
		click: (menuItem, browserWindow, event) => {
			win.webContents.send("set_edit");
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
ipcMain.on("ContextMenu_EditAppInfo", (event, arg) => {
	event.preventDefault();
	ContextMenu_EditAppInfo.popup()
})
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
// app.on('activate', () => {
// 	UpdateRunTime(adjudgeDateBy4(new Date()))
// 	UpdateLastSeven();
// })
// !无效……仅在macOS平台上生效
ipcMain.on("UpdateRunTime", (event, arg) => {
	UpdateRunTime(arg);
})
// ！az在electron里面打开没办法初始化文件………………
//!艹注意这个不要放里面…………
//**----------------------------UIInit-----------------------------------------------------
ipcMain.on("UIInited", (event, arg) => {
	MonitorInit();
	//**---------------------------------------------------------------------------------
	UpdateRunTime(adjudgeDateBy4(new Date()))
	UpdateLastSeven();

	win.webContents.send("get_app_config", appConfig);
})
//**----------------------------Monitor-----------------------------------------------------
function MonitorInit() {
	MonitorPcs = spawn(path.join(process.cwd(), '/Monitor/HUC_Backend.exe'), []);
	// ！就唯独这个必须要用process.cwd()才能读到…………上面的json可以直接require…………
	MonitorPcs.stdout.on("data", async (data) => {
		// !这个依然要在定义了以后才能执行………………
		win.webContents.send("ConsoleReOpen");
		//**----------------------------Console-----------------------------------------------------
		// var datas = d.toString().split("\n");
		// datas.forEach((data) => {
		// 	if (data === "") return;//！原来就是用的return！
		// console.log(`stdout: ${iconv.decode(data, 'cp936')}`);
		var dataLines = iconv.decode(data, 'cp936').split("\n").filter((item) => item !== "");
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
					MonitorState = true;

					tray.setImage(path.join(__dirname, './public/Tray_Open.ico'))
				}
				else if (cmdProps[3] === "Stop\r") {
					win.webContents.send("MonitorStateChange", false);
					MonitorState = false;

					tray.setImage(path.join(__dirname, './public/Tray_Close.ico'))
				}
			}
		})
		//**----------------------------RunningAppIcons-----------------------------------------------------
		AppInfo = JSON.parse(fs.readFileSync(path.join(process.cwd(), "AppInfo.json")))

		// AppInfo = require(path.join(process.cwd(), "AppInfo.json"));
		// !注意不要忘记更新…………

		var runningAppsInfo = [];
		runningApps.forEach(app => {
			var tmpAppInfo = [];
			tmpAppInfo.push(app);
			let isPushed = false;
			Object.entries(AppInfo).forEach((appInfo) => {
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
		// setTimeout(() => { if ((MonitorPcs = spawn("./src/Monitor/HUC_Backend.exe")) !== null) win.webContents.send("ContentUpdate", "Monitor Reboot Successfully!"); }, 1000)
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
	// MonitorPcs.stdin.write(`${iconv.encode(`${arg}\n`, 'cp936')}`);
	// ！！！！！！原方法！！！我说怎么明明就是cp936编码传过去就是乱，用了``nodejs自己转回去了啊啊啊啊啊！！！！！！！！！！！！！！！！
	MonitorPcs.stdin.write(iconv.encode(`${arg}\n`, 'cp936'));
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
//**----------------------------DarkMode-----------------------------------------------------
var isDarkMode = false
ipcMain.on("DarkModeChange", (event, arg) => {
	if (arg) {
		nativeTheme.themeSource = 'dark'
		isDarkMode = true;
	}
	else {
		nativeTheme.themeSource = 'light'
		isDarkMode = false;
	}
})
// td加入跟随系统的设置
function setFollowSystemDarkMode(follow) {
	if (follow) {
		nativeTheme.on('updated', () => {
			isDarkMode = nativeTheme.shouldUseDarkColors
			win.webContents.send('DarkModeChange_fromSystem', isDarkMode)
		})
		nativeTheme.themeSource = 'system';
		// ！注意不要漏了这个…………不然无法updated！
	}
	else {
		nativeTheme.removeAllListeners('updated');
		if (isDarkMode) nativeTheme.themeSource = 'dark';
		else nativeTheme.themeSource = 'light';
	}
}
//**----------------------------AppInfo-----------------------------------------------------
ipcMain.on('update_app_info', (event, arg) => {
	// var json = "";
	// arg.forEach(value => json += `${JSON.stringify({ [value[0]]: { 'Icon': value[3], 'Class': value[1], 'Color': value[2] } }, null, 4)},`)

	// const json = [];
	// arg.forEach(value => json.push({ [value[0]]: { 'Icon': value[3], 'Class': value[1], 'Color': value[2] } }))

	var jsonObj = {};
	arg.filter(v => v[1] !== "None").forEach(value =>
		// !注意和固定名称的jsonObj.Icon不一样！
		// ！在json中这个[]非常常用！
		jsonObj[value[0]] = {
			'Icon': value[3],
			'Class': value[1],
			'Color': value[2]
		}
	)
	fs.writeFileSync(path.join(process.cwd(), "AppInfo.json"), JSON.stringify(jsonObj, null, 4))
	// !一不用Sync就强制要求你要用回调…………
	UpdateRunTime(new Date());
})
//**----------------------------RunTimeShow-----------------------------------------------------
ipcMain.on('update_run_time', () => [UpdateRunTime(new Date())])
//~~艹最关键是这个async吧………………
function UpdateRunTime(date) {
	// console.log("Enter Func UpdateRunTime");
	// if (connection.state == "disconnected")
	// ！mysql模块居然是旧版的…………报错说客户端不支持
	// !上网查了说是改plugin，lyog里面改了以后突然登不上
	// !要被吓死还好看到网上，其实这个时候是没有密码，输入密码直接回车就能进了，后续再改密码就行
	// !相关：报错mysql Client does not support authentication protocol requested by server; consider upgrading MySQL client
	// !ERROR 1045(28000)就是密码错误或者服务器关闭之类的无法登录
	// !新版caching_sha2_password旧版mysql_native_password


	// ！艹！！！！终于定位问题了………………………………一直以为执行了两次Update函数，还非常好奇为什么query函数执行完后面为什么断点没用了
	// ！其实本质就是回调………………太慢了导致顺序都反了………………搞一堆log都没用………………………………
	// let queryRunTimeInfo = new Promise((resolve, reject) => {//！不用Promise.all的话其实只是为了解决回调嵌套而已你这种简单的嵌套用不上
	// let runTimeInfo = Promise.all((resolve, reject) => {//！傻…………返回的不是结果是Promise对象…………
	// ！注意Promise.all传入的是数组而不是函数！
	AppInfo = JSON.parse(fs.readFileSync(path.join(process.cwd(), "AppInfo.json")))
	// ！注意readFileSync是同步不是异步…………………………可以用的…………
	// ！然后注意返回的是buffer…………可以用JSON.parse转换回来！
	Promise.all(
		// ！哦哦哦！！！.all是执行里面全部的 Promise ！！不是执行任意函数啊…………
		// ！！！map和forEach的另一个差别是前者才能实现异步而后者是同步遍历的！！！！！
		// ！这里搞了巨久，现在不知道当初为什么会不得了，有可能是resolve了错误的变量…………不论如何Promise.all在mysql上是正常运作的…………
		mntApps.map(async mntApp => {
			let isPushed = false;
			let tmpRunTimeInfo = [];
			tmpRunTimeInfo.push(mntApp);
			Object.entries(AppInfo).forEach((appInfo) => {
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
			// !艹明确有两个复合查询…………
			// Promise.all((resolve, reject) => {
			// await new Promise((resolve, reject) => {
			try {
				// !人都傻了这里现在还是到最后才调用…………
				return await new Promise((resolve, reject) => {
					connection.query(`SELECT * FROM ${mntApp} WHERE StartTime${toQueryString(date, 1)};`, function (error, res) {
						if (error !== null) {
							console.log(`Failed to Read DB: ${error}`)
							throw error;
							// return;
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
						// runTimeInfo.push(tmpRunTimeInfo);
						resolve(tmpRunTimeInfo);
					})
				})
			} catch {
				//td查询失败通知
			}
			// });
		})
	).then((runTimeInfo) => { win.webContents.send("UpdateRunTime", [runTimeInfo, date]); })
	// connection.end();

	// });
	// td这里多次发送的逻辑还是错了…………目前有概率导致崩溃，重做…………
}
function toQueryString(startDate, days) {
	let former = startDate;
	let latter = new Date(former.getTime() + 24 * 60 * 60 * 1000 * days);
	return ` BETWEEN '${former.getFullYear()}-${former.getMonth() + 1}-${former.getDate()} 04:00:00' AND '${latter.getFullYear()}-${latter.getMonth() + 1}-${latter.getDate()} 04:00:00'`
}
//**----------------------------LastSeven-----------------------------------------------------
ipcMain.on("UpdateLastSeven", (event, arg) => {
	UpdateLastSeven(arg);
})
function UpdateLastSeven() {
	// if (connection.state == "disconnected")
	// 	connection.connect();
	var result = [];
	// !艹两个嵌套不搞Promise了………………
	// !艹当时就已经用变量处理的很好了哈哈哈艹
	// var curStep = 0;
	[6, 5, 4, 3, 2, 1, 0].forEach((value) => {
		// !虽然按理来说应该是6~0…………但是不知道为什么就是慢了一天…………面向结果编程了
		let totalMin = 0;
		let i = 0;
		mntApps.forEach(mntApp => {
			// console.log(`SELECT * FROM ${mntApp} WHERE StartTime${toQueryString(new Date(today.getTime() - value * 24 * 60 * 60 * 1000), 1)};`)
			connection.query(`SELECT * FROM ${mntApp} WHERE StartTime${toQueryString(new Date(today.getTime() - value * 24 * 60 * 60 * 1000), 1)};`, function (error, res) {
				// !算了如果要用复杂的query语句也是要用mntApps.forEach的…………先不搞了
				if (error !== null) {
					console.log(`Failed to Read DB: ${error}`)
					throw error;
					// return;
				}
				res.forEach(row => {
					totalMin += row.LastTime;
				})
				if (++i > mntApps.length - 1) {
					result.push(totalMin / 60);
					if (value === 0)
						win.webContents.send("UpdateLastSeven", result);
					// !md变量乱命名了为………………传错了都不知道………………
				}
			})
		})
		// !艹这个异步好烦啊………………
	})
}
//**----------------------------UpdateSingleAppInfo-----------------------------------------------------
ipcMain.on('update_single_app_info', (event, arg) => {
	Promise.all(
		[6, 5, 4, 3, 2, 1, 0].map(async (value, index) => {
			return await new Promise((resolve, reject) => {
				// console.log(`SELECT * FROM ${arg[0]} WHERE StartTime${toQueryString(new Date(today.getTime() - (arg[1] * 7 + value) * 24 * 60 * 60 * 1000), 1)};\n`)
				connection.query(`SELECT * FROM ${arg[0]} WHERE StartTime${toQueryString(new Date(today.getTime() - (arg[1] * 7 + value) * 24 * 60 * 60 * 1000), 1)};`, (err, res) => {
					let tmpTime = 0;
					if (err !== null) {
						console.log(`Failed to Read DB: ${err}`)
						throw err;
						// return;
					}
					res.forEach(row => {
						tmpTime += row.LastTime;
					})
					resolve(tmpTime / 60);
				})
			})
		})).then((res) => win.webContents.send('update_single_app_info', res))
})
function adjudgeDateBy4(date) {
	var d = new Date(date);
	if (d.getHours() <= 4) {
		d.setDate(d.getDate() - 1)
	}
	return d;
}

//**----------------------------test-----------------------------------------------------
module.exports = {
	appConfig,
	toQueryString,
	adjudgeDateBy4
}
// ！是电量太低了吗突然electron就无法加载页面，还以为是main.js的问题但是回退都不行，最后重启vsc就行了