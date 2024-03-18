// ！尝试改成ts但是似乎react用不了？哦哦是tsx哈哈
// !改了tsx又忘记tailwindcss的配置…………
// td加入刷新功能
import React from 'react';

import { useState } from "react"
import More from "../../Asset/three-dots.svg"
const ipcRenderer = window.require("electron").ipcRenderer;
// var AppStateFile = JSON.parse(require("./AppState.json"));

function AppRunning(props) {
	return (
		<div className="w-16 h-16 mx-1 p-2 relative rounded-2xl bg-blue-300 shadow-2xl transition-all hover:bg-blue-400 text-transparent hover:text-black" > <img className="w-full h-full" src={props.img} alt="More" /> <span className='w-12 absolute bottom-0 text-center'>{props.appName}</span></div>
	);
	// ！艹艹艹啊啊啊啊啊又是props的问题！！！！！！！！！！！！！
}
// function ShowMore() {
// 	return (
// 		<div className="w-16 h-16 mx-1 p-2 rounded-2xl bg-blue-300 shadow-2xl transition-all hover:bg-blue-400" > <img className="w-full h-full" src={More} alt="More" /> </div>
// 	)
// }
export default function AppRunnningBar() {
	// const [AppIcons, UpdateAppIcons] = useState([])
	// !艹…………还要分别传过来然后比较再合并………………在main处理完再传过来吧…………
	// ！本来也应该按照“渲染”进程的叫法分开操作的呀…………
	const [RunningAppInfo, UpdateRunningAppInfo] = useState([])
	// !艹又来…………反复调用………………
	// ipcRenderer.on("GetAppIcons", (event, arg) => {
	// 	UpdateAppIcons(arg);
	// })
	ipcRenderer.on("UpdateRunningAppInfo", (event, arg) => {
		UpdateRunningAppInfo(arg);
	})
	// RunningApp.map((item, index) => {
	// 	AppIcons.forEach(icon => {
	// 		if (item[0] == RunningApp[0]) {
	// 		}
	// 	})
	// })
	// ！require会默认解析为json对象
	return (
		<div className="w-full h-20 p-2 relative rounded-2xl bg-blue-200 flex" >
			<span className="absolute -top-4 left-4 text-xl" > 运行中应用 </span>
			{RunningAppInfo.length === 0 ? <span className="w-full h-full p-5 text-xl text-center text-gray-500">暂无</span> : RunningAppInfo.map((item, index) => {
				return (
					<AppRunning key={index} appName={item[0]} img={item[1]} />
				)
			})}
			{/* < ShowMore /> */}
			<span className="px-2 absolute -top-4 right-4 bg-white rounded-2xl shadow-2xl text-sm transition-all hover:bg-gray-100" > 已监视应用 </span>
		</div>
	)
}
// ！sent的这种都应该放在最后面
// ipcRenderer.send("GetAppIcons");
