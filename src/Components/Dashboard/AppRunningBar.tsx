// ！尝试改成ts但是似乎react用不了？哦哦是tsx哈哈
// !改了tsx又忘记tailwindcss的配置…………
import React from 'react';

import { useState } from "react"
import More from "../../Asset/three-dots.svg"
const ipcRenderer = window.require("electron").ipcRenderer;
// var AppStateFile = JSON.parse(require("./AppState.json"));
ipcRenderer.send("GetAppIcon");
ipcRenderer.send("GetAppState");
ipcRenderer.on("GetAppIcon", (event, arg) => {

})
ipcRenderer.on("GetAppState", (event, arg) => {
	console.log(arg)
})
function AppRunning(props) {

	return (
		<div className="w-16 h-16 mx-1 p-2 rounded-2xl bg-blue-300 shadow-2xl transition-all hover:bg-blue-400" > <img className="w-full h-full" src={props.img} alt="More" /> </div>
	);
	// ！艹艹艹啊啊啊啊啊又是props的问题！！！！！！！！！！！！！
}
function ShowMore() {
	return (
		<div className="w-16 h-16 mx-1 p-2 rounded-2xl bg-blue-300 shadow-2xl transition-all hover:bg-blue-400" > <img className="w-full h-full" src={More} alt="More" /> </div>
	)
}
export default function AppRunnningBar(props) {
	const [AppInfo, UpdateAppState] = useState(Object.values(require("./AppIcon.json")))
	// ！require会默认解析为json对象
	return (
		<div className="w-full h-20 p-2 relative rounded-2xl bg-blue-200 flex" >
			<span className="absolute -top-4 left-4 text-xl" > 运行中应用 </span>
			{AppInfo.map((item, index) => {
				return (
					<AppRunning key={index} img={Object.values(item)[1]} />
				)
			})}
			< ShowMore />
			<span className="px-2 absolute -top-4 right-4 bg-white rounded-2xl shadow-2xl text-sm transition-all hover:bg-gray-100" > 已监视应用 </span>
		</div>
	)
}