const { app, BrowserWindow } = require('electron');
const createWindow = () => {
	const win = new BrowserWindow({
		width: 1440,
		height: 1024,

		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});
	// win.removeMenu();
	// win.loadFile("./src/test/ScollTest.html")
	win.loadURL('http://localhost:3000/');
}
// app.whenReady().then(createWindow());
app.on('ready', createWindow);
// ！艹为什么一定是这个写法…………上面那个之前明明行的…………